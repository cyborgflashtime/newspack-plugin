/**
 * Segmentation Preview component.
 * Extension of WebPreview with support for "view-as-segment" functionality.
 */

/**
 * WordPress dependencies
 */
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import { WebPreview } from '../../../../components/src';

const SegmentationPreview = props => {
	const postPreviewLink = window?.newspack_popups_wizard_data?.preview_post;
	const frontendUrl = window?.newspack_popups_wizard_data?.frontend_url || '/';

	const {
		campaignGroups = [],
		campaignsToDisplay = [],
		onLoad = () => {},
		segment = '',
		showUnpublished = false,
		url = postPreviewLink || frontendUrl,
	} = props;

	const decorateURL = urlToDecorate => {
		const view_as = segment.length ? [ `segment:${ segment }` ] : [ 'all' ];

		if ( showUnpublished ) {
			view_as.push( 'show_unpublished:true' );
		}

		// If passed group IDs, those take precedence. Otherwise, look for an array of campaign IDs.
		if ( 0 < campaignGroups.length ) {
			view_as.push( `groups:${ sanitizeTerms( campaignGroups ).join( ',' ) }` );
		} else if ( 0 < campaignsToDisplay.length ) {
			view_as.push( `campaigns:${ sanitizeTerms( campaignsToDisplay ).join( ',' ) }` );
		}

		return addQueryArgs( urlToDecorate, { view_as: view_as.join( ';' ) } );
	};

	const onWebPreviewLoad = iframeEl => {
		if ( iframeEl ) {
			[ ...iframeEl.contentWindow.document.querySelectorAll( 'a' ) ].forEach( anchor => {
				const href = anchor.getAttribute( 'href' );
				if ( href.indexOf( frontendUrl ) === 0 ) {
					anchor.setAttribute( 'href', decorateURL( href ) );
				}
			} );
			onLoad( iframeEl );
		}
	};

	const sanitizeTerms = items =>
		( Array.isArray( items ) ? items : [ items ] ).map( item => {
			switch ( typeof item ) {
				case 'number':
					return item;
				case 'object':
					if ( item.id ) {
						return item.id;
					}
					break;
			}
			return null;
		} );

	return <WebPreview { ...props } onLoad={ onWebPreviewLoad } url={ decorateURL( url ) } />;
};

export default SegmentationPreview;
