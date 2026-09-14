import { test, expect } from '../test-utils/test'
import { getContrastRatio } from '../test-utils/color'

const THEME_SLUG = process.env.THEME_SLUG || 'start-stackable'
const HEADER_FLAGS = [
	'stk-shell-header-sticky',
	'stk-shell-header-transparent',
]

type RestRecord = {
	id: number
	link: string
}

test.describe( 'Header flags', () => {
	let fixture: RestRecord

	test.beforeEach( async ( { page, requestUtils } ) => {
		await requestUtils.activateTheme( THEME_SLUG )
		fixture = await requestUtils.createRecord< RestRecord >( 'pages', {
			title: 'Phase 6 Header Fixture',
			slug: `phase-6-header-${ Date.now() }`,
			content:
				'<!-- wp:group {"align":"full","backgroundColor":"primary-soft","style":{"dimensions":{"minHeight":"1200px"}},"layout":{"type":"constrained","verticalAlignment":"center"}} --><div class="wp-block-group alignfull has-primary-soft-background-color has-background" style="min-height:1200px"><!-- wp:heading {"level":1} --><h1 class="wp-block-heading">Header overlay hero</h1><!-- /wp:heading --></div><!-- /wp:group -->',
			status: 'publish',
			template: 'full-width',
		} )

		await page.addInitScript( ( flags ) => {
			const applyFlags = () => {
				if ( ! document.body ) {
					return false
				}

				document.body.classList.add( ...flags )
				return true
			}

			if ( ! applyFlags() ) {
				const observer = new MutationObserver( () => {
					if ( applyFlags() ) {
						observer.disconnect()
					}
				} )
				observer.observe( document, { childList: true, subtree: true } )
			}
		}, HEADER_FLAGS )
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

	test( 'transparent sticky header becomes solid and keeps mobile navigation above the hero', async ( {
		page,
	} ) => {
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
} )
