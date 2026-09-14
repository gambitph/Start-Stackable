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

/***/ "./src/css/frontend.css"
/*!******************************!*\
  !*** ./src/css/frontend.css ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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
/**
 * Compiled theme extras. Keep this a barrel: import modules only.
 * Tokens, type, and spacing stay in theme.json.
 */


})();

/******/ })()
;
//# sourceMappingURL=frontend.js.map