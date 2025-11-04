<?php
/**
 * Start Stackable Theme Functions
 */

if ( ! function_exists( 'start_stackable_setup' ) ) {
	function start_stackable_setup() {
		add_theme_support( 'wp-block-styles' );
		add_theme_support( 'responsive-embeds' );
		add_theme_support( 'editor-styles' );
	}
}
add_action( 'after_setup_theme', 'start_stackable_setup' );
