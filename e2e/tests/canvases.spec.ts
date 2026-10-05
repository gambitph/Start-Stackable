import type { RequestUtils } from '@wordpress/e2e-test-utils-playwright'
import { test, expect } from '../test-utils/test'

const THEME_SLUG = process.env.THEME_SLUG || 'start-stackable'
const CANVAS_PATTERNS = [
	'start-stackable/template-blank',
	'start-stackable/template-full-width',
	'start-stackable/template-page',
	'start-stackable/template-page-with-sidebar',
]

type RestRecord = {
	id: number
	link: string
}

type BlockPattern = {
	content?: string
	inserter?: boolean
	name: string
}

type BlockTemplate = {
	id: string
	slug: string
	source: string
	title?: {
		raw?: string
		rendered?: string
	}
}

async function assignTemplate( requestUtils: RequestUtils, pageId: number, template: string ) {
	await requestUtils.rest( {
		method: 'POST',
		path: `/wp/v2/pages/${ pageId }`,
		data: { template },
	} )
}

test.describe( 'Page canvases', () => {
	let fixture: RestRecord

	test.beforeEach( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( THEME_SLUG )
		fixture = await requestUtils.createRecord< RestRecord >( 'pages', {
			title: 'Phase 5 Canvas Fixture',
			slug: `phase-5-canvas-${ Date.now() }`,
			content: [
				'<!-- wp:group {"align":"full","backgroundColor":"base-accent","layout":{"type":"constrained"}} --><div class="wp-block-group alignfull has-base-accent-background-color has-background"><!-- wp:paragraph --><p>Full-bleed canvas content.</p><!-- /wp:paragraph --></div><!-- /wp:group -->',
				'<!-- wp:paragraph --><p>Constrained canvas text.</p><!-- /wp:paragraph -->',
			].join( '\n' ),
			status: 'publish',
		} )
	} )

	test.afterEach( async ( { requestUtils } ) => {
		if ( fixture?.id ) {
			await requestUtils.rest( {
				method: 'DELETE',
				path: `/wp/v2/pages/${ fixture.id }`,
				params: { force: true },
			} )
		}
	} )

	test( 'standard page shows its title and constrains ordinary content', async ( { page } ) => {
		await page.setViewportSize( { width: 1600, height: 1000 } )
		await page.goto( fixture.link )

		await expect( page.getByRole( 'banner' ).getByRole( 'navigation' ) ).toBeVisible()
		await expect( page.getByRole( 'heading', { level: 1, name: 'Phase 5 Canvas Fixture' } ) ).toBeVisible()
		await expect( page.getByRole( 'contentinfo' ).getByRole( 'heading', { name: 'Resources' } ) ).toBeVisible()
		const paragraphBox = await page.locator( '.wp-block-post-content > p' ).boundingBox()
		expect( paragraphBox ).not.toBeNull()
		expect( paragraphBox!.width ).toBeCloseTo( 645, 0 )
	} )

	test( 'full-width removes the theme title and lets alignfull content reach both edges', async ( {
		page,
		requestUtils,
	} ) => {
		await assignTemplate( requestUtils, fixture.id, 'full-width' )
		await page.setViewportSize( { width: 1600, height: 1000 } )
		await page.goto( fixture.link )

		await expect( page.getByRole( 'banner' ).getByRole( 'navigation' ) ).toBeVisible()
		await expect( page.locator( '.wp-block-post-title' ) ).toHaveCount( 0 )
		await expect( page.getByRole( 'contentinfo' ).getByRole( 'heading', { name: 'Resources' } ) ).toBeVisible()
		const headerBox = await page.getByRole( 'banner' ).boundingBox()
		const mainBox = await page.getByRole( 'main' ).boundingBox()
		expect( headerBox ).not.toBeNull()
		expect( mainBox ).not.toBeNull()
		expect( mainBox!.y ).toBeCloseTo( headerBox!.y + headerBox!.height, 0 )
		const fullBlock = page.locator( '.wp-block-post-content > .alignfull' )
		const fullBox = await fullBlock.boundingBox()
		expect( fullBox ).not.toBeNull()
		expect( fullBox!.x ).toBeCloseTo( 0, 0 )
		expect( fullBox!.width ).toBeCloseTo( 1600, 0 )

		await page.setViewportSize( { width: 375, height: 900 } )
		const mobileFullBox = await fullBlock.boundingBox()
		expect( mobileFullBox ).not.toBeNull()
		expect( mobileFullBox!.x ).toBeCloseTo( 0, 0 )
		expect( mobileFullBox!.width ).toBeCloseTo( 375, 0 )
		expect( await page.evaluate( () => document.documentElement.scrollWidth ) ).toBe( 375 )
	} )

	test( 'blank renders page content without header, footer, or theme title', async ( {
		page,
		requestUtils,
	} ) => {
		await assignTemplate( requestUtils, fixture.id, 'blank' )
		await page.goto( fixture.link )

		await expect( page.getByText( 'Constrained canvas text.', { exact: true } ) ).toBeVisible()
		await expect( page.getByRole( 'banner' ) ).toHaveCount( 0 )
		await expect( page.getByRole( 'contentinfo' ) ).toHaveCount( 0 )
		await expect( page.locator( '.wp-block-template-part' ) ).toHaveCount( 0 )
		await expect( page.locator( '.wp-block-post-title' ) ).toHaveCount( 0 )
	} )

	test( 'page with sidebar keeps page content primary and stacks cleanly on mobile', async ( {
		page,
		requestUtils,
	} ) => {
		await assignTemplate( requestUtils, fixture.id, 'page-with-sidebar' )
		await page.setViewportSize( { width: 1440, height: 1000 } )
		await page.goto( fixture.link )

		await expect( page.getByRole( 'heading', { level: 1, name: 'Phase 5 Canvas Fixture' } ) ).toBeVisible()
		await expect( page.locator( 'aside.wp-block-template-part' ) ).toBeVisible()
		await expect( page.getByRole( 'heading', { level: 2, name: 'Latest posts' } ) ).toBeVisible()
		await expect( page.getByRole( 'heading', { level: 2, name: 'Categories' } ) ).toBeVisible()
		const columns = page.locator( 'main > .wp-block-columns > .wp-block-column' )
		await expect( columns ).toHaveCount( 2 )
		const contentBox = await columns.nth( 0 ).boundingBox()
		const sidebarBox = await columns.nth( 1 ).boundingBox()
		expect( contentBox ).not.toBeNull()
		expect( sidebarBox ).not.toBeNull()
		expect( contentBox!.width ).toBeGreaterThan( sidebarBox!.width )

		await page.setViewportSize( { width: 375, height: 900 } )
		const mobileContentBox = await columns.nth( 0 ).boundingBox()
		const mobileSidebarBox = await columns.nth( 1 ).boundingBox()
		expect( mobileContentBox ).not.toBeNull()
		expect( mobileSidebarBox ).not.toBeNull()
		expect( mobileSidebarBox!.y ).toBeGreaterThan( mobileContentBox!.y )
		expect( await page.evaluate( () => document.documentElement.scrollWidth ) ).toBe( 375 )
	} )

	test( 'WordPress registers hidden canvas patterns and loads each template in Site Editor', async ( {
		page,
		admin,
		requestUtils,
	} ) => {
		const patterns = await requestUtils.rest< BlockPattern[] >( {
			path: '/wp/v2/block-patterns/patterns',
		} )
		const templates = await requestUtils.rest< BlockTemplate[] >( {
			path: '/wp/v2/templates',
			params: { context: 'edit', per_page: 100 },
		} )
		const fullWidthTemplate = templates.find(
			( template ) => template.id === `${ THEME_SLUG }//full-width`
		)
		const sidebarTemplate = templates.find(
			( template ) => template.id === `${ THEME_SLUG }//page-with-sidebar`
		)
		expect( fullWidthTemplate?.title?.raw || fullWidthTemplate?.title?.rendered ).toBe(
			'Full Width, No Title'
		)
		expect( sidebarTemplate?.source ).toBe( 'theme' )
		const canvasPatterns = patterns.filter( ( pattern ) => CANVAS_PATTERNS.includes( pattern.name ) )
		expect( canvasPatterns.map( ( pattern ) => pattern.name ).sort() ).toEqual( CANVAS_PATTERNS )
		expect( canvasPatterns.every( ( pattern ) => pattern.inserter === false ) ).toBe( true )
		const pagePattern = canvasPatterns.find( ( pattern ) => pattern.name === 'start-stackable/template-page' )
		const pagePatternContent = pagePattern?.content || ''
		expect( pagePatternContent ).toContain( '<!-- wp:post-title' )
		expect( pagePatternContent ).toContain( '<!-- wp:post-featured-image' )
		expect( pagePatternContent.indexOf( '<!-- wp:post-title' ) ).toBeLessThan(
			pagePatternContent.indexOf( '<!-- wp:post-featured-image' )
		)
		const sidebarPattern = canvasPatterns.find(
			( pattern ) => pattern.name === 'start-stackable/template-page-with-sidebar'
		)
		expect( sidebarPattern?.content ).toContain( '<!-- wp:columns' )
		expect( sidebarPattern?.content ).toContain( '<!-- wp:template-part {"slug":"sidebar"' )

		for ( const templateSlug of [ 'page', 'full-width', 'blank', 'page-with-sidebar' ] ) {
			await admin.visitSiteEditor( {
				postType: 'wp_template',
				postId: `${ THEME_SLUG }//${ templateSlug }`,
				canvas: 'edit',
			} )
			const canvas = page.frameLocator( 'iframe[name="editor-canvas"]' )
			await expect( canvas.locator( '.wp-block-post-content' ) ).toBeVisible()
			await expect( canvas.getByText( /Template part has been deleted or is unavailable/ ) ).toHaveCount( 0 )
			await expect( canvas.getByText( 'Attempt Recovery' ) ).toHaveCount( 0 )
		}
	} )
} )
