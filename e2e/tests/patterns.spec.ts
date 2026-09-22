import type { Page } from '@playwright/test'
import type { RequestUtils } from '@wordpress/e2e-test-utils-playwright'
import { test, expect } from '../test-utils/test'
import { getContrastRatio } from '../test-utils/color'
import {
	applyStyleVariation,
	getStyleVariations,
	type StyleVariation,
} from '../test-utils/global-styles'

const THEME_SLUG = process.env.THEME_SLUG || 'start-stackable'
const TEMPLATE_PATTERNS = [
	'start-stackable/template-404',
	'start-stackable/template-archive',
	'start-stackable/template-blank',
	'start-stackable/template-full-width',
	'start-stackable/template-index-grid',
	'start-stackable/template-page',
	'start-stackable/template-search',
	'start-stackable/template-single',
]
const PART_PATTERNS = [
	'start-stackable/footer',
	'start-stackable/footer-landing',
	'start-stackable/header',
	'start-stackable/header-minimal',
	'start-stackable/header-sticky',
	'start-stackable/header-transparent',
]
const ATOM_PATTERNS = [
	'start-stackable/comments',
	'start-stackable/post-card',
	'start-stackable/post-meta',
]
const WOOCOMMERCE_PATTERNS = [
	'start-stackable/product-collection',
	'start-stackable/template-archive-product',
	'start-stackable/template-order-confirmation',
	'start-stackable/template-page-cart',
	'start-stackable/template-page-checkout',
	'start-stackable/template-product-search-results',
	'start-stackable/template-single-product',
]
const STARTER_PATTERN = 'start-stackable/page-home'
const ALL_PATTERNS = [
	...TEMPLATE_PATTERNS,
	...PART_PATTERNS,
	...ATOM_PATTERNS,
	...WOOCOMMERCE_PATTERNS,
	STARTER_PATTERN,
]
const INSERTER_PATTERNS = [
	...PART_PATTERNS,
	...ATOM_PATTERNS,
	STARTER_PATTERN,
]

type BlockPattern = {
	block_types?: string[]
	content?: string
	inserter?: boolean
	name: string
}

type RestRecord = {
	id: number
	link: string
}

async function getButtonColors( page: Page ) {
	return page.locator( 'main .wp-block-cover .wp-block-button__link' ).evaluateAll( ( buttons ) =>
		buttons.map( ( button ) => {
			const buttonStyles = getComputedStyle( button )
			const coverBackground = button.closest( '.wp-block-cover' )
				?.querySelector( '.wp-block-cover__background' )
			const background = buttonStyles.backgroundColor === 'rgba(0, 0, 0, 0)' && coverBackground
				? getComputedStyle( coverBackground ).backgroundColor
				: buttonStyles.backgroundColor

			return {
				background,
				text: buttonStyles.color,
			}
		} )
	)
}

async function getThemePatterns( requestUtils: RequestUtils ) {
	const patterns = await requestUtils.rest< BlockPattern[] >( {
		path: '/wp/v2/block-patterns/patterns',
	} )

	return patterns.filter( ( pattern ) => pattern.name.startsWith( 'start-stackable/' ) )
}

