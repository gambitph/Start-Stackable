import type { Page } from '@playwright/test'
import type { RequestUtils } from '@wordpress/e2e-test-utils-playwright'
import { test, expect } from '../test-utils/test'
import {
	applyStyleVariation,
	getStyleVariations,
	type StyleVariation,
} from '../test-utils/global-styles'

const THEME_SLUG = process.env.THEME_SLUG || 'start-stackable'
const WOO_TEMPLATES = [
	'archive-product',
	'order-confirmation',
	'page-cart',
	'page-checkout',
	'product-search-results',
	'single-product',
]

type RestRecord = {
	id: number
}

type WooCategory = RestRecord & {
	slug: string
}

type WooOrder = RestRecord & {
	order_key: string
}

type WooProduct = RestRecord & {
	name: string
	permalink: string
}

type BlockTemplate = {
	id: string
	slug: string
	source: string
}

type PluginRecord = {
	plugin: string
	status: string
}

async function deleteWooRecord(
	requestUtils: RequestUtils,
	restBase: string,
	id: number
) {
	await requestUtils.rest( {
		method: 'DELETE',
		path: `/wc/v3/${ restBase }/${ id }`,
		params: { force: true },
	} )
}

async function createProduct(
	requestUtils: RequestUtils,
	categories: RestRecord[] = []
) {
	return requestUtils.rest< WooProduct >( {
		method: 'POST',
		path: '/wc/v3/products',
		data: {
			name: `Phase 8 Field Notes ${ Date.now() }`,
			type: 'simple',
			status: 'publish',
			regular_price: '24.00',
			description: '<p>A complete product description for the Phase 8 store.</p>',
			short_description: '<p>A practical companion for thoughtful work.</p>',
			categories,
		},
	} )
}

async function assertNoEditorRecovery( page: Page ) {
	const canvas = page.frameLocator( 'iframe[name="editor-canvas"]' )
	await expect( canvas.locator( 'main' ) ).toBeVisible( { timeout: 30_000 } )
	await expect( canvas.getByText( 'Attempt Recovery' ) ).toHaveCount( 0 )
	await expect( canvas.getByText( /has been deleted or is unavailable/i ) ).toHaveCount( 0 )
	await expect( canvas.getByText( /This block has encountered an error/i ) ).toHaveCount( 0 )
}

