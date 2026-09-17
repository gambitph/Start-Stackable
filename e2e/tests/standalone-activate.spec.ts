import type { Page } from '@playwright/test'
import { test, expect } from '../test-utils/test'

const THEME_SLUG = process.env.THEME_SLUG || 'start-stackable'
const FALLBACK_THEME = 'twentytwentyfive'
const SHELL_PARTS = [
	'footer',
	'footer-landing',
	'header',
	'header-minimal',
	'header-transparent',
]

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

		const notice = page.locator( '.start-stackable-plugin-notice' )
		await expect( notice ).toBeVisible()
		await expect(
			notice.getByRole( 'link', { name: 'Install Stackable' } )
		).toHaveAttribute(
			'href',
			new RegExp( 'plugin=stackable-ultimate-gutenberg-blocks' )
		)
	} )

	test( 'Front page loads header and footer without Stackable markup', async ( {
		page,
		requestUtils,
	} ) => {
		await requestUtils.activateTheme( THEME_SLUG )
		const { title: siteTitle } = await requestUtils.rest< { title: string } >( {
			path: '/wp/v2/settings',
		} )
		await page.goto( '/' )

		await assertNoCriticalError( page )
		await expect( page.locator( '.wp-block-site-title' ).first() ).toBeVisible()
		await expect( page.getByRole( 'banner' ).getByRole( 'navigation' ) ).toBeVisible()
		await expect( page.locator( '.wp-block-social-links' ) ).toBeVisible()
		await expect( page.locator( 'footer.wp-block-template-part' ).getByRole( 'heading', { name: 'Resources' } ) ).toBeVisible()
		await expect( page.locator( 'footer.wp-block-template-part' ).getByRole( 'heading', { name: 'About' } ) ).toBeVisible()
		await expect( page.locator( 'footer.wp-block-template-part' ).getByText( '©' ) ).toBeVisible()
		await expect( page.locator( 'footer.wp-block-template-part .wp-block-site-title.has-small-font-size' ) ).toContainText( siteTitle )
		await expect( page.getByText( 'Start Stackable Theme' ) ).toHaveCount( 0 )

		const html = await page.content()
		expect( html ).not.toMatch( /wp:stackable\// )
		expect( html ).not.toMatch( /wp-block-stackable/ )
	} )

	test( 'Site Editor loads every pattern-backed shell part without recovery warnings', async ( {
		page,
		admin,
		requestUtils,
	} ) => {
		await requestUtils.activateTheme( THEME_SLUG )

		for ( const partSlug of SHELL_PARTS ) {
			await admin.visitSiteEditor( {
				postType: 'wp_template_part',
				postId: `${ THEME_SLUG }//${ partSlug }`,
				canvas: 'edit',
			} )

			const canvas = page.frameLocator( 'iframe[name="editor-canvas"]' )
			await expect( canvas.locator( '.wp-block-site-title' ).first() ).toBeVisible()
			await expect( canvas.getByText( /Template part has been deleted or is unavailable/ ) ).toHaveCount( 0 )
			await expect( canvas.getByText( 'Attempt Recovery' ) ).toHaveCount( 0 )
		}
	} )

	for ( const template of [ '', 'full-width' ] ) {
		test( `${ template || 'page' } template resolves the active theme's header and footer`, async ( {
			page,
			requestUtils,
		} ) => {
			await requestUtils.activateTheme( THEME_SLUG )
			const testPage = await requestUtils.createRecord< { id: number; link: string } >( 'pages', {
				title: 'Template part lookup',
				content: '<!-- wp:paragraph --><p>Template part lookup content.</p><!-- /wp:paragraph -->',
				status: 'publish',
				template,
			} )

			try {
				await page.goto( testPage.link )
				await expect( page.getByText( 'Template part lookup content.', { exact: true } ) ).toBeVisible()
				await expect( page.getByRole( 'banner' ).getByRole( 'navigation' ) ).toBeVisible()
				await expect( page.getByRole( 'contentinfo' ).getByRole( 'heading', { name: 'Resources' } ) ).toBeVisible()
				await expect( page.getByText( /Template part has been deleted or is unavailable/ ) ).toHaveCount( 0 )
			} finally {
				await requestUtils.rest( {
					method: 'DELETE',
					path: `/wp/v2/pages/${ testPage.id }`,
					params: { force: true },
				} )
			}
		} )
	}

	test( '404 template renders without a fatal error', async ( {
		page,
		requestUtils,
	} ) => {
		await requestUtils.activateTheme( THEME_SLUG )
		const response = await page.goto( '/this-page-does-not-exist-start-stackable/' )

		expect( response?.status() ).toBe( 404 )
		await assertNoCriticalError( page )
		await expect( page.getByRole( 'heading', { name: /Page not found/i } ) ).toBeVisible()
		await expect( page.locator( '.wp-block-site-title' ).first() ).toBeVisible()
	} )
} )