test.describe( 'Pattern catalog', () => {
	test.beforeEach( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( THEME_SLUG )
		await requestUtils.resetThemeGlobalStyles()
	} )

	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.resetThemeGlobalStyles()
	} )

	test( 'WordPress registers the complete catalog with the intended visibility', async ( {
		requestUtils,
	} ) => {
		const themePatterns = await getThemePatterns( requestUtils )
		const visiblePatterns = themePatterns
			.filter( ( pattern ) => pattern.inserter !== false )
			.map( ( pattern ) => pattern.name )
			.sort()
		const homepage = themePatterns.find( ( pattern ) => pattern.name === STARTER_PATTERN )
		expect( themePatterns.map( ( pattern ) => pattern.name ).sort() ).toEqual(
			[ ...ALL_PATTERNS ].sort()
		)
		expect( visiblePatterns ).toEqual( [ ...INSERTER_PATTERNS ].sort() )
		expect(
			themePatterns
				.filter( ( pattern ) => TEMPLATE_PATTERNS.includes( pattern.name ) )
				.every( ( pattern ) => pattern.inserter === false )
		).toBe( true )
		expect(
			themePatterns
				.filter( ( pattern ) => WOOCOMMERCE_PATTERNS.includes( pattern.name ) )
				.every( ( pattern ) => pattern.inserter === false )
		).toBe( true )
		expect(
			themePatterns
				.filter( ( pattern ) => pattern.name.includes( '/header' ) )
				.every( ( pattern ) => pattern.block_types?.includes( 'core/template-part/header' ) )
		).toBe( true )
		expect(
			themePatterns
				.filter( ( pattern ) => pattern.name.includes( '/footer' ) )
				.every( ( pattern ) => pattern.block_types?.includes( 'core/template-part/footer' ) )
		).toBe( true )
		expect(
			themePatterns
				.filter( ( pattern ) => pattern.name.includes( '/header' ) )
				.every( ( pattern ) => ! pattern.content?.includes( '"ref":' ) )
		).toBe( true )
		expect( homepage?.block_types ).toContain( 'core/post-content' )
		expect( homepage?.content ).toContain( '<!-- wp:cover' )
		expect( homepage?.content ).toContain( '<!-- wp:columns' )
		expect( homepage?.content ).toContain( '<!-- wp:buttons' )
		expect( homepage?.content ).toContain( '<!-- wp:query ' )
		expect( homepage?.content ).not.toMatch( /wp:stackable\// )
	} )

	test( 'the Homepage starter is offered when creating a page', async ( {
		page,
		admin,
	} ) => {
		await admin.visitAdminPage( 'post-new.php', 'post_type=page' )

		const chooser = page.getByRole( 'dialog', { name: /Choose a pattern/i } )
		await expect( chooser ).toBeVisible()
		await expect( chooser.getByText( 'Homepage', { exact: true } ) ).toBeVisible()
	} )

	test( 'the Homepage starter renders cleanly on Full Width in Default and Dark', async ( {
		page,
		admin,
		requestUtils,
	} ) => {
		const themePatterns = await getThemePatterns( requestUtils )
		const homepage = themePatterns.find( ( pattern ) => pattern.name === STARTER_PATTERN )
		expect( homepage?.content ).toBeTruthy()

		const testPage = await requestUtils.createRecord< RestRecord >( 'pages', {
			title: 'Phase 7 Homepage Fixture',
			slug: `phase-7-homepage-${ Date.now() }`,
			content: homepage!.content,
			status: 'publish',
			template: 'full-width',
		} )

		try {
			await page.setViewportSize( { width: 1440, height: 900 } )
			await page.goto( testPage.link )
			await expect( page.getByRole( 'heading', { level: 1, name: 'Build a site that feels like yours.' } ) ).toBeVisible()
			await expect( page.getByRole( 'link', { name: 'Start here' } ) ).toBeVisible()
			await expect( page.getByRole( 'heading', { name: 'Everything you need to begin with confidence.' } ) ).toBeVisible()
			await expect( page.locator( '#start-here > .wp-block-group > .wp-block-columns > .wp-block-column' ) ).toHaveCount( 3 )
			await expect( page.getByRole( 'heading', { name: 'Latest stories' } ) ).toBeVisible()
			await expect( page.locator( '#latest-stories .wp-block-query' ) ).toBeVisible()
			await expect( page.getByRole( 'banner' ).getByRole( 'navigation' ) ).toBeVisible()
			await expect( page.getByRole( 'contentinfo' ) ).toBeVisible()

			const hero = page.locator( 'main .wp-block-cover' ).first()
			const heroBox = await hero.boundingBox()
			expect( heroBox ).not.toBeNull()
			expect( heroBox!.x ).toBeCloseTo( 0, 0 )
			expect( heroBox!.width ).toBeCloseTo( 1440, 0 )

			const heroColors = await page.evaluate( () => ( {
				background: getComputedStyle( document.querySelector( 'main .wp-block-cover__background' )! ).backgroundColor,
				text: getComputedStyle( document.querySelector( 'main .wp-block-cover h1' )! ).color,
			} ) )
			expect( getContrastRatio( heroColors.text, heroColors.background ) ).toBeGreaterThanOrEqual( 4.5 )
			const buttonColors = await getButtonColors( page )
			expect( buttonColors ).toHaveLength( 2 )
			for ( const colors of buttonColors ) {
				expect( getContrastRatio( colors.text, colors.background ) ).toBeGreaterThanOrEqual( 4.5 )
			}

			const variations = await getStyleVariations( requestUtils, THEME_SLUG )
			const dark = variations.find( ( variation ) => variation.title === 'Dark' )
			expect( dark ).toBeDefined()
			await applyStyleVariation( requestUtils, dark as StyleVariation )
			await page.reload()

			const darkHeroColors = await page.evaluate( () => ( {
				background: getComputedStyle( document.querySelector( 'main .wp-block-cover__background' )! ).backgroundColor,
				text: getComputedStyle( document.querySelector( 'main .wp-block-cover h1' )! ).color,
			} ) )
			expect( darkHeroColors ).not.toEqual( heroColors )
			expect( getContrastRatio( darkHeroColors.text, darkHeroColors.background ) ).toBeGreaterThanOrEqual( 4.5 )
			const darkButtonColors = await getButtonColors( page )
			expect( darkButtonColors ).not.toEqual( buttonColors )
			for ( const colors of darkButtonColors ) {
				expect( getContrastRatio( colors.text, colors.background ) ).toBeGreaterThanOrEqual( 4.5 )
			}

			await page.setViewportSize( { width: 375, height: 900 } )
			const mobileHeroBox = await hero.boundingBox()
			expect( mobileHeroBox ).not.toBeNull()
			expect( mobileHeroBox!.x ).toBeCloseTo( 0, 0 )
			expect( mobileHeroBox!.width ).toBeCloseTo( 375, 0 )
			expect( await page.evaluate( () => document.documentElement.scrollWidth ) ).toBe( 375 )

			await page.setViewportSize( { width: 1440, height: 900 } )
			await admin.visitAdminPage( 'post.php', `post=${ testPage.id }&action=edit` )
			const welcomeGuide = page.getByRole( 'dialog', { name: 'Welcome to the editor' } )
			if ( await welcomeGuide.isVisible() ) {
				await welcomeGuide.getByRole( 'button', { name: 'Close' } ).click()
			}
			const canvas = page.frameLocator( 'iframe[name="editor-canvas"]' )
			await expect(
				canvas.locator( 'h1.wp-block-heading' ).filter( { hasText: 'Build a site that feels like yours.' } )
			).toBeVisible()
			await expect( canvas.getByText( 'Attempt Recovery' ) ).toHaveCount( 0 )
		} finally {
			await requestUtils.rest( {
				method: 'DELETE',
				path: `/wp/v2/pages/${ testPage.id }`,
				params: { force: true },
			} )
		}
	} )
} )
