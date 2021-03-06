<?php
/**
 * Newspack Pop-ups Configuration Manager
 *
 * @package Newspack
 */

namespace Newspack;

use \WP_Error;

defined( 'ABSPATH' ) || exit;

require_once NEWSPACK_ABSPATH . '/includes/configuration_managers/class-configuration-manager.php';

/**
 * Provide an interface for configuring and querying the configuration of Newspack Pop-ups.
 */
class Newspack_Popups_Configuration_Manager extends Configuration_Manager {

	/**
	 * The slug of the plugin.
	 *
	 * @var string
	 */
	public $slug = 'newspack-popups';

	/**
	 * Get whether the Newspack Popups plugin is active and set up.
	 *
	 * @return bool Whether Newspack Popups is installed and activated.
	 */
	public function is_configured() {
		return class_exists( 'Newspack_Popups_Model' );
	}

	/**
	 * Retrieve all Pop-up CPTs
	 *
	 * @param  boolean $include_unpublished Whether to include unpublished posts.
	 * @return array All Pop-ups
	 */
	public function get_popups( $include_unpublished = false ) {
		return $this->is_configured() ?
			\Newspack_Popups_Model::retrieve_popups( $include_unpublished ) :
			$this->unconfigured_error();
	}

	/**
	 * Set the sitewide Popup.
	 *
	 * @param integer $id ID of sitewide popup.
	 */
	public function set_sitewide_popup( $id ) {
		return $this->is_configured() ?
			\Newspack_Popups_Model::set_sitewide_popup( $id ) :
			$this->unconfigured_error();
	}

	/**
	 * Unset the sitewide Popup.
	 *
	 * @param integer $id ID of sitewide popup.
	 */
	public function unset_sitewide_popup( $id ) {
		return $this->is_configured() ?
			\Newspack_Popups_Model::unset_sitewide_popup( $id ) :
			$this->unconfigured_error();
	}

	/**
	 * Set taxonomy terms for a Popup.
	 *
	 * @param integer $id ID of sitewide popup.
	 * @param array   $terms Array of terms to be set.
	 * @param string  $taxonomy Taxonomy slug.
	 */
	public function set_popup_terms( $id, $terms, $taxonomy ) {
		return $this->is_configured() ?
			\Newspack_Popups_Model::set_popup_terms( $id, $terms, $taxonomy ) :
			$this->unconfigured_error();
	}

	/**
	 * Set Popup options.
	 *
	 * @param integer $id ID of sitewide popup.
	 * @param array   $options Array of categories to be set.
	 */
	public function set_popup_options( $id, $options ) {
		return $this->is_configured() ?
			\Newspack_Popups_Model::set_popup_options( $id, $options ) :
			$this->unconfigured_error();
	}

	/**
	 * Get plugin settings.
	 */
	public function get_settings() {
		return $this->is_configured() ?
			\Newspack_Popups_Settings::get_settings() :
			$this->unconfigured_error();
	}

	/**
	 * Get segments.
	 */
	public function get_segments() {
		return $this->is_configured() ?
			\Newspack_Popups_Segmentation::get_segments() :
			$this->unconfigured_error();
	}

	/**
	 * Set plugin settings.
	 *
	 * @param object $options options.
	 */
	public function set_settings( $options ) {
		return $this->is_configured() ?
			\Newspack_Popups_Settings::set_settings( $options ) :
			$this->unconfigured_error();
	}

	/**
	 * Create a segment.
	 *
	 * @param object $segment Segment configuration.
	 */
	public function create_segment( $segment ) {
		return $this->is_configured() ?
			\Newspack_Popups_Segmentation::create_segment( $segment ) :
			$this->unconfigured_error();
	}

	/**
	 * Update a segment.
	 *
	 * @param object $segment Segment configuration.
	 */
	public function update_segment( $segment ) {
		return $this->is_configured() ?
			\Newspack_Popups_Segmentation::update_segment( $segment ) :
			$this->unconfigured_error();
	}

	/**
	 * Delete a segment.
	 *
	 * @param string $id A segment ID.
	 */
	public function delete_segment( $id ) {
		return $this->is_configured() ?
			\Newspack_Popups_Segmentation::delete_segment( $id ) :
			$this->unconfigured_error();
	}

	/**
	 * Get segment's potential reacj.
	 *
	 * @param object $config Segment configuration.
	 */
	public function get_segment_reach( $config ) {
		return $this->is_configured() ?
			\Newspack_Popups_Segmentation::get_segment_reach( $config ) :
			$this->unconfigured_error();
	}

	/**
	 * Activate campaign group.
	 *
	 * @param int $id Campaign group ID.
	 */
	public function batch_publish( $id ) {
		return $this->is_configured() ?
			\Newspack_Popups_Settings::batch_publish( $id ) :
			$this->unconfigured_error();
	}

	/**
	 * Deactivate campaign group.
	 *
	 * @param int $id Campaign group ID.
	 */
	public function batch_unpublish( $id ) {
		return $this->is_configured() ?
			\Newspack_Popups_Settings::batch_unpublish( $id ) :
			$this->unconfigured_error();
	}

	/**
	 * Configure Newspack Popups for Newspack use.
	 *
	 * @return bool || WP_Error Return true if successful, or WP_Error if not.
	 */
	public function configure() {
		return true;
	}

	/**
	 * Error to return if the plugin is not installed and activated.
	 *
	 * @return WP_Error
	 */
	private function unconfigured_error() {
		return new \WP_Error(
			'newspack_missing_required_plugin',
			esc_html__( 'The Newspack Popups plugin is not installed and activated. Install and/or activate it to access this feature.', 'newspack' ),
			[
				'status' => 400,
				'level'  => 'fatal',
			]
		);
	}
}
