import type { RequestUtils } from '@wordpress/e2e-test-utils-playwright'
import { test, expect } from '../test-utils/test'

const FALLBACK_THEME = 'twentytwentyfive'
const STACKABLE_PLUGIN_SLUG = 'stackable-ultimate-gutenberg-blocks'
const THEME_SLUG = process.env.THEME_SLUG || 'start-stackable'

type PluginRecord = {
	plugin: string
	status: string
}

async function countRecords( requestUtils: RequestUtils, path: string ) {
	const records = await requestUtils.rest< { id: number }[] >( {
		path,
		params: { context: 'edit', per_page: 100 },
	} )

	return records.length
}

async function getInstalledStackable( requestUtils: RequestUtils ) {
	const plugins = await requestUtils.rest< PluginRecord[] >( {
		path: '/wp/v2/plugins',
	} )
	const stackable = plugins.find( ( plugin ) =>
		plugin.plugin.startsWith( `${ STACKABLE_PLUGIN_SLUG }/` )
	)

	if ( ! stackable ) {
		throw new Error( 'The onboarding profile did not install Stackable.' )
	}

	return stackable
}

async function deactivateStackableIfActive( requestUtils: RequestUtils ) {
	const stackable = await getInstalledStackable( requestUtils )

	if ( stackable.status === 'active' ) {
		await requestUtils.deactivatePlugin( 'stackable-gutenberg-blocks' )
	}
}

test.describe( 'Stackable onboarding', () => {
	test( 'recommends Stackable without importing and honors activation and dismissal', async ( {
		page,
		admin,
		requestUtils,
	}, testInfo ) => {
		test.slow()
		await requestUtils.deleteAllUsers()
		await deactivateStackableIfActive( requestUtils )

		const stackable = await getInstalledStackable( requestUtils )
		expect( stackable.status ).toBe( 'inactive' )

		const userKey = `${ Date.now() }-${ testInfo.repeatEachIndex }-${ testInfo.retry }`
		const username = `phase9-admin-${ userKey }`
		const password = 'phase9-test-password'
		await requestUtils.createUser( {
			username,
			email: `${ username }@example.com`,
			password,
			roles: [ 'administrator' ],
		} )

		try {
			await page.context().clearCookies()
			await page.goto( '/wp-login.php' )
			await page.getByLabel( 'Username or Email Address' ).fill( username )
			await page.locator( '#user_pass' ).fill( password )
			await Promise.all( [
				page.waitForURL( /\/wp-admin\// ),
				page.getByRole( 'button', { name: 'Log In' } ).click(),
			] )

			await requestUtils.activateTheme( FALLBACK_THEME )

			const pagesBefore = await countRecords( requestUtils, '/wp/v2/pages' )
			const navigationBefore = await countRecords( requestUtils, '/wp/v2/navigation' )

			await requestUtils.activateTheme( THEME_SLUG )

			expect( await countRecords( requestUtils, '/wp/v2/pages' ) ).toBe( pagesBefore )
			expect( await countRecords( requestUtils, '/wp/v2/navigation' ) ).toBe(
				navigationBefore
			)

			await admin.visitAdminPage( 'index.php' )
			const notice = page.locator( '.start-stackable-plugin-notice' )
			await expect( notice ).toBeVisible()
			const activateLink = notice.getByRole( 'link', {
				name: 'Activate Stackable',
			} )
			await expect( activateLink ).toHaveAttribute(
				'href',
				/plugins\.php\?.*action=activate/
			)

			await activateLink.click()
			await expect
				.poll( async () => ( await getInstalledStackable( requestUtils ) ).status )
				.toBe( 'active' )

			await page.goto( '/' )
			await expect( page.locator( 'body' ) ).toHaveClass(
				/\bstk--is-stackable-theme\b/
			)

			await admin.visitAdminPage( 'index.php' )
			await expect( notice ).toHaveCount( 0 )

			await admin.visitAdminPage( 'admin.php?page=stackable-settings' )
			await expect
				.poll( () =>
					page.evaluate( () =>
						( window as typeof window & {
							stackable?: { defaultBreakpoints?: unknown };
						} ).stackable?.defaultBreakpoints
					)
				)
				.toEqual( { tablet: '1024', mobile: '768' } )

			await requestUtils.deactivatePlugin( 'stackable-gutenberg-blocks' )
			await admin.visitAdminPage( 'index.php' )
			await expect( notice ).toBeVisible()

			await Promise.all( [
				page.waitForResponse( ( response ) =>
					response.url().includes( 'admin-ajax.php' ) &&
					response.request().postData()?.includes(
						'action=start_stackable_dismiss_plugin_notice'
					) === true
				),
				notice.locator( '.notice-dismiss' ).click(),
			] )
			await page.reload()
			await expect( notice ).toHaveCount( 0 )
		} finally {
			await deactivateStackableIfActive( requestUtils )
			await requestUtils.deleteAllUsers()
		}
	} )
} )
