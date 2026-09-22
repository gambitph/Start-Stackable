/**
 * Keep header Navigation blocks on one desktop line by moving trailing items
 * into an accessible More disclosure when their rendered widths do not fit.
 */

import { __ } from '@wordpress/i18n'

const HEADER_SELECTOR = '.wp-site-blocks > header'
const NAVIGATION_SELECTOR = '.wp-block-navigation'
const LIST_SELECTOR = '.wp-block-navigation__responsive-container-content > .wp-block-navigation__container'
const PAGE_LIST_SELECTOR = ':scope > .wp-block-page-list'
const MOBILE_TOGGLE_SELECTOR = '.wp-block-navigation__responsive-container-open'
const OVERFLOW_CLASS = 'stk-navigation-overflow'
const OVERFLOW_MENU_CLASS = 'stk-navigation-overflow__menu'
const FIT_TOLERANCE = 1

const navigationStates = new Map()
let nextOverflowId = 0

function getTopLevelList( navigation ) {
	return navigation.querySelector( LIST_SELECTOR )
}

function getItemsList( list ) {
	return list.querySelector( PAGE_LIST_SELECTOR ) || list
}

function isVisible( element ) {
	return Boolean( element && element.getClientRects().length )
}

function isMobileOverlayActive( navigation ) {
	return isVisible( navigation.querySelector( MOBILE_TOGGLE_SELECTOR ) )
}

function getDirectItems( list ) {
	return Array.from( list.children ).filter( ( child ) =>
		child.classList.contains( 'wp-block-navigation-item' ) &&
		! child.classList.contains( OVERFLOW_CLASS )
	)
}

function restoreItems( list ) {
	const overflow = Array.from( list.children ).find( ( child ) =>
		child.classList.contains( OVERFLOW_CLASS )
	)
	if ( ! overflow ) {
		return
	}

	const menu = overflow.querySelector( `.${ OVERFLOW_MENU_CLASS }` )
	if ( menu ) {
		Array.from( menu.children ).forEach( ( item ) => {
			list.insertBefore( item, overflow )
		} )
	}
	overflow.remove()
}

function getItemsWidth( list ) {
	const items = Array.from( list.children )
	const gap = Number.parseFloat( getComputedStyle( list ).columnGap ) || 0
	return items.reduce( ( width, item ) => width + item.getBoundingClientRect().width, 0 ) +
		Math.max( 0, items.length - 1 ) * gap
}

function fitsNavigation( navigation, list ) {
	return getItemsWidth( list ) <= navigation.getBoundingClientRect().width + FIT_TOLERANCE
}

function closeOverflow( overflow, shouldFocus = false ) {
	const button = overflow.querySelector( '.stk-navigation-overflow__toggle' )
	const menu = overflow.querySelector( `.${ OVERFLOW_MENU_CLASS }` )
	if ( ! button || ! menu ) {
		return
	}

	button.setAttribute( 'aria-expanded', 'false' )
	menu.hidden = true
	if ( shouldFocus ) {
		button.focus()
	}
}

function closeOtherOverflows( currentOverflow ) {
	document.querySelectorAll( `.${ OVERFLOW_CLASS }` ).forEach( ( overflow ) => {
		if ( overflow !== currentOverflow ) {
			closeOverflow( overflow )
		}
	} )
}

function createOverflow() {
	const overflow = document.createElement( 'li' )
	const button = document.createElement( 'button' )
	const label = document.createElement( 'span' )
	const icon = document.createElement( 'span' )
	const menu = document.createElement( 'ul' )
	const menuId = `stk-navigation-overflow-menu-${ ++nextOverflowId }`

	overflow.className = `wp-block-navigation-item ${ OVERFLOW_CLASS }`
	button.className = 'wp-block-navigation-item__content stk-navigation-overflow__toggle'
	button.type = 'button'
	button.setAttribute( 'aria-controls', menuId )
	button.setAttribute( 'aria-expanded', 'false' )
	label.textContent = __( 'More', 'start-stackable' )
	icon.className = 'stk-navigation-overflow__icon'
	icon.setAttribute( 'aria-hidden', 'true' )
	button.append( label, icon )

	menu.id = menuId
	menu.className = `wp-block-navigation__submenu-container ${ OVERFLOW_MENU_CLASS }`
	menu.hidden = true
	overflow.append( button, menu )

	button.addEventListener( 'click', () => {
		const shouldOpen = button.getAttribute( 'aria-expanded' ) !== 'true'
		closeOtherOverflows( overflow )
		button.setAttribute( 'aria-expanded', String( shouldOpen ) )
		menu.hidden = ! shouldOpen
	} )

	return overflow
}

