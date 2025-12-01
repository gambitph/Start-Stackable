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

function start_stackable_enqueue_styles() {
    $style_path = get_template_directory_uri() . '/assets/css/design-system.css';

    // Frontend
    wp_enqueue_style('start-stackable-block-styles', $style_path, [], wp_get_theme()->get('Version'));

    // Editor
    wp_enqueue_style('start-stackable-styles-editor', $style_path, [], wp_get_theme()->get('Version'));
}

add_action('wp_enqueue_scripts', 'start_stackable_enqueue_styles');
add_action('enqueue_block_editor_assets', 'start_stackable_enqueue_styles');
