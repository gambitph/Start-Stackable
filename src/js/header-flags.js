/**
 * Header-flag runtime.
 *
 * Sets --stk-header-height on :root from the current header.
 * Sticky, transparent overlay, and scroll-solid behavior belong here (Phase 6).
 * Honor .stk-shell-header-sticky and .stk-shell-header-transparent on body
 * or the header wrapper (shell contract).
 */

const HEADER_HEIGHT_PROPERTY = '--stk-header-height'

function getHeaderElement() {
	return document.querySelector( '.wp-site-blocks > header' )
}

function updateHeaderHeight() {
	const header = getHeaderElement()
	if ( ! header ) {
		return
	}

	document.documentElement.style.setProperty(
		HEADER_HEIGHT_PROPERTY,
		`${ header.offsetHeight }px`
	)
}

function initHeaderFlags() {
	updateHeaderHeight()

	const header = getHeaderElement()
	if ( header && typeof ResizeObserver !== 'undefined' ) {
		new ResizeObserver( updateHeaderHeight ).observe( header )
	}

	window.addEventListener( 'resize', updateHeaderHeight, { passive: true } )
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initHeaderFlags )
} else {
	initHeaderFlags()
}
