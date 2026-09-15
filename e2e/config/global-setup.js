/**
 * Playwright global setup: cookie-authenticates as the Playground blueprint
 * admin (admin / password), persists storage state for specs + requestUtils,
 * and activates the mounted theme.
 */
const fs = require( 'fs/promises' )
const path = require( 'path' )
const { RequestUtils } = require( '@wordpress/e2e-test-utils-playwright' )

async function waitForWooCommerce( requestUtils ) {
	const deadline = Date.now() + 300_000

	while ( Date.now() < deadline ) {
		try {
			await requestUtils.rest( {
				path: '/wc/v3/products',
				params: { per_page: 1 },
			} )
			return
		} catch {
			await new Promise( ( resolve ) => setTimeout( resolve, 1_000 ) )
		}
	}

	throw new Error( 'WooCommerce did not become ready within 300 seconds.' )
}

async function activateThemeWhenMounted( requestUtils, themeSlug ) {
	const deadline = Date.now() + 60_000

	while ( Date.now() < deadline ) {
		try {
			await requestUtils.activateTheme( themeSlug )
			return
		} catch {
			await new Promise( ( resolve ) => setTimeout( resolve, 1_000 ) )
		}
	}

	throw new Error( `The theme "${ themeSlug }" was not mounted within 60 seconds.` )
}

module.exports = async function globalSetup() {
	const storageStatePath = process.env.STORAGE_STATE_PATH
	const requestUtils = await RequestUtils.setup( {
		user: {
			username: process.env.WP_USERNAME || 'admin',
			password: process.env.WP_PASSWORD || 'password',
		},
		storageStatePath,
		baseURL: process.env.WP_BASE_URL,
	} )

	await requestUtils.setupRest()
	if ( process.env.E2E_PROFILE === 'woocommerce' ) {
		await waitForWooCommerce( requestUtils )
	}
	await activateThemeWhenMounted(
		requestUtils,
		process.env.THEME_SLUG || 'start-stackable'
	)

	const authDir = path.dirname( storageStatePath || path.join( __dirname, '../.auth/admin.json' ) )
	await fs.mkdir( authDir, { recursive: true } )

	await fs.writeFile(
		path.join( authDir, 'test-env.json' ),
		JSON.stringify( {
			THEME_SLUG: process.env.THEME_SLUG || 'start-stackable',
		}, null, 2 )
	)
}