test.describe( 'WooCommerce templates', () => {
	test.beforeEach( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( THEME_SLUG )
		await requestUtils.resetThemeGlobalStyles()
	} )

	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.resetThemeGlobalStyles()
	} )

	test( 'registers every theme template and opens it in the Site Editor', async ( {
		page,
		admin,
		requestUtils,
	} ) => {
		test.slow()

		const plugins = await requestUtils.rest< PluginRecord[] >( {
			path: '/wp/v2/plugins',
			params: { status: 'active' },
		} )
		expect(
			plugins.some(
				( plugin ) =>
					plugin.plugin.startsWith( 'woocommerce/woocommerce' ) &&
					plugin.status === 'active'
			)
		).toBe( true )

		const templates = await requestUtils.rest< BlockTemplate[] >( {
			path: '/wp/v2/templates',
			params: { context: 'edit', per_page: 100 },
		} )
		const themeTemplates = templates.filter(
			( template ) => template.id.startsWith( `${ THEME_SLUG }//` )
		)

		expect( themeTemplates.map( ( template ) => template.slug ) ).toEqual(
			expect.arrayContaining( WOO_TEMPLATES )
		)
		expect(
			themeTemplates
				.filter( ( template ) => WOO_TEMPLATES.includes( template.slug ) )
				.every( ( template ) => template.source === 'theme' )
		).toBe( true )

		for ( const templateSlug of WOO_TEMPLATES ) {
			await admin.visitSiteEditor( {
				postType: 'wp_template',
				postId: `${ THEME_SLUG }//${ templateSlug }`,
				canvas: 'edit',
			} )
			await assertNoEditorRecovery( page )
		}
	} )

	test( 'renders the catalog, product taxonomy, search, and single product', async ( {
		page,
		requestUtils,
	} ) => {
		const category = await requestUtils.rest< WooCategory >( {
			method: 'POST',
			path: '/wc/v3/products/categories',
			data: {
				name: `Phase 8 Collection ${ Date.now() }`,
			},
		} )
		const product = await createProduct( requestUtils, [ { id: category.id } ] )

		try {
			await page.goto( '/shop/' )
			await expect( page.getByRole( 'heading', { level: 1, name: 'Shop' } ) ).toBeVisible()
			await expect( page.getByRole( 'heading', { name: product.name } ) ).toBeVisible()
			await expect( page.locator( '.wp-block-woocommerce-product-collection' ) ).toBeVisible()
			await expect( page.getByRole( 'banner' ).getByRole( 'navigation' ) ).toBeVisible()
			await expect( page.getByRole( 'contentinfo' ) ).toBeVisible()

			await page.goto( `/product-category/${ category.slug }/` )
			await expect( page.getByRole( 'heading', { name: product.name } ) ).toBeVisible()
			await expect( page.locator( '.wp-block-woocommerce-product-collection' ) ).toBeVisible()

			await page.goto( `/?s=${ encodeURIComponent( product.name ) }&post_type=product` )
			await expect( page.getByRole( 'heading', { name: product.name } ) ).toBeVisible()

			await page.goto( new URL( product.permalink ).pathname )
			await expect( page.getByRole( 'heading', { level: 1, name: product.name } ) ).toBeVisible()
			await expect( page.locator( '.wp-block-woocommerce-product-image-gallery' ) ).toBeVisible()
			await expect( page.locator( '.wp-block-woocommerce-product-price' ) ).toContainText( '24.00' )
			await expect( page.getByRole( 'button', { name: /Add to cart/i } ) ).toBeVisible()
			await expect( page.locator( '.wp-block-woocommerce-product-details' ) ).toBeVisible()
		} finally {
			await deleteWooRecord( requestUtils, 'products', product.id )
			await deleteWooRecord( requestUtils, 'products/categories', category.id )
		}
	} )

	test( 'keeps the assigned Cart and Checkout blocks usable on mobile', async ( {
		page,
		requestUtils,
	} ) => {
		const product = await createProduct( requestUtils )

		try {
			await page.setViewportSize( { width: 375, height: 900 } )
			await page.goto( new URL( product.permalink ).pathname )
			await page.getByRole( 'button', { name: /Add to cart/i } ).click()

			await page.goto( '/cart/' )
			await expect( page.locator( '.wp-block-woocommerce-cart' ) ).toBeVisible()
			await expect( page.getByText( product.name, { exact: true } ) ).toBeVisible()
			expect( await page.evaluate( () => document.documentElement.scrollWidth ) ).toBe( 375 )

			await page.goto( '/checkout/' )
			await expect( page.locator( '.wp-block-woocommerce-checkout' ) ).toBeVisible()
			await expect( page.getByRole( 'banner' ).locator( '.wp-block-site-title' ) ).toBeVisible()
			expect( await page.evaluate( () => document.documentElement.scrollWidth ) ).toBe( 375 )
		} finally {
			await deleteWooRecord( requestUtils, 'products', product.id )
		}
	} )

	test( 'renders My Account and a seeded order confirmation in Default and Dark', async ( {
		page,
		requestUtils,
	} ) => {
		const product = await createProduct( requestUtils )
		const order = await requestUtils.rest< WooOrder >( {
			method: 'POST',
			path: '/wc/v3/orders',
			data: {
				customer_id: 1,
				status: 'processing',
					billing: {
						first_name: 'Phase',
						last_name: 'Eight',
						address_1: '123 Field Notes Avenue',
						city: 'San Francisco',
						state: 'CA',
						postcode: '94105',
						country: 'US',
						email: 'phase-eight@example.com',
					},
				line_items: [ { product_id: product.id, quantity: 1 } ],
			},
		} )

		try {
			await page.goto( '/my-account/' )
			await expect( page.getByRole( 'heading', { level: 1, name: 'My account' } ) ).toBeVisible()
			await expect( page.getByRole( 'contentinfo' ) ).toBeVisible()

			const orderPath = `/checkout/order-received/${ order.id }/?key=${ order.order_key }`
			await page.goto( orderPath )
			await expect( page.locator( '.wp-block-woocommerce-order-confirmation-status' ) ).toBeVisible()
			await expect( page.locator( '.wp-block-woocommerce-order-confirmation-summary' ) ).toBeVisible()
			await expect(
				page.locator( '.wc-block-order-confirmation-address-wrapper' )
			).toBeVisible()
			await expect(
				page.locator(
					'.wc-block-order-confirmation-address-wrapper > .wp-block-column:visible'
				)
			).toHaveCount( 1 )
			await expect( page.getByText( '123 Field Notes Avenue' ) ).toBeVisible()

			const defaultColors = await page.locator( 'main' ).evaluate( ( element ) => ( {
				background: getComputedStyle( element ).backgroundColor,
				text: getComputedStyle( element ).color,
			} ) )
			const variations = await getStyleVariations( requestUtils, THEME_SLUG )
			const dark = variations.find( ( variation ) => variation.title === 'Dark' )
			expect( dark ).toBeDefined()
			await applyStyleVariation( requestUtils, dark as StyleVariation )
			await page.reload()

			const darkColors = await page.locator( 'main' ).evaluate( ( element ) => ( {
				background: getComputedStyle( element ).backgroundColor,
				text: getComputedStyle( element ).color,
			} ) )
			expect( darkColors ).not.toEqual( defaultColors )
			await expect( page.locator( '.wp-block-woocommerce-order-confirmation-status' ) ).toBeVisible()
		} finally {
			await deleteWooRecord( requestUtils, 'orders', order.id )
			await deleteWooRecord( requestUtils, 'products', product.id )
		}
	} )
} )
