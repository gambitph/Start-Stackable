import { writeFile } from 'node:fs/promises'
import type { RequestUtils } from '@wordpress/e2e-test-utils-playwright'
import { test, expect } from '../test-utils/test'

const THEME_SLUG = process.env.THEME_SLUG || 'start-stackable'
const FEATURED_TITLE = 'Phase 4 Featured Story'
const TEXT_TITLE = 'Phase 4 Text Story'
const PNG_PIXEL = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
const BLOG_TEMPLATE_SLUGS = [ 'index', 'home', 'archive', 'search', '404', 'single' ]

type RestRecord = {
	id: number
	link: string
	slug: string
}

type BlogFixture = {
	featured: RestRecord
	mediaId: number
	pageIds: number[]
	postIds: number[]
	text: RestRecord
}

async function deleteRecord( requestUtils: RequestUtils, restBase: string, id: number ) {
	await requestUtils.rest( {
		method: 'DELETE',
		path: `/wp/v2/${ restBase }/${ id }`,
		params: { force: true },
	} )
}

test.describe( 'Designed blog', () => {
	let fixture: BlogFixture

	test.beforeEach( async ( { requestUtils }, testInfo ) => {
		await requestUtils.activateTheme( THEME_SLUG )
		const imagePath = testInfo.outputPath( 'phase-4-featured.png' )
		await writeFile( imagePath, Buffer.from( PNG_PIXEL, 'base64' ) )
		const media = await requestUtils.uploadMedia( imagePath )
		const categories = await requestUtils.rest< RestRecord[] >( {
			path: '/wp/v2/categories',
			params: { slug: 'uncategorized' },
		} )
		const categoryIds = categories[ 0 ] ? [ categories[ 0 ].id ] : []
		const featured = await requestUtils.createRecord< RestRecord >( 'posts', {
			title: FEATURED_TITLE,
			slug: 'phase-4-featured-story',
			content: '<!-- wp:paragraph --><p>A featured article for the Phase 4 blog.</p><!-- /wp:paragraph -->',
			excerpt: 'A featured article for the Phase 4 blog.',
			status: 'publish',
			comment_status: 'open',
			featured_media: media.id,
			categories: categoryIds,
		} )
		const text = await requestUtils.createRecord< RestRecord >( 'posts', {
			title: TEXT_TITLE,
			slug: 'phase-4-text-story',
			content: '<!-- wp:paragraph --><p>A text-only article that keeps its card structure.</p><!-- /wp:paragraph -->',
			excerpt: 'A text-only article that keeps its card structure.',
			status: 'publish',
			comment_status: 'open',
			categories: categoryIds,
		} )

		fixture = {
			featured,
			mediaId: media.id,
			pageIds: [],
			postIds: [ featured.id, text.id ],
			text,
		}
	} )

	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.rest( {
			method: 'POST',
			path: '/wp/v2/settings',
			data: {
				show_on_front: 'posts',
				page_on_front: 0,
				page_for_posts: 0,
			},
		} )

		for ( const pageId of fixture?.pageIds || [] ) {
			await deleteRecord( requestUtils, 'pages', pageId )
		}
		for ( const postId of fixture?.postIds || [] ) {
			await deleteRecord( requestUtils, 'posts', postId )
		}
		if ( fixture?.mediaId ) {
			await requestUtils.deleteMedia( fixture.mediaId )
		}
	} )

	test( 'latest-posts front renders responsive cards with and without images', async ( {
		page,
	} ) => {
		await page.goto( '/' )

		await expect( page.getByRole( 'heading', { level: 1, name: 'Latest posts' } ) ).toBeVisible()
		const featuredCard = page.locator( '.wp-block-post' ).filter( { hasText: FEATURED_TITLE } )
		const textCard = page.locator( '.wp-block-post' ).filter( { hasText: TEXT_TITLE } )
		await expect( featuredCard ).toBeVisible()
		await expect( textCard ).toBeVisible()
		await expect( featuredCard.locator( '.wp-block-post-featured-image img' ) ).toBeVisible()
		await expect( textCard.locator( '.wp-block-post-featured-image' ) ).toHaveCount( 0 )
		await expect( featuredCard.locator( '.wp-block-post-author' ) ).toBeVisible()
		await expect( featuredCard.locator( '.wp-block-post-date' ) ).toBeVisible()
		await expect( featuredCard.locator( '.wp-block-post-terms' ) ).toBeVisible()

		const imageBox = await featuredCard.locator( '.wp-block-post-featured-image' ).boundingBox()
		const desktopFeaturedBox = await featuredCard.boundingBox()
		const desktopTextBox = await textCard.boundingBox()
		expect( imageBox ).not.toBeNull()
		expect( desktopFeaturedBox ).not.toBeNull()
		expect( desktopTextBox ).not.toBeNull()
		expect( imageBox!.width / imageBox!.height ).toBeCloseTo( 1.5, 1 )
		expect( desktopFeaturedBox!.width ).toBeCloseTo( desktopTextBox!.width, 0 )
		expect( desktopFeaturedBox!.y ).toBeCloseTo( desktopTextBox!.y, 0 )
		expect( Math.abs( desktopFeaturedBox!.x - desktopTextBox!.x ) ).toBeGreaterThan( 100 )

		await page.setViewportSize( { width: 375, height: 900 } )
		await expect( featuredCard ).toBeVisible()
		await expect( textCard ).toBeVisible()
		const featuredBox = await featuredCard.boundingBox()
		const textBox = await textCard.boundingBox()
		expect( featuredBox ).not.toBeNull()
		expect( textBox ).not.toBeNull()
		expect( textBox!.x ).toBeCloseTo( featuredBox!.x, 0 )
		expect( Math.abs( textBox!.y - featuredBox!.y ) ).toBeGreaterThan( 100 )
	} )

	test( 'single post renders article metadata, featured image, navigation, and comments', async ( {
		page,
	} ) => {
		await page.goto( new URL( fixture.featured.link ).pathname )

		await expect( page.getByRole( 'heading', { level: 1, name: FEATURED_TITLE } ) ).toBeVisible()
		await expect( page.locator( 'main .wp-block-post-featured-image img' ) ).toBeVisible()
		await expect( page.locator( 'main .wp-block-post-author' ) ).toBeVisible()
		await expect( page.locator( 'main .wp-block-post-date' ) ).toBeVisible()
		await expect( page.locator( 'main .wp-block-post-terms' ).first() ).toBeVisible()
		await expect( page.locator( 'main .wp-block-post-content' ) ).toContainText( 'A featured article' )
		await expect( page.locator( 'main .wp-block-post-navigation-link' ) ).toHaveCount( 2 )
		await expect( page.locator( 'main .wp-block-comments' ) ).toBeVisible()
		await expect( page.locator( 'main .wp-block-post-comments-form' ) ).toBeVisible()
	} )

	test( 'single post preserves wide and full-width blocks while keeping text constrained', async ( {
		page,
		requestUtils,
	} ) => {
		await requestUtils.rest( {
			method: 'POST',
			path: `/wp/v2/posts/${ fixture.featured.id }`,
			data: {
				content: [
					'<!-- wp:paragraph --><p>Normal-width article text.</p><!-- /wp:paragraph -->',
					'<!-- wp:group {"align":"wide","backgroundColor":"tint","layout":{"type":"constrained"}} --><div class="wp-block-group alignwide has-tint-background-color has-background"><!-- wp:paragraph --><p>Wide article content.</p><!-- /wp:paragraph --></div><!-- /wp:group -->',
					'<!-- wp:group {"align":"full","backgroundColor":"primary-soft","layout":{"type":"constrained"}} --><div class="wp-block-group alignfull has-primary-soft-background-color has-background"><!-- wp:paragraph --><p>Full-width article content.</p><!-- /wp:paragraph --></div><!-- /wp:group -->',
				].join( '\n' ),
			},
		} )
		await page.setViewportSize( { width: 1600, height: 1000 } )
		await page.goto( new URL( fixture.featured.link ).pathname )

		const paragraph = page.locator( '.wp-block-post-content > p' )
		const wideBlock = page.locator( '.wp-block-post-content > .alignwide' )
		const fullBlock = page.locator( '.wp-block-post-content > .alignfull' )
		await expect( paragraph ).toBeVisible()
		await expect( wideBlock ).toBeVisible()
		await expect( fullBlock ).toBeVisible()
		const paragraphBox = await paragraph.boundingBox()
		const wideBox = await wideBlock.boundingBox()
		const fullBox = await fullBlock.boundingBox()
		expect( paragraphBox!.width ).toBeCloseTo( 645, 0 )
		expect( wideBox!.width ).toBeCloseTo( 1340, 0 )
		expect( fullBox!.width ).toBeCloseTo( 1600, 0 )
		expect( fullBox!.x ).toBeCloseTo( 0, 0 )

		await page.setViewportSize( { width: 375, height: 900 } )
		const mobileParagraphBox = await paragraph.boundingBox()
		const mobileFullBox = await fullBlock.boundingBox()
		expect( mobileParagraphBox!.x ).toBeGreaterThan( 0 )
		expect( mobileParagraphBox!.width ).toBeLessThan( 375 )
		expect( mobileFullBox!.x ).toBeCloseTo( 0, 0 )
		expect( mobileFullBox!.width ).toBeCloseTo( 375, 0 )
		expect( await page.evaluate( () => document.documentElement.scrollWidth ) ).toBe( 375 )
	} )

	test( 'untitled cards keep working article links with and without featured images', async ( {
		page,
		requestUtils,
	} ) => {
		for ( const post of [ fixture.featured, fixture.text ] ) {
			await requestUtils.rest( {
				method: 'POST',
				path: `/wp/v2/posts/${ post.id }`,
				data: { title: '' },
			} )
		}
		await page.goto( '/' )
		const categoryUrl = await page.locator( `.wp-block-post.post-${ fixture.featured.id } .wp-block-post-terms a` ).getAttribute( 'href' )
		expect( categoryUrl ).toBeTruthy()

		for ( const view of [ '/', categoryUrl!, '/?s=article' ] ) {
			for ( const post of [ fixture.featured, fixture.text ] ) {
				await page.goto( view )
				const card = page.locator( `.wp-block-post.post-${ post.id }` )
				await expect( card ).toBeVisible()
				await expect( card.locator( '.wp-block-post-title' ) ).toHaveCount( 0 )
				const articleLink = card.locator( `a[href="${ post.link }"]` ).first()
				await expect( articleLink ).toBeVisible()
				await articleLink.click()
				await expect( page ).toHaveURL( post.link )
				await expect( page.locator( 'main .wp-block-post-content' ) ).toContainText( 'article' )
			}
		}
	} )

	test( 'archive, search, empty search, and 404 share the designed shell', async ( {
		page,
	} ) => {
		await page.goto( '/' )
		const categoryUrl = await page.locator( '.wp-block-post' ).filter( { hasText: FEATURED_TITLE } )
			.locator( '.wp-block-post-terms a' ).getAttribute( 'href' )
		expect( categoryUrl ).toBeTruthy()
		await page.goto( categoryUrl! )
		await expect( page.locator( '.wp-block-post' ).filter( { hasText: FEATURED_TITLE } ) ).toBeVisible()

		await page.goto( '/?s=Phase+4+Featured' )
		await expect( page.locator( '.wp-block-post' ).filter( { hasText: FEATURED_TITLE } ) ).toBeVisible()

		await page.goto( '/?s=definitely-no-phase-4-match' )
		await expect( page.getByRole( 'heading', { name: 'Nothing matched your search' } ) ).toBeVisible()

		const response = await page.goto( '/phase-4-page-does-not-exist/' )
		expect( response?.status() ).toBe( 404 )
		await expect( page.getByRole( 'heading', { level: 1, name: 'Page not found' } ) ).toBeVisible()
		await expect( page.locator( 'main .wp-block-search' ) ).toBeVisible()
	} )

	test( 'home template renders the same grid for a configured posts page', async ( {
		page,
		requestUtils,
	} ) => {
		const frontPage = await requestUtils.createRecord< RestRecord >( 'pages', {
			title: 'Phase 4 Front Page',
			slug: 'phase-4-front-page',
			content: '<!-- wp:paragraph --><p>Static front page.</p><!-- /wp:paragraph -->',
			status: 'publish',
		} )
		const postsPage = await requestUtils.createRecord< RestRecord >( 'pages', {
			title: 'Phase 4 Journal',
			slug: 'phase-4-journal',
			content: '',
			status: 'publish',
		} )
		fixture.pageIds.push( frontPage.id, postsPage.id )

		await requestUtils.rest( {
			method: 'POST',
			path: '/wp/v2/settings',
			data: {
				show_on_front: 'page',
				page_on_front: frontPage.id,
				page_for_posts: postsPage.id,
			},
		} )

		await page.goto( new URL( postsPage.link ).pathname )
		await expect( page.getByRole( 'heading', { level: 1, name: 'Latest posts' } ) ).toBeVisible()
		await expect( page.locator( '.wp-block-post' ).filter( { hasText: FEATURED_TITLE } ) ).toBeVisible()
		await expect( page.locator( '.wp-block-post' ).filter( { hasText: TEXT_TITLE } ) ).toBeVisible()
	} )

	test( 'Site Editor loads every blog template without recovery warnings', async ( {
		page,
		admin,
	} ) => {
		for ( const templateSlug of BLOG_TEMPLATE_SLUGS ) {
			await admin.visitSiteEditor( {
				postType: 'wp_template',
				postId: `${ THEME_SLUG }//${ templateSlug }`,
				canvas: 'edit',
			} )

			const canvas = page.frameLocator( 'iframe[name="editor-canvas"]' )
			await expect( canvas.locator( '.wp-block-site-title' ).first() ).toBeVisible()
			await expect( canvas.locator( '.wp-block-heading' ).filter( { hasText: /^Resources$/ } ) ).toBeVisible()
			await expect( canvas.getByText( /Template part has been deleted or is unavailable/ ) ).toHaveCount( 0 )
			await expect( canvas.getByText( 'Attempt Recovery' ) ).toHaveCount( 0 )
		}
	} )
} )
