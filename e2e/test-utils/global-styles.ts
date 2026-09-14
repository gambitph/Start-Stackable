import type { RequestUtils } from '@wordpress/e2e-test-utils-playwright'

export type StyleVariation = {
	title: string
	settings?: {
		color?: {
			palette?: {
				theme?: { color: string; slug: string }[]
			}
		}
	}
	styles?: Record< string, unknown >
}

export async function getStyleVariations(
	requestUtils: RequestUtils,
	themeSlug: string
) {
	return requestUtils.rest< StyleVariation[] >( {
		path: `/wp/v2/global-styles/themes/${ themeSlug }/variations`,
	} )
}

export async function applyStyleVariation(
	requestUtils: RequestUtils,
	variation: StyleVariation
) {
	const globalStylesId = await requestUtils.getCurrentThemeGlobalStylesPostId()

	if ( ! globalStylesId ) {
		throw new Error( 'The active theme does not expose a Global Styles post.' )
	}

	await requestUtils.rest( {
		method: 'POST',
		path: `/wp/v2/global-styles/${ globalStylesId }`,
		data: {
			id: globalStylesId,
			settings: variation.settings || {},
			styles: variation.styles || {},
		},
	} )
}
