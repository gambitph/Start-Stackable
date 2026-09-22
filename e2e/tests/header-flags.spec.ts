import type { RequestUtils } from '@wordpress/e2e-test-utils-playwright'
import { test, expect } from '../test-utils/test'
import { getContrastRatio } from '../test-utils/color'

const THEME_SLUG = process.env.THEME_SLUG || 'start-stackable'
const OVERFLOW_LINK_LABELS = [
	'Overview',
	'Services',
	'Solutions',
	'Resources',
	'Customers',
	'Company',
	'Journal',
	'Contact',
]

type BlockPattern = {
	content?: string
	name: string
}

type RestRecord = {
	id: number
	link: string
}

async function installHeaderContent( requestUtils: RequestUtils, content: string ) {
	await requestUtils.deleteAllTemplates( 'wp_template_part' )
	await requestUtils.createTemplate( 'wp_template_part', {
		slug: 'header',
		title: 'Header preset fixture',
		content,
	} )
}

async function installHeaderPreset( requestUtils: RequestUtils, patternSlug: string ) {
	const patterns = await requestUtils.rest< BlockPattern[] >( {
		path: '/wp/v2/block-patterns/patterns',
	} )
	const pattern = patterns.find( ( candidate ) => candidate.name === patternSlug )
	expect( pattern?.content ).toBeTruthy()

	await installHeaderContent( requestUtils, pattern!.content! )
}

function createOverflowHeaderContent() {
	const links = OVERFLOW_LINK_LABELS.map( ( label ) => {
		const slug = label.toLowerCase()
		return `<!-- wp:navigation-link {"label":"${ label }","url":"#${ slug }","kind":"custom"} /-->`
	} ).join( '\n' )

	return `<!-- wp:group {"align":"full","backgroundColor":"tint","style":{"spacing":{"padding":{"top":"var:preset|spacing|medium","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|medium","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-tint-background-color has-background" style="padding-top:var(--wp--preset--spacing--medium);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--medium);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:group {"align":"wide","layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group alignwide"><!-- wp:site-title {"level":0} /-->

<!-- wp:navigation {"overlayMenu":"mobile","layout":{"type":"flex","justifyContent":"right"}} -->
${ links }
<!-- /wp:navigation --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->`
}

function createPageListHeaderContent() {
	return `<!-- wp:group {"align":"full","backgroundColor":"tint","style":{"spacing":{"padding":{"top":"var:preset|spacing|medium","right":"var:preset|spacing|xx-large","bottom":"var:preset|spacing|medium","left":"var:preset|spacing|xx-large"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-tint-background-color has-background" style="padding-top:var(--wp--preset--spacing--medium);padding-right:var(--wp--preset--spacing--xx-large);padding-bottom:var(--wp--preset--spacing--medium);padding-left:var(--wp--preset--spacing--xx-large)"><!-- wp:group {"align":"wide","layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group alignwide"><!-- wp:site-title {"level":0} /-->

<!-- wp:navigation {"overlayMenu":"mobile","layout":{"type":"flex","justifyContent":"right"}} -->
<!-- wp:page-list /-->
<!-- /wp:navigation --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->`
}

