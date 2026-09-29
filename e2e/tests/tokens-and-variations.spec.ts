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
			defaultPresets: boolean
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

const PALETTE_SLUGS_IN_ROLE_ORDER = [
	'primary',
	'primary-deep',
	'contrast-accent',
	'outline-contrast',
	'outline',
	'base-accent',
	'tint',
	'base',
]

const DEFAULT_PALETTE = {
	primary: '#DBE8FB',
	'primary-deep': '#140018',
	'contrast-accent': '#645D73',
	'outline-contrast': '#140018',
	outline: '#E8E3EA',
	'base-accent': '#E7F0FD',
	tint: '#F4F8FE',
	base: '#FFFFFF',
}

const DEFAULT_RADIUS_SIZES = {
	small: '4px',
	medium: '12px',
	large: '20px',
	full: '9999px',
}

const DEFAULT_FLUID_TYPE = {
	large: { min: '1.25rem', max: '1.75rem' },
	'x-large': { min: '1.5rem', max: '2.5rem' },
	'xx-large': { min: '2.25rem', max: '4rem' },
	'xxx-large': { min: '2.75rem', max: '7rem' },
}

const getPaletteColor = ( palette: PaletteColor[], slug: string ) => {
	const color = palette.find( ( entry ) => entry.slug === slug )?.color
	expect( color ).toBeDefined()
	return color as string
}

const relativeLuminance = ( hex: string ) => {
	const channels = hex.slice( 1 ).match( /../g )?.map( ( channel ) => parseInt( channel, 16 ) / 255 )
	expect( channels ).toHaveLength( 3 )
	const linear = ( channels as number[] ).map( ( channel ) =>
		channel <= 0.04045 ? channel / 12.92 : ( ( channel + 0.055 ) / 1.055 ) ** 2.4
	)
	return ( 0.2126 * linear[ 0 ] ) + ( 0.7152 * linear[ 1 ] ) + ( 0.0722 * linear[ 2 ] )
}

const contrastRatio = ( foreground: string, background: string ) => {
	const foregroundLuminance = relativeLuminance( foreground )
	const backgroundLuminance = relativeLuminance( background )
	return ( Math.max( foregroundLuminance, backgroundLuminance ) + 0.05 ) /
		( Math.min( foregroundLuminance, backgroundLuminance ) + 0.05 )
}

const REQUIRED_BLOCK_STYLES = [
	'core/button',
	'core/image',
	'core/navigation',
	'core/post-excerpt',
	'core/post-title',
	'core/pullquote',
	'core/query-pagination',
	'core/quote',
	'core/read-more',
	'core/search',
	'core/separator',
	'core/site-title',
	'core/table',
]

const REQUIRED_ELEMENT_STYLES = [ 'button', 'heading', 'link', 'select', 'textInput' ]

