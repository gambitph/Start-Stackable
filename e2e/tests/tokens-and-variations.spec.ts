import { test, expect } from '../test-utils/test'
import {
	applyStyleVariation,
	getStyleVariations,
	type StyleVariation,
} from '../test-utils/global-styles'

const THEME_SLUG = process.env.THEME_SLUG || 'start-stackable'

type PaletteColor = {
	color: string
	slug: string
}

type SizePreset = {
	fluid?: {
		max: string
		min: string
	}
	size: string
	slug: string
}

type FontFamilyPreset = {
	fontFace?: {
		fontFamily: string
		fontStyle: string
		fontWeight: string
		src: string[]
	}[]
	fontFamily: string
	slug: string
}

type ThemeGlobalStyles = {
	settings: {
		border: {
			radiusSizes: {
				theme: SizePreset[]
			}
		}
		color: {
			palette: {
				theme: PaletteColor[]
			}
		}
		layout: {
			contentSize: string
			wideSize: string
		}
		shadow: {
			presets: {
				theme: { shadow: string; slug: string }[]
			}
		}
		spacing: {
			spacingSizes: {
				theme: SizePreset[]
			}
		}
		typography: {
			fontFamilies: {
				theme: FontFamilyPreset[]
			}
			fontSizes: {
				theme: SizePreset[]
			}
		}
	}
	styles: {
		blocks: Record< string, unknown >
		elements: Record< string, unknown >
		typography: {
			fontFamily: string
		}
	}
}

type RestRecord = {
	id: number
	link: string
}

const COLOR_VARIATIONS = [
	'Dark',
	'Indigo',
	'Lime',
	'Orange',
	'Purple',
	'Red',
	'Rose',
	'Teal',
	'Yellow',
]

const PALETTE_SLUGS = [
	'base',
	'base-accent',
	'contrast',
	'contrast-accent',
	'outline',
	'outline-contrast',
	'primary',
	'primary-deep',
	'primary-light',
	'primary-soft',
	'tint',
]

const REQUIRED_BLOCK_STYLES = [
	'core/button',
	'core/navigation',
	'core/post-title',
	'core/query-pagination',
	'core/quote',
	'core/search',
	'core/site-title',
]

const REQUIRED_ELEMENT_STYLES = [ 'button', 'heading', 'link' ]

