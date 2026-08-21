# Start Stackable - agent implementation guide

Load this file before changing templates, `theme.json`, header behavior, onboarding, patterns, or theme e2e.
Product law here wins over `GOAL.md` history and over shipped code.
Human companion: [`start-stackable.md`](./start-stackable.md).
Implementation plan: [`start-stackable.plan.md`](./start-stackable.plan.md).
Acceptance check: [`start-stackable.check.md`](./start-stackable.check.md).
Plugin Site Kits: sibling `../Stackable/docs/prd/site-kits.agents.md`.
Import package schema: sibling `../Stackable/docs/prd/site-kits.CONTRACT.md`.
ADR: [`../adr/0002-theme-is-the-default.md`](../adr/0002-theme-is-the-default.md).

## Law

Start Stackable is a complete WordPress.org block theme **and** the **shell** for Site Kits.
**Default** is activate with Stackable off: designed blog + chrome + tokens.
Stackable is the engine: blocks, Global Design System, Design Library, Site Kit import.
A Site Kit snaps into this shell.
The theme zip never imports content.

First activation is a complete, designed blog with chrome and tokens, no plugin required.
Header flags (sticky, transparent, hide) are theme-owned.
Do not bake a marketing landing into `home.html` (it fights Settings → Reading and duplicates Site Kits).

Complete when every change still satisfies all of:

1. Activate, Stackable off, latest posts: `/` shows designed header + post grid + footer. No `stackable/*`. Navigation has no `ref`.
2. Style variations (color and typography, at least one dark) restyle chrome and blog cards.
3. No `stackable/*` markup in `templates/`, `parts/`, or `patterns/`.
4. No demo/Site Kit import, no kit wizard, no import on activate.
5. Shell contract primitives below exist so kits can declare them without theme forks.
6. Patterns reconstruct Default (chrome, blog atoms, template guts) plus at most one DIY Homepage starter page.

## Own here

Chrome, canvases, `theme.json`, style variations, header flags, blog/Woo templates, shell patterns, dismissible recommend-plugin notice, bundled webfont (picked at implementation).

## Own in the plugin

`stackable/*` blocks, Design Library section catalog, Site Kit import, GDS, block styles beyond core, kit catalog (including a Default **label** that does not import or reset).

## Shell contract

Kits may depend only on these primitives.
If a kit needs a new chrome behavior, add it here and extend this list in the same change.

| Primitive | Guarantee |
| --- | --- |
| `header` | Solid header part: logo/title, Navigation, optional search/CTA. Valid on a fresh install (no hardcoded `ref` IDs). |
| `header-transparent` | Same structure, no opaque background, sits over the first full-bleed section. |
| `header-minimal` | Compact chrome for inner/landing use. |
| Sticky flag | Header stays at the top of the viewport while scrolling. Theme-owned, works with Stackable off. |
| Transparent flag | Header overlays the page canvas. Combinable with sticky. |
| Sticky + transparent scroll state | Overlay at top of page; after scroll, solid background + readable text. Dual logo if two logos are set. |
| Hide header / hide footer | Per-page via `blank` canvas and/or a page flag the plugin can set on import. |
| `page` | Standard page: header, title allowed, footer. |
| `full-width` | Marketing canvas: header + footer, **no** theme page title, **no** extra main padding that blocks `alignfull` heroes. |
| `blank` | Post content only. No header, no footer. |
| `--stk-header-height` | CSS custom property on `:root` reflecting current header height (and a scrolled variant if the bar shrinks). |
| Tokens | Palette slugs, font sizes, spacing sizes, `contentSize` `645px`, `wideSize` `1340px` stay aligned with Stackable inheritance. |
| Style variations | Color files under `styles/colors/`, typography under `styles/typography/`, at least one dark. Same palette slugs, different values. |
| Theme styles overlay | Plugin may write user Global Styles using the same slugs. Theme files are not edited. |
| `stk--is-stackable-theme` | Body class when this theme is active. |
| Recommend Stackable | Dismissible admin notice. Does not auto-install. User action only. WordPress.org plugin slug only. Gone when the plugin is active. |

Sticky is a **flag**, not a fourth header layout.
Transparent is a **flag** (and a dedicated part when the markup differs).
Do not implement sticky by requiring a Stackable container in the header.

## Templates

Do not ship `front-page.html`.
Latest-posts front uses `index.html`.
When a static front is set, the posts page uses `home.html` (same grid as index).
Kit Home uses the page's `full-width` template.

| File | Role |
| --- | --- |
| `templates/index.html` | Latest-posts front and fallback: header + post grid + footer |
| `templates/home.html` | Posts index when a static front page is set (same grid) |
| `templates/page.html` | Default page (title OK) |
| `templates/full-width.html` | No title, full bleed (custom template) |
| `templates/blank.html` | No chrome |
| `templates/single.html` | Post: terms, title, meta, featured image, content, comments, pagination |
| `templates/archive.html` | Category/tag/date (grid) |
| `templates/search.html` | Search results |
| `templates/404.html` | Not found |
| Woo templates | Shop, product, cart, checkout, account; unused until Woo is active |

