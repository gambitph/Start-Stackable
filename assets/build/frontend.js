/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/header-flags.js"
/*!********************************!*\
  !*** ./src/js/header-flags.js ***!
  \********************************/
() {

/**
 * Header-flag runtime.
 *
 * Measures the current header, normalizes shell flags onto its wrapper, and
 * applies the scroll state used by the compiled header styles.
 */

const HEADER_HEIGHT_PROPERTY = '--stk-header-height';
const HEADER_FLAGS = ['stk-shell-header-sticky', 'stk-shell-header-transparent'];
const SCROLLED_CLASS = 'stk-shell-header-scrolled';
function getHeaderElement() {
  return document.querySelector('.wp-site-blocks > header');
}
function updateHeaderHeight(header) {
  document.documentElement.style.setProperty(HEADER_HEIGHT_PROPERTY, `${header.offsetHeight}px`);
}
function normalizeHeaderFlags(header) {
  HEADER_FLAGS.forEach(flag => {
    const hasFlag = document.body.classList.contains(flag) || header.classList.contains(flag) || Boolean(header.querySelector(`.${flag}`));
    header.classList.toggle(flag, hasFlag);
  });
}
function updateScrollState(header) {
  const hasHeaderBehavior = HEADER_FLAGS.some(flag => header.classList.contains(flag));
  header.classList.toggle(SCROLLED_CLASS, hasHeaderBehavior && window.scrollY > 0);
}
function initHeaderFlags() {
  const header = getHeaderElement();
  if (!header) {
    return;
  }
  normalizeHeaderFlags(header);
  updateHeaderHeight(header);
  updateScrollState(header);
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => updateHeaderHeight(header)).observe(header);
  }
  window.addEventListener('resize', () => updateHeaderHeight(header), {
    passive: true
  });
  window.addEventListener('scroll', () => updateScrollState(header), {
    passive: true
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeaderFlags);
} else {
  initHeaderFlags();
}

/***/ },

/***/ "./src/js/navigation-overflow.js"
/*!***************************************!*\
  !*** ./src/js/navigation-overflow.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Keep header Navigation blocks on one desktop line by moving trailing items
 * into an accessible More disclosure when their rendered widths do not fit.
 */


