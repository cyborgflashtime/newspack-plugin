/**
 * WordPress dependencies
 */
import { useState, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	withWizardScreen,
	Button,
	Card,
	CategoryAutocomplete,
	Grid,
	SelectControl,
	ToggleControl,
} from '../../../../components/src';
import SegmentationPreview from '../../components/segmentation-preview';
import './style.scss';

/**
 * Popups "View As" Preview screen.
 */
const Preview = ( { segments } ) => {
	const [ segmentId, setSegmentId ] = useState( '' );
	const [ groupTaxIds, setGroupTaxIds ] = useState( [] );
	const [ showUnpublished, setShowUnpublished ] = useState( false );

	return (
		<Fragment>
			<Grid>
				<Card noBorder>
					{ __(
						'View your site as a reader in a selected segment, or with campaigns in selected groups. Choose a reader segment and/or one or more groups, then click the "Preview" button to view your site as a reader in that segment. Only the campaigns that match the selected segment and group(s) will be shown. Check the "Show unpublished campaigns" option to preview unpublished (draft, pending, or scheduled) campaigns in addition to published campaigns.',
						'newspack'
					) }
				</Card>
				<Card noBorder>
					<SelectControl
						options={ [
							{ value: '', label: __( 'Default (no segment)', 'newspack' ) },
							...segments.map( s => ( { value: s.id, label: s.name } ) ),
						] }
						value={ segmentId }
						onChange={ setSegmentId }
						label={ __( 'Segment', 'newspack' ) }
					/>
					<CategoryAutocomplete
						value={ groupTaxIds }
						onChange={ selected => {
							setGroupTaxIds( selected.map( item => item.id ) );
						} }
						taxonomy="newspack_popups_taxonomy"
						label={ __( 'Groups', 'newspack' ) }
					/>
					<ToggleControl
						label={ __( 'Show unpublished campaigns', 'newspack' ) }
						checked={ showUnpublished }
						onChange={ () => setShowUnpublished( ! showUnpublished ) }
					/>
				</Card>
			</Grid>
			<div className="newspack-buttons-card">
				<SegmentationPreview
					campaignGroups={ groupTaxIds }
					segment={ segmentId }
					showUnpublished={ showUnpublished }
					renderButton={ ( { showPreview } ) => (
						<Button isPrimary onClick={ showPreview }>
							{ __( 'Preview', 'newspack' ) }
						</Button>
					) }
				/>
			</div>
		</Fragment>
	);
};

export default withWizardScreen( Preview );