Templates are thin `wp:pattern` includes of template patterns.
Parts are thin includes of header/footer patterns.

## Patterns

If a pattern is required to reconstruct Default, it belongs here.
If it would also be a Design Library section, it does not.

Allowed: header/footer variants, post card, post meta, comments, template guts, **one** `page-home` starter (`Block Types: core/post-content`).
Not allowed: a section catalog of heroes, pricing, testimonials, team, FAQ, logos.

## Current repo gaps (fix as you touch the surface)

Completion: each item is gone or explicitly deferred in an ADR.

- `function.php` must be `functions.php`.
- Header/footer Navigation `ref` integers must not ship.
- Templates must not reference spacing slugs or colors missing from `theme.json`.
- Footer copyright must be the user's site, not the theme author brand.
- Add `search.html` and `home.html`.
- Do not add `front-page.html`.
- `full-width` must drop theme title + extra main padding.
- Implement sticky / transparent / scroll state / header-height token.
- First-activation grid must look designed (not unstyled Query Loop).
- Color **and** typography variations; at least one dark.
- Bundled webfont (choice is an implementation step in the plan, not a PRD slug).

## Implementation sequence

Follow [`start-stackable.plan.md`](./start-stackable.plan.md) for file-level steps.
Do not skip a phase's completion criterion.

1. Design system (`theme.json`, font, shadows, radius, fluid type/spacing, element/block styles).
2. Style variations.
3. Chrome parts + patterns (no `ref`, user copyright).
4. Blog templates (index/home/archive/search/404/single).
5. Canvases (`page`, `full-width`, `blank`).
6. Header flags.
7. Shell pattern catalog + one `page-home`.
8. Woo templates.
9. `functions.php` (body class, notice, breakpoints).
10. Directory packaging (`screenshot.png`, `readme.txt`, tags, licenses).
11. Snap-in (classes, overlay reception). Do not import.

After a phase or a full build, run [`start-stackable.check.md`](./start-stackable.check.md).

## File map (intended)

| Path | Owns |
| --- | --- |
| `style.css` | Theme header, tags |
| `theme.json` | Tokens, custom templates, template part registration, default styles |
| `styles/colors/*.json` | Color skins |
| `styles/typography/*.json` | Type skins |
| `templates/*.html` | Canvases (pattern includes) |
| `parts/*.html` | Header/footer chrome (pattern includes) |
| `patterns/*.php` | Shell patterns + one Homepage starter |
| `functions.php` | Supports, body class, notice, breakpoint filter, pattern categories if needed |
| `assets/fonts/` | Bundled webfont |
| `assets/css/`, `assets/js/` | Header-flag CSS/JS only if core position is not enough |
| `assets/images/` | CC0 pattern images |
| `screenshot.png` | Directory first paint (must match Default) |
| `readme.txt` | Directory listing, licenses |

## E2E (create these after the surface exists)

Harness: Playwright + WordPress Playground, theme as the active theme, **plugin not installed** unless the spec name says `with-plugin`.
Assert Gutenberg recovery UI, not console `Block validation`.
Be pixel-strict on first-load chrome and header-over-hero.
How to run: [`e2e/readme.md`](../../e2e/readme.md).

Ship a spec only when that surface exists.
Do not add failing specs for unfinished chrome.

| Spec file (intended) | Assertions |
| --- | --- |
| `e2e/tests/standalone-activate.spec.ts` | Theme activates; `/` shows header + post grid + footer; no `stackable/` in markup; Navigation has no stale `ref`. |
| `e2e/tests/tokens-and-variations.spec.ts` | Default palette slugs exist; switching a color or typography variation updates presets on the front. |
| `e2e/tests/blog.spec.ts` | Create a post with featured image; `single` shows title, image, date, comments form; `home`/`archive` shows a grid card; `search` finds it; `404` shows search. |
| `e2e/tests/canvases.spec.ts` | Page on `page` shows title; same page on `full-width` has no theme `h1` from Post Title and content can be `alignfull`; `blank` has no header/footer in the DOM. |
| `e2e/tests/header-flags.spec.ts` | Transparent header overlays a full-bleed first section; after scroll, header background is opaque; `--stk-header-height` is a non-zero px value; mobile menu opens above the hero. |
| `e2e/tests/onboarding.spec.ts` | Plugin-missing notice visible and dismissible; after dismiss it stays gone; with plugin on, notice is absent. |
| `e2e/tests/with-plugin-snap-in.spec.ts` | With Stackable active: `body` has `stk--is-stackable-theme`; a fixture kit import (plugin e2e) assigns `full-width` and transparent header without missing blocks. |

Cross-repo import flows are owned by Stackable `e2e/tests/site-kits.spec.ts`.
This theme's `with-plugin` spec only proves the shell received the assignment.

## Completion for a theme PR

- Shell contract table still accurate.
- No new kit content in the theme.
- [`start-stackable.check.md`](./start-stackable.check.md) items for the changed surface pass.
- Standalone e2e listed above that match the changed surface are green (if that spec exists).
- `CONTEXT.md` updated if you added a term.