function observeNavigation( navigation, state ) {
	state.mutationObserver.observe( navigation, {
		childList: true,
		characterData: true,
		subtree: true,
	} )
}

function layoutNavigation( navigation, state ) {
	state.animationFrame = 0
	state.mutationObserver.disconnect()

	const navigationList = getTopLevelList( navigation )
	if ( ! navigationList ) {
		observeNavigation( navigation, state )
		return
	}
	const itemsList = getItemsList( navigationList )

	restoreItems( itemsList )
	if ( isMobileOverlayActive( navigation ) || fitsNavigation( navigation, itemsList ) ) {
		observeNavigation( navigation, state )
		return
	}

	const overflow = createOverflow()
	const menu = overflow.querySelector( `.${ OVERFLOW_MENU_CLASS }` )
	const items = getDirectItems( itemsList )
	itemsList.append( overflow )

	while ( ! fitsNavigation( navigation, itemsList ) && items.length ) {
		menu.prepend( items.pop() )
	}

	if ( ! menu.children.length ) {
		overflow.remove()
	}

	observeNavigation( navigation, state )
}

function scheduleLayout( navigation ) {
	const state = navigationStates.get( navigation )
	if ( ! state || state.animationFrame ) {
		return
	}

	state.animationFrame = window.requestAnimationFrame( () => {
		layoutNavigation( navigation, state )
	} )
}

function initNavigation( navigation ) {
	if ( navigationStates.has( navigation ) ) {
		return
	}

	const state = {
		animationFrame: 0,
		mutationObserver: new MutationObserver( () => scheduleLayout( navigation ) ),
		resizeObserver: null,
	}
	navigationStates.set( navigation, state )
	observeNavigation( navigation, state )

	if ( typeof ResizeObserver !== 'undefined' ) {
		state.resizeObserver = new ResizeObserver( () => scheduleLayout( navigation ) )
		state.resizeObserver.observe( navigation )
		if ( navigation.parentElement ) {
			state.resizeObserver.observe( navigation.parentElement )
		}
	}

	scheduleLayout( navigation )
}

function initNavigationOverflow() {
	const header = document.querySelector( HEADER_SELECTOR )
	if ( ! header ) {
		return
	}

	header.querySelectorAll( NAVIGATION_SELECTOR ).forEach( initNavigation )
	window.addEventListener( 'resize', () => {
		navigationStates.forEach( ( state, navigation ) => scheduleLayout( navigation ) )
	}, { passive: true } )

	document.addEventListener( 'click', ( event ) => {
		document.querySelectorAll( `.${ OVERFLOW_CLASS }` ).forEach( ( overflow ) => {
			if ( ! overflow.contains( event.target ) ) {
				closeOverflow( overflow )
			}
		} )
	} )
	document.addEventListener( 'keydown', ( event ) => {
		if ( event.key !== 'Escape' ) {
			return
		}

		document.querySelectorAll( `.${ OVERFLOW_CLASS }` ).forEach( ( overflow ) => {
			const button = overflow.querySelector( '.stk-navigation-overflow__toggle' )
			if ( button?.getAttribute( 'aria-expanded' ) === 'true' ) {
				closeOverflow( overflow, true )
			}
		} )
	} )

	if ( document.fonts?.ready ) {
		document.fonts.ready.then( () => {
			navigationStates.forEach( ( state, navigation ) => scheduleLayout( navigation ) )
		} )
	}
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initNavigationOverflow )
} else {
	initNavigationOverflow()
}