test.describe( 'Header flags', () => {
	let fixture: RestRecord
	let overflowPageIds: number[]

	test.beforeEach( async ( { page, requestUtils } ) => {
		await requestUtils.activateTheme( THEME_SLUG )
		overflowPageIds = []
		fixture = await requestUtils.createRecord< RestRecord >( 'pages', {
			title: 'Phase 6 Header Fixture',
			slug: `phase-6-header-${ Date.now() }`,
			content:
				'<!-- wp:group {"align":"full","backgroundColor":"primary-soft","style":{"dimensions":{"minHeight":"1200px"}},"layout":{"type":"constrained","verticalAlignment":"center"}} --><div class="wp-block-group alignfull has-primary-soft-background-color has-background" style="min-height:1200px"><!-- wp:heading {"level":1} --><h1 class="wp-block-heading">Header overlay hero</h1><!-- /wp:heading --></div><!-- /wp:group -->',
			status: 'publish',
			template: 'full-width',
		} )
	} )

	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.deleteAllTemplates( 'wp_template_part' )
		if ( fixture?.id ) {
			await requestUtils.rest( {
				method: 'DELETE',
				path: `/wp/v2/pages/${ fixture.id }`,
				params: { force: true },
			} )
		}
		for ( const pageId of overflowPageIds ) {
			await requestUtils.rest( {
				method: 'DELETE',
				path: `/wp/v2/pages/${ pageId }`,
				params: { force: true },
			} )
		}
	} )

	test( 'transparent sticky header becomes solid and keeps mobile navigation above the hero', async ( {
		page,
		requestUtils,
	} ) => {
		await installHeaderPreset( requestUtils, 'start-stackable/header-transparent' )
		await page.setViewportSize( { width: 1440, height: 900 } )
		await page.goto( fixture.link )

		const header = page.locator( '.wp-site-blocks > header' )
		const headerSurface = header.locator( ':scope > .wp-block-group' )
		const hero = page.getByRole( 'heading', { name: 'Header overlay hero' } ).locator( '..' )

		await expect( header ).toHaveClass( /stk-shell-header-sticky/ )
		await expect( header ).toHaveClass( /stk-shell-header-transparent/ )
		await expect
			.poll( () => page.evaluate( () => getComputedStyle( document.documentElement ).getPropertyValue( '--stk-header-height' ) ) )
			.toMatch( /^[1-9]\d*(?:\.\d+)?px$/ )

		const headerBox = await header.boundingBox()
		const heroBox = await hero.boundingBox()
		expect( headerBox ).not.toBeNull()
		expect( heroBox ).not.toBeNull()
		expect( headerBox!.y ).toBeCloseTo( heroBox!.y, 0 )
		await expect( headerSurface ).toHaveCSS( 'background-color', 'rgba(0, 0, 0, 0)' )
		const topColors = await page.evaluate( () => ( {
			background: getComputedStyle( document.querySelector( '.wp-block-post-content > .alignfull' )! ).backgroundColor,
			text: getComputedStyle( document.querySelector( '.wp-site-blocks > header .wp-block-navigation-item__content' )! ).color,
		} ) )
		expect( getContrastRatio( topColors.text, topColors.background ) ).toBeGreaterThanOrEqual( 4.5 )

		await page.evaluate( () => window.scrollTo( 0, 500 ) )
		await expect( header ).toHaveClass( /stk-shell-header-scrolled/ )
		await expect( headerSurface ).not.toHaveCSS( 'background-color', 'rgba(0, 0, 0, 0)' )
		const scrolledColors = await header.evaluate( ( element ) => ( {
			background: getComputedStyle( element.querySelector( ':scope > .wp-block-group' )! ).backgroundColor,
			text: getComputedStyle( element.querySelector( '.wp-block-navigation-item__content' )! ).color,
		} ) )
		expect( getContrastRatio( scrolledColors.text, scrolledColors.background ) ).toBeGreaterThanOrEqual( 4.5 )
		const scrolledHeaderBox = await header.boundingBox()
		const stickyTop = await header.evaluate( ( element ) => Number.parseFloat( getComputedStyle( element ).top ) )
		expect( scrolledHeaderBox ).not.toBeNull()
		expect( scrolledHeaderBox!.y ).toBeCloseTo( stickyTop, 0 )

		await page.setViewportSize( { width: 375, height: 900 } )
		await page.evaluate( () => window.scrollTo( 0, 0 ) )
		await page.locator( '.wp-block-navigation__responsive-container-open' ).click()
		const mobileMenu = header.locator( '.wp-block-navigation__responsive-container.is-menu-open' )
		await expect( mobileMenu ).toBeVisible()
		const mobileMenuBox = await mobileMenu.boundingBox()
		expect( mobileMenuBox ).not.toBeNull()
		expect( mobileMenuBox!.width ).toBeCloseTo( 375, 0 )
		expect( mobileMenuBox!.height ).toBeCloseTo( 900, 0 )
		const stacking = await page.evaluate( () => ( {
			hero: Number.parseInt( getComputedStyle( document.querySelector( '.wp-block-post-content > .alignfull' )! ).zIndex, 10 ) || 0,
			menu: Number.parseInt( getComputedStyle( document.querySelector( '.wp-block-navigation__responsive-container.is-menu-open' )! ).zIndex, 10 ) || 0,
		} ) )
		expect( stacking.menu ).toBeGreaterThan( stacking.hero )
		await mobileMenu.locator( '.wp-block-navigation__responsive-container-close' ).click()
		await expect( mobileMenu ).not.toBeVisible()
	} )

	test( 'solid sticky header remains opaque while it sticks', async ( {
		page,
		requestUtils,
	} ) => {
		await installHeaderPreset( requestUtils, 'start-stackable/header-sticky' )
		await page.setViewportSize( { width: 1440, height: 900 } )
		await page.goto( fixture.link )

		const header = page.locator( '.wp-site-blocks > header' )
		const headerSurface = header.locator( ':scope > .wp-block-group' )
		await expect( header ).toHaveClass( /stk-shell-header-sticky/ )
		await expect( header ).not.toHaveClass( /stk-shell-header-transparent/ )
		await expect( header ).toHaveCSS( 'position', 'sticky' )
		await expect( headerSurface ).not.toHaveCSS( 'background-color', 'rgba(0, 0, 0, 0)' )

		await page.evaluate( () => window.scrollTo( 0, 500 ) )
		await expect( header ).toHaveClass( /stk-shell-header-scrolled/ )
		const headerBox = await header.boundingBox()
		const stickyTop = await header.evaluate( ( element ) => Number.parseFloat( getComputedStyle( element ).top ) )
		expect( headerBox ).not.toBeNull()
		expect( headerBox!.y ).toBeCloseTo( stickyTop, 0 )
		await expect( headerSurface ).not.toHaveCSS( 'background-color', 'rgba(0, 0, 0, 0)' )
	} )

	test( 'desktop navigation moves only overflowing links into More and restores them for wide and mobile layouts', async ( {
		page,
		requestUtils,
	} ) => {
		await installHeaderContent( requestUtils, createOverflowHeaderContent() )
		await page.setViewportSize( { width: 900, height: 900 } )
		await page.goto( fixture.link )

		const header = page.locator( '.wp-site-blocks > header' )
		const navigation = header.getByRole( 'navigation' )
		const moreButton = navigation.getByRole( 'button', { name: 'More', exact: true } )
		const overflowMenu = navigation.locator( '.stk-navigation-overflow__menu' )
		await expect( moreButton ).toBeVisible()
		await expect( moreButton ).toHaveAttribute( 'aria-expanded', 'false' )
		await expect( overflowMenu ).toBeHidden()

		const visibleLabels = await navigation.locator(
			'.wp-block-navigation__container > .wp-block-navigation-item:not(.stk-navigation-overflow) > .wp-block-navigation-item__content'
		).allTextContents()
		const overflowLabels = await overflowMenu.locator(
			':scope > .wp-block-navigation-item > .wp-block-navigation-item__content'
		).allTextContents()
		expect( visibleLabels.length ).toBeGreaterThan( 0 )
		expect( overflowLabels.length ).toBeGreaterThan( 0 )
		expect( [ ...visibleLabels, ...overflowLabels ] ).toEqual( OVERFLOW_LINK_LABELS )
		expect( await page.evaluate( () => document.documentElement.scrollWidth ) ).toBe( 900 )

		await moreButton.click()
		await expect( moreButton ).toHaveAttribute( 'aria-expanded', 'true' )
		await expect( overflowMenu ).toBeVisible()
		await page.keyboard.press( 'Escape' )
		await expect( moreButton ).toHaveAttribute( 'aria-expanded', 'false' )
		await expect( moreButton ).toBeFocused()

		await page.setViewportSize( { width: 1600, height: 900 } )
		await expect( moreButton ).toHaveCount( 0 )
		await expect( navigation.locator(
			'.wp-block-navigation__container > .wp-block-navigation-item > .wp-block-navigation-item__content'
		) ).toHaveText( OVERFLOW_LINK_LABELS )

		await page.setViewportSize( { width: 375, height: 900 } )
		await expect( moreButton ).toHaveCount( 0 )
		await navigation.locator( '.wp-block-navigation__responsive-container-open' ).click()
		for ( const label of OVERFLOW_LINK_LABELS ) {
			await expect( navigation.getByRole( 'link', { name: label, exact: true } ) ).toBeVisible()
		}
	} )

	test( 'automatic Page List navigation also moves overflowing pages into More', async ( {
		page,
		requestUtils,
	} ) => {
		for ( const label of OVERFLOW_LINK_LABELS ) {
			const overflowPage = await requestUtils.createRecord< RestRecord >( 'pages', {
				title: `Overflow ${ label }`,
				slug: `overflow-${ label.toLowerCase() }-${ Date.now() }`,
				status: 'publish',
			} )
			overflowPageIds.push( overflowPage.id )
		}
		await installHeaderContent( requestUtils, createPageListHeaderContent() )
		await page.setViewportSize( { width: 900, height: 900 } )
		await page.goto( fixture.link )

		const navigation = page.locator( '.wp-site-blocks > header' ).getByRole( 'navigation' )
		const moreButton = navigation.getByRole( 'button', { name: 'More', exact: true } )
		await expect( moreButton ).toBeVisible()
		await expect( navigation.locator( '.wp-block-page-list > .stk-navigation-overflow' ) ).toHaveCount( 1 )
		const visibleItemBoxes = await navigation.locator(
			'.wp-block-page-list > .wp-block-navigation-item:not(.stk-navigation-overflow)'
		).evaluateAll( ( items ) => items.map( ( item ) => item.getBoundingClientRect() ) )
		expect( new Set( visibleItemBoxes.map( ( box ) => Math.round( box.y ) ) ).size ).toBe( 1 )
		expect( Math.max( ...visibleItemBoxes.map( ( box ) => box.height ) ) ).toBeLessThan( 40 )

		await moreButton.click()
		await expect( navigation.getByRole( 'link', { name: 'Overflow Contact', exact: true } ) ).toBeVisible()

		await page.setViewportSize( { width: 375, height: 900 } )
		await expect( moreButton ).toHaveCount( 0 )
		await navigation.locator( '.wp-block-navigation__responsive-container-open' ).click()
		await expect( navigation.getByRole( 'link', { name: 'Overflow Contact', exact: true } ) ).toBeVisible()
	} )
} )
