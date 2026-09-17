<?php
/**
 * Start Stackable theme functions.
 *
 * PHP host for theme supports, compiled extras, and onboarding.
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

if ( ! function_exists( 'start_stackable_is_stackable_active' ) ) {
	/**
	 * Check whether the companion Stackable plugin is active.
	 *
	 * Active plugins load before the theme, so Stackable's version constant is
	 * available by the time this file runs.
	 *
	 * @return bool
	 */
	function start_stackable_is_stackable_active() {
		return defined( 'STACKABLE_VERSION' );
	}
}

if ( ! function_exists( 'start_stackable_should_show_plugin_notice' ) ) {
	/**
	 * Check whether the current user should see the Stackable recommendation.
	 *
	 * @return bool
	 */
	function start_stackable_should_show_plugin_notice() {
		return current_user_can( 'install_plugins' )
			&& ! start_stackable_is_stackable_active()
			&& ! get_user_meta(
				get_current_user_id(),
				'start_stackable_dismiss_plugin_notice',
				true
			);
	}
}

if ( ! function_exists( 'start_stackable_get_stackable_plugin_file' ) ) {
	/**
	 * Find the installed Stackable plugin entry point.
	 *
	 * @return string
	 */
	function start_stackable_get_stackable_plugin_file() {
		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		foreach ( array_keys( get_plugins() ) as $plugin_file ) {
			if ( 0 === strpos( $plugin_file, 'stackable-ultimate-gutenberg-blocks/' ) ) {
				return $plugin_file;
			}
		}

		return '';
	}
}

if ( ! function_exists( 'start_stackable_plugin_notice' ) ) {
	/**
	 * Recommend the optional Stackable plugin.
	 */
	function start_stackable_plugin_notice() {
		if ( ! start_stackable_should_show_plugin_notice() ) {
			return;
		}

		$plugin_slug = 'stackable-ultimate-gutenberg-blocks';
		$plugin_file = start_stackable_get_stackable_plugin_file();

		if ( $plugin_file ) {
			$plugin_url  = wp_nonce_url(
				add_query_arg(
					array(
						'action' => 'activate',
						'plugin' => $plugin_file,
					),
					self_admin_url( 'plugins.php' )
				),
				'activate-plugin_' . $plugin_file
			);
			$button_label = __( 'Activate Stackable', 'start-stackable' );
		} else {
			$plugin_url   = add_query_arg(
				array(
					'tab'    => 'plugin-information',
					'plugin' => $plugin_slug,
				),
				self_admin_url( 'plugin-install.php' )
			);
			$button_label = __( 'Install Stackable', 'start-stackable' );
		}
		?>
		<div class="notice notice-info is-dismissible start-stackable-plugin-notice" data-dismiss-nonce="<?php echo esc_attr( wp_create_nonce( 'start_stackable_dismiss_plugin_notice' ) ); ?>">
			<p>
				<strong><?php esc_html_e( 'Build more with Stackable', 'start-stackable' ); ?></strong>
			</p>
			<p>
				<?php esc_html_e( 'Start Stackable works on its own. Install the optional Stackable plugin to access Site Kits, the Design Library, and additional blocks.', 'start-stackable' ); ?>
			</p>
			<p>
				<a class="button button-primary" href="<?php echo esc_url( $plugin_url ); ?>"><?php echo esc_html( $button_label ); ?></a>
			</p>
		</div>
		<?php
	}
}
add_action( 'admin_notices', 'start_stackable_plugin_notice' );

if ( ! function_exists( 'start_stackable_plugin_notice_script' ) ) {
	/**
	 * Persist dismissal when the core notice close button is used.
	 */
	function start_stackable_plugin_notice_script() {
		if ( ! start_stackable_should_show_plugin_notice() ) {
			return;
		}

		wp_enqueue_script( 'jquery' );
		wp_add_inline_script(
			'jquery',
			"jQuery( function( $ ) {
				$( document ).on( 'click', '.start-stackable-plugin-notice .notice-dismiss', function() {
					var notice = $( this ).closest( '.start-stackable-plugin-notice' );
					$.post( window.ajaxurl, {
						action: 'start_stackable_dismiss_plugin_notice',
						_ajax_nonce: notice.data( 'dismiss-nonce' )
					} );
				} );
			} );"
		);
	}
}
add_action( 'admin_enqueue_scripts', 'start_stackable_plugin_notice_script' );

if ( ! function_exists( 'start_stackable_dismiss_plugin_notice' ) ) {
	/**
	 * Store the recommendation dismissal for the current user.
	 */
	function start_stackable_dismiss_plugin_notice() {
		check_ajax_referer( 'start_stackable_dismiss_plugin_notice' );

		if ( ! current_user_can( 'install_plugins' ) ) {
			wp_send_json_error( null, 403 );
		}

		update_user_meta(
			get_current_user_id(),
			'start_stackable_dismiss_plugin_notice',
			true
		);
		wp_send_json_success();
	}
}
add_action( 'wp_ajax_start_stackable_dismiss_plugin_notice', 'start_stackable_dismiss_plugin_notice' );

if ( ! function_exists( 'start_stackable_responsive_breakpoints' ) ) {
	/**
	 * Share the theme's responsive widths with Stackable.
	 *
	 * @param array $breakpoints Stackable breakpoint defaults.
	 * @return array
	 */
	function start_stackable_responsive_breakpoints( $breakpoints ) {
		$breakpoints['tablet'] = '1024';
		$breakpoints['mobile'] = '768';

		return $breakpoints;
	}
}

if ( start_stackable_is_stackable_active() ) {
	add_filter( 'stackable_responsive_breakpoints', 'start_stackable_responsive_breakpoints' );
}