const HEADER_SELECTOR = '.wp-site-blocks > header';
const NAVIGATION_SELECTOR = '.wp-block-navigation';
const LIST_SELECTOR = '.wp-block-navigation__responsive-container-content > .wp-block-navigation__container';
const PAGE_LIST_SELECTOR = ':scope > .wp-block-page-list';
const MOBILE_TOGGLE_SELECTOR = '.wp-block-navigation__responsive-container-open';
const OVERFLOW_CLASS = 'stk-navigation-overflow';
const OVERFLOW_MENU_CLASS = 'stk-navigation-overflow__menu';
const FIT_TOLERANCE = 1;
const navigationStates = new Map();
let nextOverflowId = 0;
function getTopLevelList(navigation) {
  return navigation.querySelector(LIST_SELECTOR);
}
function getItemsList(list) {
  return list.querySelector(PAGE_LIST_SELECTOR) || list;
}
function isVisible(element) {
  return Boolean(element && element.getClientRects().length);
}
function isMobileOverlayActive(navigation) {
  return isVisible(navigation.querySelector(MOBILE_TOGGLE_SELECTOR));
}
function getDirectItems(list) {
  return Array.from(list.children).filter(child => child.classList.contains('wp-block-navigation-item') && !child.classList.contains(OVERFLOW_CLASS));
}
function restoreItems(list) {
  const overflow = Array.from(list.children).find(child => child.classList.contains(OVERFLOW_CLASS));
  if (!overflow) {
    return;
  }
  const menu = overflow.querySelector(`.${OVERFLOW_MENU_CLASS}`);
  if (menu) {
    Array.from(menu.children).forEach(item => {
      list.insertBefore(item, overflow);
    });
  }
  overflow.remove();
}
function getItemsWidth(list) {
  const items = Array.from(list.children);
  const gap = Number.parseFloat(getComputedStyle(list).columnGap) || 0;
  return items.reduce((width, item) => width + item.getBoundingClientRect().width, 0) + Math.max(0, items.length - 1) * gap;
}
function fitsNavigation(navigation, list) {
  return getItemsWidth(list) <= navigation.getBoundingClientRect().width + FIT_TOLERANCE;
}
function closeOverflow(overflow, shouldFocus = false) {
  const button = overflow.querySelector('.stk-navigation-overflow__toggle');
  const menu = overflow.querySelector(`.${OVERFLOW_MENU_CLASS}`);
  if (!button || !menu) {
    return;
  }
  button.setAttribute('aria-expanded', 'false');
  menu.hidden = true;
  if (shouldFocus) {
    button.focus();
  }
}
function closeOtherOverflows(currentOverflow) {
  document.querySelectorAll(`.${OVERFLOW_CLASS}`).forEach(overflow => {
    if (overflow !== currentOverflow) {
      closeOverflow(overflow);
    }
  });
}
function createOverflow() {
  const overflow = document.createElement('li');
  const button = document.createElement('button');
  const label = document.createElement('span');
  const icon = document.createElement('span');
  const menu = document.createElement('ul');
  const menuId = `stk-navigation-overflow-menu-${++nextOverflowId}`;
  overflow.className = `wp-block-navigation-item ${OVERFLOW_CLASS}`;
  button.className = 'wp-block-navigation-item__content stk-navigation-overflow__toggle';
  button.type = 'button';
  button.setAttribute('aria-controls', menuId);
  button.setAttribute('aria-expanded', 'false');
  label.textContent = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('More', 'start-stackable');
  icon.className = 'stk-navigation-overflow__icon';
  icon.setAttribute('aria-hidden', 'true');
  button.append(label, icon);
  menu.id = menuId;
  menu.className = `wp-block-navigation__submenu-container ${OVERFLOW_MENU_CLASS}`;
  menu.hidden = true;
  overflow.append(button, menu);
  button.addEventListener('click', () => {
    const shouldOpen = button.getAttribute('aria-expanded') !== 'true';
    closeOtherOverflows(overflow);
    button.setAttribute('aria-expanded', String(shouldOpen));
    menu.hidden = !shouldOpen;
  });
  return overflow;
}
function observeNavigation(navigation, state) {
  state.mutationObserver.observe(navigation, {
    childList: true,
    characterData: true,
    subtree: true
  });
}
function layoutNavigation(navigation, state) {
  state.animationFrame = 0;
  state.mutationObserver.disconnect();
  const navigationList = getTopLevelList(navigation);
  if (!navigationList) {
    observeNavigation(navigation, state);
    return;
  }
  const itemsList = getItemsList(navigationList);
  restoreItems(itemsList);
  if (isMobileOverlayActive(navigation) || fitsNavigation(navigation, itemsList)) {
    observeNavigation(navigation, state);
    return;
  }
  const overflow = createOverflow();
  const menu = overflow.querySelector(`.${OVERFLOW_MENU_CLASS}`);
  const items = getDirectItems(itemsList);
  itemsList.append(overflow);
  while (!fitsNavigation(navigation, itemsList) && items.length) {
    menu.prepend(items.pop());
  }
  if (!menu.children.length) {
    overflow.remove();
  }
  observeNavigation(navigation, state);
}
function scheduleLayout(navigation) {
  const state = navigationStates.get(navigation);
  if (!state || state.animationFrame) {
    return;
  }
  state.animationFrame = window.requestAnimationFrame(() => {
    layoutNavigation(navigation, state);
  });
}
function initNavigation(navigation) {
  if (navigationStates.has(navigation)) {
    return;
  }
  const state = {
    animationFrame: 0,
    mutationObserver: new MutationObserver(() => scheduleLayout(navigation)),
    resizeObserver: null
  };
  navigationStates.set(navigation, state);
  observeNavigation(navigation, state);
  if (typeof ResizeObserver !== 'undefined') {
    state.resizeObserver = new ResizeObserver(() => scheduleLayout(navigation));
    state.resizeObserver.observe(navigation);
    if (navigation.parentElement) {
      state.resizeObserver.observe(navigation.parentElement);
    }
  }
  scheduleLayout(navigation);
}
function initNavigationOverflow() {
  const header = document.querySelector(HEADER_SELECTOR);
  if (!header) {
    return;
  }
  header.querySelectorAll(NAVIGATION_SELECTOR).forEach(initNavigation);
  window.addEventListener('resize', () => {
    navigationStates.forEach((state, navigation) => scheduleLayout(navigation));
  }, {
    passive: true
  });
  document.addEventListener('click', event => {
    document.querySelectorAll(`.${OVERFLOW_CLASS}`).forEach(overflow => {
      if (!overflow.contains(event.target)) {
        closeOverflow(overflow);
      }
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') {
      return;
    }
    document.querySelectorAll(`.${OVERFLOW_CLASS}`).forEach(overflow => {
      const button = overflow.querySelector('.stk-navigation-overflow__toggle');
      if (button?.getAttribute('aria-expanded') === 'true') {
        closeOverflow(overflow, true);
      }
    });
  });
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      navigationStates.forEach((state, navigation) => scheduleLayout(navigation));
    });
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavigationOverflow);
} else {
  initNavigationOverflow();
}

/***/ },

/***/ "./src/css/frontend.css"
/*!******************************!*\
  !*** ./src/css/frontend.css ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			const getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter/value functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			if(Array.isArray(definition)) {
/******/ 				var i = 0;
/******/ 				while(i < definition.length) {
/******/ 					var key = definition[i++];
/******/ 					var binding = definition[i++];
/******/ 					if(!__webpack_require__.o(exports, key)) {
/******/ 						if(binding === 0) {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, value: definition[i++] });
/******/ 						} else {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, get: binding });
/******/ 						}
/******/ 					} else if(binding === 0) { i++; }
/******/ 				}
/******/ 			} else {
/******/ 				for(var key in definition) {
/******/ 					if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 						Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.hasOwn(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!*************************!*\
  !*** ./src/frontend.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _css_frontend_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./css/frontend.css */ "./src/css/frontend.css");
/* harmony import */ var _js_header_flags__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/header-flags */ "./src/js/header-flags.js");
/* harmony import */ var _js_header_flags__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_js_header_flags__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _js_navigation_overflow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./js/navigation-overflow */ "./src/js/navigation-overflow.js");
/**
 * Compiled theme extras. Keep this a barrel: import modules only.
 * Tokens, type, and spacing stay in theme.json.
 */



})();

/******/ })()
;
//# sourceMappingURL=frontend.js.map