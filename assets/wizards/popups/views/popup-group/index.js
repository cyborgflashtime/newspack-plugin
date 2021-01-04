/**
 * Pop-ups wizard screen.
 */

/**
 * WordPress dependencies.
 */
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useState, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ESCAPE } from '@wordpress/keycodes';

/**
 * External dependencies.
 */
import { find } from 'lodash';

/**
 * Internal dependencies
 */

import { withWizardScreen, Button, Popover, SelectControl } from '../../../../components/src';
import PopupActionCard from '../../components/popup-action-card';
import SegmentationPreview from '../../components/segmentation-preview';
import { isOverlay } from '../../utils';
import './style.scss';

const descriptionForPopup = (
	{ categories, sitewide_default: sitewideDefault, options },
	segments
) => {
	const segment = find( segments, [ 'id', options.selected_segment_id ] );
	const descriptionMessages = [];
	switch ( options.placement ) {
		case 'above_header':
			descriptionMessages.push( __( 'Above header', 'newspack' ) );
			break;
		case 'inline':
			descriptionMessages.push( __( 'Inline', 'newspack' ) );
			break;
		default:
			descriptionMessages.push( __( 'Overlay', 'newspack' ) );
			break;
	}
	if ( segment ) {
		descriptionMessages.push( `${ __( 'Segment:', 'newspack' ) } ${ segment.name }` );
	}
	if ( sitewideDefault ) {
		descriptionMessages.push( __( 'Sitewide default', 'newspack' ) );
	}
	if ( categories.length > 0 ) {
		descriptionMessages.push(
			__( 'Categories: ', 'newspack' ) + categories.map( category => category.name ).join( ', ' )
		);
	}
	return descriptionMessages.length ? descriptionMessages.join( ' | ' ) : null;
};

/**
 * Popup group screen
 */
const PopupGroup = ( {
	deletePopup,
	items: { active = [], draft = [], inactive = [] },
	manageCampaignGroup,
	previewPopup,
	setTermsForPopup,
	setSitewideDefaultPopup,
	publishPopup,
	updatePopup,
	segments,
	settings,
} ) => {
	const activeCampaignGroup = settings.reduce(
		( acc, { key, value } ) => ( key === 'newspack_popups_active_campaign_group' ? value : acc ),
		null
	);
	const [ campaignGroup, setCampaignGroup ] = useState( -1 );
	const [ campaignGroups, setCampaignGroups ] = useState( null );
	const [ segmentId, setSegmentId ] = useState();
	const [ previewPopoverIsVisible, setPreviewPopoverIsVisible ] = useState();

	useEffect( () => {
		apiFetch( {
			path: '/wp/v2/newspack_popups_taxonomy?_fields=id,name',
		} ).then( terms => setCampaignGroups( terms ) );
	}, [] );

	useEffect( () => {
		if ( -1 === campaignGroup && activeCampaignGroup > 0 ) {
			setCampaignGroup( activeCampaignGroup );
		}
	}, [ activeCampaignGroup ] );

	const getCardClassName = ( { options, sitewide_default: sitewideDefault, status } ) => {
		if ( 'draft' === status ) {
			return 'newspack-card__is-disabled';
		}
		if ( sitewideDefault ) {
			return 'newspack-card__is-primary';
		}
		if ( isOverlay( { options } ) && ! sitewideDefault ) {
			return 'newspack-card__is-disabled';
		}
		return 'newspack-card__is-supported';
	};

	const filteredByGroup = itemsToFilter =>
		-1 === campaignGroup
			? itemsToFilter
			: itemsToFilter.filter(
					( { campaign_groups: groups } ) =>
						groups && groups.find( term => +term.term_id === campaignGroup )
			  );

	return (
		<Fragment>
			<div className="newspack-campaigns__popup-group__filter-group-wrapper">
				<div className="newspack-campaigns__popup-group__filter-group-actions">
					<SelectControl
						options={
							campaignGroups
								? [
										{ value: -1, label: __( 'All Campaigns', 'newspack' ) },
										...campaignGroups.map( term => ( {
											value: term.id,
											label:
												term.name +
												( activeCampaignGroup === term.id ? __( ' - active', 'newspack' ) : '' ),
										} ) ),
								  ]
								: []
						}
						value={ campaignGroup }
						onChange={ value => setCampaignGroup( +value ) }
						label={ __( 'Groups', 'newspack' ) }
						labelPosition="side"
					/>
					{ campaignGroup > 0 && (
						<SegmentationPreview
							campaignGroups={ campaignGroup }
							segment={ segmentId }
							renderButton={ ( { showPreview } ) => (
								<div className="newspack-campaigns__popup-group__filter-group-segmentation">
									{ activeCampaignGroup !== campaignGroup && (
										<Button
											isTertiary
											isSmall
											onClick={ () => manageCampaignGroup( campaignGroup ) }
										>
											{ __( 'Activate', 'newspack' ) }
										</Button>
									) }
									{ activeCampaignGroup === campaignGroup && (
										<Button
											isTertiary
											isSmall
											onClick={ () => manageCampaignGroup( campaignGroup, 'DELETE' ) }
										>
											{ __( 'Deactivate', 'newspack' ) }
										</Button>
									) }
									<Button
										isTertiary
										isSmall
										onClick={ () => setPreviewPopoverIsVisible( ! previewPopoverIsVisible ) }
									>
										{ __( 'Preview', 'newspack' ) }
									</Button>
									{ previewPopoverIsVisible && (
										<Popover
											className="has-select-border"
											position="bottom right"
											onFocusOutside={ () => setPreviewPopoverIsVisible( false ) }
											onKeyDown={ event =>
												ESCAPE === event.keyCode && setPreviewPopoverIsVisible( false )
											}
										>
											<SelectControl
												options={ [
													{ value: '', label: __( 'Default (no segment)', 'newspack' ) },
													...segments.map( s => ( { value: s.id, label: s.name } ) ),
												] }
												value={ segmentId }
												onChange={ setSegmentId }
												label={ __( 'Segment to preview', 'newspack' ) }
											/>
											<Button
												isLink
												onClick={ () => {
													showPreview();
													setPreviewPopoverIsVisible( false );
												} }
											>
												{ __( 'Preview', 'newspack' ) }
											</Button>
										</Popover>
									) }
								</div>
							) }
						/>
					) }
				</div>
				<Button isPrimary isSmall href="/wp-admin/post-new.php?post_type=newspack_popups_cpt">
					{ __( 'Add New', 'newspack' ) }
				</Button>
			</div>
			{ filteredByGroup( [ ...active, ...draft, ...inactive ] ).map( campaign => (
				<PopupActionCard
					className={ getCardClassName( campaign ) }
					deletePopup={ deletePopup }
					description={ descriptionForPopup( campaign, segments ) }
					key={ campaign.id }
					popup={ campaign }
					previewPopup={ previewPopup }
					setTermsForPopup={ setTermsForPopup }
					setSitewideDefaultPopup={ setSitewideDefaultPopup }
					updatePopup={ updatePopup }
					publishPopup={ publishPopup }
				/>
			) ) }
		</Fragment>
	);
};
export default withWizardScreen( PopupGroup );
