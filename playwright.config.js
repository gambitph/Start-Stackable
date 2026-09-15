/**
 * Playwright config for Start Stackable e2e.
 *
 * WordPress is provided by `@wp-playground/cli` (WASM PHP + SQLite) via
 * `webServer` - no Docker, MySQL, or local WP install required.
 *
 * `WP_BASE_URL` must be set before `@wordpress/e2e-test-utils-playwright` is
 * first imported (it reads `process.env.WP_BASE_URL` at module load time).
 *
 * See e2e/readme.md.
 */
const path = require( 'path' )
const { defineConfig, devices } = require( '@playwright/test' )

const E2E_PROFILE = process.env.E2E_PROFILE || 'standalone'
const IS_WOOCOMMERCE = E2E_PROFILE === 'woocommerce'
// Distinct from Stackable (9420), Cimo (9410), and the other local profile.
const PORT = process.env.WP_PORT || ( IS_WOOCOMMERCE ? '9431' : '9430' )
const baseURL = process.env.WP_BASE_URL || `http://127.0.0.1:${ PORT }`
process.env.WP_BASE_URL = baseURL
process.env.WP_USERNAME = process.env.WP_USERNAME || 'admin'
process.env.WP_PASSWORD = process.env.WP_PASSWORD || 'password'
process.env.THEME_SLUG = process.env.THEME_SLUG || 'start-stackable'

const STORAGE_STATE_PATH = path.join(
	__dirname,
	IS_WOOCOMMERCE ? 'e2e/.auth/admin-woocommerce.json' : 'e2e/.auth/admin.json'
)
process.env.STORAGE_STATE_PATH = STORAGE_STATE_PATH

const PLAYGROUND_BLUEPRINT = path.join(
	__dirname,
	IS_WOOCOMMERCE
		? 'e2e/playground-woocommerce-blueprint.json'
		: 'e2e/playground-blueprint.json'
)
const PHP_VERSION = process.env.WP_PHP_VERSION || '8.2'
const WP_VERSION = process.env.WP_VERSION || 'latest'

module.exports = defineConfig( {
	testDir: './e2e/tests',
	testMatch: IS_WOOCOMMERCE ? '**/woocommerce.spec.ts' : '**/*.spec.ts',
	testIgnore: IS_WOOCOMMERCE ? undefined : '**/woocommerce.spec.ts',
	globalSetup: require.resolve( './e2e/config/global-setup.js' ),
	fullyParallel: false,
	forbidOnly: !! process.env.CI,
	retries: process.env.CI ? 1 : 0,
	workers: 1,
	timeout: 90_000,
	reporter: process.env.CI
		? [ [ 'github' ], [ 'html', { open: 'never' } ] ]
		: [ [ 'list' ], [ 'html', { outputFolder: 'playwright-report', open: 'never' } ] ],
	reportSlowTests: null,
	webServer: {
		command: [
			'npx @wp-playground/cli server',
			`--mount=${ JSON.stringify( `.:/wordpress/wp-content/themes/${ process.env.THEME_SLUG }` ) }`,
			`--blueprint=${ JSON.stringify( PLAYGROUND_BLUEPRINT ) }`,
			`--php=${ PHP_VERSION }`,
			`--wp=${ WP_VERSION }`,
			`--port=${ PORT }`,
			'--workers=1',
		].join( ' ' ),
		// Use `port`, not `url`: Playground auto-login 302-loops cookie-less probes.
		// The authenticated global setup waits for WooCommerce when that profile is active.
		port: Number( PORT ),
		reuseExistingServer: ! process.env.CI,
		timeout: ( IS_WOOCOMMERCE ? 360 : 180 ) * 1000,
		stdout: 'pipe',
		stderr: 'pipe',
	},
	use: {
		baseURL,
		storageState: STORAGE_STATE_PATH,
		ignoreHTTPSErrors: true,
		screenshot: 'only-on-failure',
		trace: 'retain-on-failure',
		video: 'retain-on-failure',
		...devices[ 'Desktop Chrome' ],
	},
} )