test.describe( 'Tokens and style variations', () => {
	let designSystemCheckPage: RestRecord
	let seededPost: RestRecord

	test.beforeEach( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( THEME_SLUG )
		await requestUtils.resetThemeGlobalStyles()
		designSystemCheckPage = await requestUtils.createRecord< RestRecord >( 'pages', {
			title: 'Phase 2 Design System Check',
			slug: `phase-2-design-system-check-${ Date.now() }`,
			content: '<!-- wp:heading --><h2 class="wp-block-heading">Palette heading</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Default body copy.</p><!-- /wp:paragraph --><!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button --><div class="wp-block-button"><a class="wp-block-button__link wp-element-button">Primary action</a></div><!-- /wp:button --></div><!-- /wp:buttons --><!-- wp:quote --><blockquote class="wp-block-quote"><!-- wp:paragraph --><p>Default quote.</p><!-- /wp:paragraph --><cite>Source</cite></blockquote><!-- /wp:quote --><!-- wp:search {"label":"Search","showLabel":false,"buttonText":"Search"} /-->',
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
			path: `/wp/v2/pages/${ designSystemCheckPage.id }`,
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
		const defaultPalette = themeStyles.settings.color.palette.theme

		expect(
			defaultPalette.map( ( color ) => color.slug )
		).toEqual( PALETTE_SLUGS_IN_ROLE_ORDER )
		expect( Object.fromEntries(
			defaultPalette.map( ( color ) => [ color.slug, color.color ] )
		) ).toEqual( DEFAULT_PALETTE )
		expect(
			contrastRatio(
				getPaletteColor( defaultPalette, 'contrast-accent' ),
				getPaletteColor( defaultPalette, 'base' )
			)
		).toBeGreaterThanOrEqual( 4.5 )
		expect(
			relativeLuminance( getPaletteColor( defaultPalette, 'outline-contrast' ) )
		).toBeLessThan(
			relativeLuminance( getPaletteColor( defaultPalette, 'contrast-accent' ) )
		)
		expect( themeStyles.settings.layout ).toEqual( {
			contentSize: '645px',
			wideSize: '1340px',
		} )
		expect( Object.fromEntries(
			themeStyles.settings.border.radiusSizes.theme.map( ( preset ) => [ preset.slug, preset.size ] )
		) ).toEqual( DEFAULT_RADIUS_SIZES )
		expect(
			themeStyles.settings.shadow.presets.theme.map( ( preset ) => preset.slug )
		).toEqual( [
			'shadow-1',
			'shadow-2',
			'shadow-3',
			'shadow-4',
			'shadow-5',
			'shadow-6',
			'shadow-7',
			'shadow-8',
			'shadow-9',
		] )
		expect( themeStyles.settings.shadow.defaultPresets ).toBe( true )
		expect(
			themeStyles.settings.spacing.spacingSizes.theme.every( ( preset ) => preset.size.startsWith( 'clamp(' ) )
		).toBe( true )
		expect(
			themeStyles.settings.typography.fontSizes.theme.every(
				( preset ) => Boolean( preset.fluid?.min && preset.fluid?.max )
			)
		).toBe( true )
		expect( Object.fromEntries(
			themeStyles.settings.typography.fontSizes.theme
				.filter( ( preset ) => preset.slug in DEFAULT_FLUID_TYPE )
				.map( ( preset ) => [ preset.slug, preset.fluid ] )
		) ).toEqual( DEFAULT_FLUID_TYPE )

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
		expect( themeStyles.styles.elements.heading ).toEqual(
			expect.objectContaining( {
				color: {
					text: 'var(--wp--preset--color--outline-contrast)',
				},
			} )
		)
		expect( Object.keys( themeStyles.styles.blocks ) ).toEqual(
			expect.arrayContaining( REQUIRED_BLOCK_STYLES )
		)
		expect( colorVariations.map( ( variation ) => variation.title ).sort() ).toEqual(
			COLOR_VARIATIONS
		)

		for ( const variation of colorVariations ) {
			const palette = variation.settings?.color?.palette?.theme as PaletteColor[]
			const bodyText = getPaletteColor( palette, 'contrast-accent' )
			const headingText = getPaletteColor( palette, 'outline-contrast' )
			const base = getPaletteColor( palette, 'base' )

			expect( palette.map( ( color ) => color.slug ) ).toEqual( PALETTE_SLUGS_IN_ROLE_ORDER )
			expect( contrastRatio( bodyText, base ) ).toBeGreaterThanOrEqual( 4.5 )
			expect( contrastRatio( headingText, base ) ).toBeGreaterThanOrEqual( 4.5 )
			if ( variation.title === 'Dark' ) {
				expect( relativeLuminance( headingText ) ).toBeGreaterThan( relativeLuminance( bodyText ) )
			} else {
				expect( relativeLuminance( headingText ) ).toBeLessThan( relativeLuminance( bodyText ) )
			}
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

		await page.goto( new URL( designSystemCheckPage.link ).pathname )
		await expect( page.locator( 'h2.wp-block-heading' ) ).toHaveCSS( 'color', 'rgb(20, 0, 24)' )
		await expect( page.locator( 'h2.wp-block-heading' ) ).toHaveCSS( 'font-weight', '600' )
		await expect( page.locator( 'main p' ).first() ).toHaveCSS( 'font-weight', '500' )

		const button = page.locator( '.wp-block-button__link', { hasText: 'Primary action' } )
		await expect( button ).toBeVisible()
		expect( await button.evaluate( ( element ) => ( {
			background: getComputedStyle( element ).backgroundColor,
			borderRadius: getComputedStyle( element ).borderRadius,
			fontWeight: getComputedStyle( element ).fontWeight,
			text: getComputedStyle( element ).color,
		} ) ) ).toEqual( {
			background: 'rgb(20, 0, 24)',
			borderRadius: '9999px',
			fontWeight: '600',
			text: 'rgb(255, 255, 255)',
		} )

		const quote = page.locator( '.wp-block-quote' )
		expect( await quote.evaluate( ( element ) => ( {
			background: getComputedStyle( element ).backgroundColor,
			borderRadius: getComputedStyle( element ).borderRadius,
			text: getComputedStyle( element ).color,
		} ) ) ).toEqual( {
			background: 'rgb(231, 240, 253)',
			borderRadius: '20px',
			text: 'rgb(20, 0, 24)',
		} )
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
			contrastAccent: getComputedStyle( document.documentElement ).getPropertyValue( '--wp--preset--color--contrast-accent' ).trim(),
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
			text: 'rgb(203, 213, 225)',
			base: '#0B1120',
			contrastAccent: '#CBD5E1',
		} )
		expect( shellColors ).toEqual( {
			header: 'rgb(203, 213, 225)',
			footer: 'rgb(203, 213, 225)',
			postCard: 'rgb(199, 210, 254)',
		} )

		await page.goto( new URL( designSystemCheckPage.link ).pathname )
		await expect( page.locator( 'h2.wp-block-heading' ) ).toHaveCSS(
			'color',
			'rgb(241, 245, 249)'
		)
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
