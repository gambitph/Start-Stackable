/**
 * Header-flag runtime.
 *
 * Measures the current header, normalizes shell flags onto its wrapper, and
 * applies the scroll state used by the compiled header styles.
 */

const HEADER_HEIGHT_PROPERTY = '--stk-header-height'
const HEADER_FLAGS = [
	'stk-shell-header-sticky',
	'stk-shell-header-transparent',
]
const SCROLLED_CLASS = 'stk-shell-header-scrolled'

function getHeaderElement() {
	return document.querySelector( '.wp-site-blocks > header' )
}

function updateHeaderHeight( header ) {
	document.documentElement.style.setProperty(
		HEADER_HEIGHT_PROPERTY,
		`${ header.offsetHeight }px`
	)
}

function normalizeHeaderFlags( header ) {
	HEADER_FLAGS.forEach( ( flag ) => {
		const hasFlag =
			document.body.classList.contains( flag ) ||
			header.classList.contains( flag ) ||
			Boolean( header.querySelector( `.${ flag }` ) )

		header.classList.toggle( flag, hasFlag )
	} )
}

function updateScrollState( header ) {
	const hasHeaderBehavior = HEADER_FLAGS.some( ( flag ) => header.classList.contains( flag ) )
	header.classList.toggle( SCROLLED_CLASS, hasHeaderBehavior && window.scrollY > 0 )
}

function initHeaderFlags() {
	const header = getHeaderElement()
	if ( ! header ) {
		return
	}

	normalizeHeaderFlags( header )
	updateHeaderHeight( header )
	updateScrollState( header )

	if ( typeof ResizeObserver !== 'undefined' ) {
		new ResizeObserver( () => updateHeaderHeight( header ) ).observe( header )
	}

	window.addEventListener( 'resize', () => updateHeaderHeight( header ), { passive: true } )
	window.addEventListener( 'scroll', () => updateScrollState( header ), { passive: true } )
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initHeaderFlags )
} else {
	initHeaderFlags()
}
