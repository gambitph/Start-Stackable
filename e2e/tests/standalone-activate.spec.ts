import type { Page } from '@playwright/test'
import { test, expect } from '../test-utils/test'

const THEME_SLUG = process.env.THEME_SLUG || 'start-stackable'
const FALLBACK_THEME = 'twentytwentyfive'

async function assertNoCriticalError( page: Page ) {
	await expect( page.getByText( 'There has been a critical error on this website' ) ).toHaveCount( 0 )
}

test.describe( 'Standalone activate', () => {
	test( 'Start Stackable can be activated without errors', async ( {
		page,
		admin,
		requestUtils,
	} ) => {
		await requestUtils.activateTheme( FALLBACK_THEME )
		await requestUtils.activateTheme( THEME_SLUG )

		await admin.visitAdminPage( 'themes.php' )
		expect( await admin.getPageError() ).toBeNull()

		await expect( page.locator( `.theme.active[data-slug="${ THEME_SLUG }"]` ) ).toBeVisible()
	} )

	test( 'Front page loads header and footer without Stackable markup', async ( {
		page,
		requestUtils,
	} ) => {
		await requestUtils.activateTheme( THEME_SLUG )
		await page.goto( '/' )

		await assertNoCriticalError( page )
		await expect( page.locator( '.wp-block-site-title' ).first() ).toBeVisible()
		await expect( page.locator( '.wp-block-social-links' ) ).toBeVisible()

		const html = await page.content()
		expect( html ).not.toMatch( /wp:stackable\// )
		expect( html ).not.toMatch( /wp-block-stackable/ )
	} )

	test( '404 template renders without a fatal error', async ( {
		page,
		requestUtils,
	} ) => {
		await requestUtils.activateTheme( THEME_SLUG )
		const response = await page.goto( '/this-page-does-not-exist-start-stackable/' )

		expect( response?.status() ).toBe( 404 )
		await assertNoCriticalError( page )
		await expect( page.getByRole( 'heading', { name: 'Page Not Found' } ) ).toBeVisible()
		await expect( page.locator( '.wp-block-site-title' ).first() ).toBeVisible()
	} )
} )
