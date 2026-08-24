<?php
/**
 * Start Stackable theme functions.
 *
 * PHP host for theme supports, compiled extras, and (later) onboarding.
 * Palette, type, and spacing stay in theme.json.
 *
 * @package Start_Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'start_stackable_setup' ) ) {
	/**
	 * Register theme supports.
	 */
	function start_stackable_setup() {
		load_theme_textdomain( 'start-stackable', get_template_directory() . '/languages' );

		add_theme_support( 'wp-block-styles' );
		add_theme_support( 'responsive-embeds' );
		add_theme_support( 'editor-styles' );

		$editor_style = 'assets/build/frontend.css';
		if ( file_exists( get_theme_file_path( $editor_style ) ) ) {
			add_editor_style( $editor_style );
		}
	}
}
add_action( 'after_setup_theme', 'start_stackable_setup' );

if ( ! function_exists( 'start_stackable_enqueue_assets' ) ) {
	/**
	 * Enqueue the compiled frontend bundle (header-flag CSS/JS).
	 *
	 * Source lives in src/. Compile with `npm run start` or `npm run compile`.
	 */
	function start_stackable_enqueue_assets() {
		$asset_path = get_theme_file_path( 'assets/build/frontend.asset.php' );
		if ( ! file_exists( $asset_path ) ) {
			return;
		}

		$asset = include $asset_path;
		if ( ! is_array( $asset ) ) {
			return;
		}

		$version      = isset( $asset['version'] ) ? $asset['version'] : false;
		$dependencies = isset( $asset['dependencies'] ) ? $asset['dependencies'] : array();
		$style_path   = get_theme_file_path( 'assets/build/frontend.css' );
		$script_path  = get_theme_file_path( 'assets/build/frontend.js' );

		if ( file_exists( $style_path ) ) {
			wp_enqueue_style(
				'start-stackable-frontend',
				get_theme_file_uri( 'assets/build/frontend.css' ),
				array(),
				$version
			);
			wp_style_add_data( 'start-stackable-frontend', 'rtl', 'replace' );
		}

		if ( file_exists( $script_path ) ) {
			wp_enqueue_script(
				'start-stackable-frontend',
				get_theme_file_uri( 'assets/build/frontend.js' ),
				$dependencies,
				$version,
				array(
					'in_footer' => true,
					'strategy'  => 'defer',
				)
			);
		}
	}
}
add_action( 'wp_enqueue_scripts', 'start_stackable_enqueue_assets' );

if ( ! function_exists( 'start_stackable_body_class' ) ) {
	/**
	 * Shell contract: identify this theme for the companion plugin.
	 *
	 * @param string[] $classes Body classes.
	 * @return string[]
	 */
	function start_stackable_body_class( $classes ) {
		$classes[] = 'stk--is-stackable-theme';
		return $classes;
	}
}
add_filter( 'body_class', 'start_stackable_body_class' );
