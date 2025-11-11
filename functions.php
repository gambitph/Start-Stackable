<?php
/**
 * Start Stackable Theme Functions
 */

if ( ! function_exists( 'start_stackable_setup' ) ) {
    /**
     * Sets up theme defaults and registers support for various WordPress features.
     */
	function start_stackable_setup() {
		add_theme_support( 'wp-block-styles' );
		add_theme_support( 'responsive-embeds' );
		add_theme_support( 'editor-styles' );
	}
    add_action( 'after_setup_theme', 'start_stackable_setup' );
}


if ( ! function_exists( 'start_stackable_modify_theme_json' ) ) {
    function start_stackable_modify_theme_json( $theme_json ) {
        // If Stackable Block Style Inheritance is enabled, return the original theme.json.
        // This allows Stackable Block style Inheritance to get styles from the "elements" section
        // for Stackable blocks, while still allowing Stackable Design System to apply styles 
        // to core blocks through the "blocks" section.
        if ( ! get_option( 'stackable_disable_block_style_inheritance' )) {
            return $theme_json;
        }

        // If disabled, remove the "blocks" styles from theme.json to prevent conflicts.
        $data = $theme_json->get_data();
        $data['styles']['blocks'] = [];

        // Return a new WP_Theme_JSON instance with the modified data
        return new WP_Theme_JSON( $data, 'theme' );
    }

    add_filter( 'wp_theme_json_data_theme', 'start_stackable_modify_theme_json' );
}