test.describe( 'Tokens and style variations', () => {
	let buttonCheckPage: RestRecord
	let seededPost: RestRecord

	test.beforeEach( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( THEME_SLUG )
		await requestUtils.resetThemeGlobalStyles()
		buttonCheckPage = await requestUtils.createRecord< RestRecord >( 'pages', {
			title: 'Phase 2 Button Check',
			slug: `phase-2-button-check-${ Date.now() }`,
			content: '<!-- wp:search {"label":"Search","showLabel":false,"buttonText":"Search"} /-->',
			status: 'publish',
		} )
		seededPost = await requestUtils.createRecord< RestRecord >( 'posts', {
			title: 'Phase 2 Style Check',
			slug: `phase-2-style-check-${ Date.now() }`,
			content: '<!-- wp:paragraph --><p>Style variation fixture.</p><!-- /wp:paragraph -->',
			status: 'publish',
		} )
	} )

	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.resetThemeGlobalStyles()
		await requestUtils.rest( {
			method: 'DELETE',
			path: `/wp/v2/pages/${ buttonCheckPage.id }`,
			params: { force: true },
		} )
		await requestUtils.rest( {
			method: 'DELETE',
			path: `/wp/v2/posts/${ seededPost.id }`,
			params: { force: true },
		} )
	} )

	test( 'WordPress exposes the complete design-system contract and style variations', async ( {
		page,
		requestUtils,
	} ) => {
		const themeStyles = await requestUtils.rest< ThemeGlobalStyles >( {
			path: `/wp/v2/global-styles/themes/${ THEME_SLUG }`,
		} )
		const variations = await getStyleVariations( requestUtils, THEME_SLUG )
		const colorVariations = variations.filter( ( variation ) => variation.settings?.color?.palette?.theme )

		expect(
			themeStyles.settings.color.palette.theme.map( ( color ) => color.slug ).sort()
		).toEqual( PALETTE_SLUGS )
		expect( themeStyles.settings.layout ).toEqual( {
			contentSize: '645px',
			wideSize: '1340px',
		} )
		expect(
			themeStyles.settings.border.radiusSizes.theme.map( ( preset ) => preset.slug )
		).toEqual( [ 'small', 'medium', 'large', 'full' ] )
		expect(
			themeStyles.settings.shadow.presets.theme.map( ( preset ) => preset.slug )
		).toEqual( [ 'small', 'medium', 'large' ] )
		expect(
			themeStyles.settings.spacing.spacingSizes.theme.every( ( preset ) => preset.size.startsWith( 'clamp(' ) )
		).toBe( true )
		expect(
			themeStyles.settings.typography.fontSizes.theme.every(
				( preset ) => Boolean( preset.fluid?.min && preset.fluid?.max )
			)
		).toBe( true )

		const fontFamilies = themeStyles.settings.typography.fontFamilies.theme
		const jakarta = fontFamilies.find( ( preset ) => preset.slug === 'plus-jakarta-sans' )
		expect( fontFamilies.map( ( preset ) => preset.slug ) ).toEqual(
			expect.arrayContaining( [ 'sans-serif', 'plus-jakarta-sans' ] )
		)
		expect( jakarta?.fontFace ).toEqual( [
			expect.objectContaining( {
				fontFamily: 'Plus Jakarta Sans',
				fontStyle: 'normal',
				fontWeight: '200 800',
				src: [ 'file:./assets/fonts/plus-jakarta-sans.woff2' ],
			} ),
		] )
		expect( themeStyles.styles.typography.fontFamily ).toBe(
			'var(--wp--preset--font-family--sans-serif)'
		)
		expect( Object.keys( themeStyles.styles.elements ) ).toEqual(
			expect.arrayContaining( REQUIRED_ELEMENT_STYLES )
		)
		expect( Object.keys( themeStyles.styles.blocks ) ).toEqual(
			expect.arrayContaining( REQUIRED_BLOCK_STYLES )
		)
		expect( colorVariations.map( ( variation ) => variation.title ).sort() ).toEqual(
			COLOR_VARIATIONS
		)

		for ( const variation of colorVariations ) {
			expect(
				variation.settings?.color?.palette?.theme?.map( ( color ) => color.slug ).sort()
			).toEqual( PALETTE_SLUGS )
		}

		expect( variations.map( ( variation ) => variation.title ) ).toEqual(
			expect.arrayContaining( [ 'Dark', 'Editorial', 'Compact' ] )
		)

		const fontResponsePromise = page.waitForResponse( ( response ) =>
			response.url().includes( '/assets/fonts/plus-jakarta-sans.woff2' )
		)
		await page.goto( '/' )
		expect( ( await fontResponsePromise ).ok() ).toBe( true )
		await expect( page.locator( '.wp-block-site-title' ).first() ).toHaveCSS(
			'font-family',
			/Plus Jakarta Sans/
		)
		expect( await page.locator( 'body' ).evaluate( ( element ) => getComputedStyle( element ).fontFamily ) )
			.toContain( '-apple-system' )
	} )

	test( 'dark variation updates the front-end semantic colors', async ( {
		page,
		requestUtils,
	} ) => {
		const variations = await getStyleVariations( requestUtils, THEME_SLUG )
		const dark = variations.find( ( variation ) => variation.title === 'Dark' )

		expect( dark ).toBeDefined()
		await applyStyleVariation( requestUtils, dark as StyleVariation )
		await page.goto( '/' )

		const colors = await page.evaluate( () => ( {
			background: getComputedStyle( document.body ).backgroundColor,
			text: getComputedStyle( document.body ).color,
			base: getComputedStyle( document.documentElement ).getPropertyValue( '--wp--preset--color--base' ).trim(),
			contrast: getComputedStyle( document.documentElement ).getPropertyValue( '--wp--preset--color--contrast' ).trim(),
		} ) )
		const shellColors = {
			header: await page.locator( '.wp-block-site-title a' ).first().evaluate(
				( element ) => getComputedStyle( element ).color
			),
			footer: await page.locator( 'footer p' ).first().evaluate(
				( element ) => getComputedStyle( element ).color
			),
			postCard: await page.locator( '.wp-block-post-title a' ).first().evaluate(
				( element ) => getComputedStyle( element ).color
			),
		}

		expect( colors ).toEqual( {
			background: 'rgb(11, 17, 32)',
			text: 'rgb(248, 250, 252)',
			base: '#0B1120',
			contrast: '#F8FAFC',
		} )
		expect( shellColors ).toEqual( {
			header: 'rgb(248, 250, 252)',
			footer: 'rgb(248, 250, 252)',
			postCard: 'rgb(199, 210, 254)',
		} )

		await page.goto( new URL( buttonCheckPage.link ).pathname )
		const searchButton = page.locator( '.wp-block-search__button' )
		await expect( searchButton ).toBeVisible()
		expect( await searchButton.evaluate( ( element ) => ( {
			background: getComputedStyle( element ).backgroundColor,
			text: getComputedStyle( element ).color,
		} ) ) ).toEqual( {
			background: 'rgb(199, 210, 254)',
			text: 'rgb(11, 17, 32)',
		} )
	} )

	test( 'typography variations change visible front-end type', async ( {
		page,
		requestUtils,
	} ) => {
		await page.goto( '/' )
		const defaultSize = await page.locator( '.wp-block-site-title' ).first().evaluate(
			( element ) => getComputedStyle( element ).fontSize
		)

		const variations = await getStyleVariations( requestUtils, THEME_SLUG )
		const compact = variations.find( ( variation ) => variation.title === 'Compact' )
		const editorial = variations.find( ( variation ) => variation.title === 'Editorial' )

		expect( compact ).toBeDefined()
		expect( editorial ).toBeDefined()
		await applyStyleVariation( requestUtils, compact as StyleVariation )
		await page.reload()

		const compactSize = await page.locator( '.wp-block-site-title' ).first().evaluate(
			( element ) => getComputedStyle( element ).fontSize
		)

		expect( compactSize ).not.toBe( defaultSize )
		expect( Number.parseFloat( compactSize ) ).toBeLessThan( Number.parseFloat( defaultSize ) )

		await requestUtils.resetThemeGlobalStyles()
		await applyStyleVariation( requestUtils, editorial as StyleVariation )
		await page.reload()

		const editorialSize = await page.locator( '.wp-block-site-title' ).first().evaluate(
			( element ) => getComputedStyle( element ).fontSize
		)

		expect( editorialSize ).not.toBe( defaultSize )
		expect( Number.parseFloat( editorialSize ) ).toBeGreaterThan( Number.parseFloat( defaultSize ) )
	} )
} )
