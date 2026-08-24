# Start Stackable - agent implementation guide

Load this file before changing templates, `theme.json`, header behavior, onboarding, patterns, or theme e2e.
Product law here wins over `GOAL.md` history and over shipped code.
Human companion (on-ramp + same law): [`start-stackable.md`](./start-stackable.md).
Implementation plan (numbered What/How per phase): [`start-stackable.plan.md`](./start-stackable.plan.md).
Acceptance check: [`start-stackable.check.md`](./start-stackable.check.md).
Plugin Site Kits: sibling `../Stackable/docs/prd/site-kits.agents.md`.
Import package schema: sibling `../Stackable/docs/prd/site-kits.CONTRACT.md`.
ADR: [`../adr/0002-theme-is-the-default.md`](../adr/0002-theme-is-the-default.md).

## Now

Law below is the **finished** theme.
The tree is a **scaffold**.
Phase 0 is done (activates, `functions.php`, `src/` → `assets/build/`).
Phases 1-11 are not.
**Next: Phase 1** in the plan (`theme.json` design system).
Do not skip phases.
Do not treat the file map or template-as-pattern-include as the current tree.
Fix [gaps](#current-repo-gaps) on the matching phase only.

## Law

Start Stackable is a complete WordPress.org block theme **and** the **shell** for Site Kits.
**Default** is activate with Stackable off: designed blog + header + footer + tokens.
Stackable is the engine: blocks, Global Design System, Design Library, Site Kit import.
A Site Kit snaps into this shell.
The theme zip never imports content.

First activation is a complete, designed blog with header, footer, and tokens, no plugin required.
Header flags (sticky, transparent, hide) are theme-owned.
Do not bake a marketing landing into `home.html` (it fights Settings → Reading and duplicates Site Kits).

Complete when every change still satisfies all of:

1. Activate, Stackable off, latest posts: `/` shows designed header + post grid + footer. No `stackable/*`. Navigation has no `ref`.
2. Style variations (color and typography, at least one dark) restyle header, footer, and blog cards.
3. No `stackable/*` markup in `templates/`, `parts/`, or `patterns/`.
4. No demo/Site Kit import, no kit wizard, no import on activate.
5. Shell contract primitives below exist so kits can declare them without theme forks.
6. Patterns reconstruct Default (header, footer, blog atoms, template guts) plus at most one DIY Homepage starter page.

## Own here

Header, footer, canvases, `theme.json`, style variations, header flags, blog/Woo templates, shell patterns, dismissible recommend-plugin notice, Plus Jakarta Sans headings + system-stack body.

## Own in the plugin

`stackable/*` blocks, Design Library section catalog, Site Kit import, GDS, block styles beyond core, kit catalog (including a Default **label** that does not import or reset).

## Shell contract

Kits may depend only on these primitives.
If a kit needs a new header or footer behavior, add it here and extend this list in the same change.

| Primitive | Guarantee |
| --- | --- |
| `header` | Solid header part: logo/title, Navigation, optional search/CTA. Valid on a fresh install (no hardcoded `ref` IDs). |
| `header-transparent` | Same structure, no opaque background, sits over the first full-bleed section. |
| `header-minimal` | Compact header for inner/landing use. |
| Sticky flag | Header stays at the top of the viewport while scrolling. Theme-owned, works with Stackable off. |
| Transparent flag | Header overlays the page canvas. Combinable with sticky. |
| Sticky + transparent scroll state | Overlay at top of page; after scroll, solid background + readable text. Dual logo if two logos are set. |
| Hide header / hide footer | Per-page via `blank` canvas and/or a page flag the plugin can set on import. |
| `page` | Standard page: header, title allowed, footer. |
| `full-width` | Marketing canvas: header + footer, **no** theme page title, **no** extra main padding that blocks `alignfull` heroes. |
| `blank` | Post content only. No header, no footer. |
| `--stk-header-height` | CSS custom property on `:root` reflecting current header height (and a scrolled variant if the bar shrinks). |
| Tokens | Palette slugs, font sizes, spacing sizes, `contentSize` `645px`, `wideSize` `1340px` stay aligned with Stackable inheritance. Headings: Plus Jakarta Sans (bundled). Body: system UI stack. |
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
| `templates/blank.html` | No header or footer |
| `templates/single.html` | Post: terms, title, meta, featured image, content, comments, pagination |
| `templates/archive.html` | Category/tag/date (grid) |
| `templates/search.html` | Search results |
| `templates/404.html` | Not found |
| Woo templates | Shop, product, cart, checkout, account; unused until Woo is active |

When finished, templates are thin `wp:pattern` includes of template patterns.
Parts are thin includes of header/footer patterns.
Today they are still inline HTML (Phase 3+).

## Patterns

If a pattern is required to reconstruct Default, it belongs here.
If it would also be a Design Library section, it does not.

Allowed: header/footer variants, post card, post meta, comments, template guts, **one** `page-home` starter (`Block Types: core/post-content`).
Not allowed: a section catalog of heroes, pricing, testimonials, team, FAQ, logos.

## Current repo gaps (matching phase only)

Do not take a later gap first.
Each item is gone or explicitly deferred in an ADR.

- Phase 1: Plus Jakarta Sans headings (bundled) + system-stack body; fluid type; `clamp` spacing; shadows; radius; element/block styles. Palette slugs already match.
- Phase 2: typography variations; at least one dark. Color hue files exist.
- Phase 3: header/footer as pattern includes; footer copyright = site name, not a year-only stub.
- Phase 4: first-activation grid must look designed (not an unstyled Query Loop). Templates must not reference missing slugs (`spacing|50`, color `secondary`).
- Phase 5: `full-width` must drop extra main padding that blocks `alignfull`.
- Phase 6: sticky / transparent / scroll state in `src/` (height token host already exists).
- Phase 7-11: patterns empty; no Woo templates; no recommend-plugin notice; no `screenshot.png`; snap-in contract on paper only.

## Implementation sequence

Phase 0 is done; skip it.
Follow [`start-stackable.plan.md`](./start-stackable.plan.md) (numbered What/How).
Do not skip a phase's **This phase is done when**.
Then run that phase in [`start-stackable.check.md`](./start-stackable.check.md).

1. Design system (`theme.json`, Plus Jakarta Sans headings, system body, shadows, radius, fluid type/spacing, element/block styles). **Start here.**
2. Style variations.
3. Header and footer parts + patterns (no `ref`, user copyright).
4. Blog templates (index/home/archive/search/404/single).
5. Canvases (`page`, `full-width`, `blank`).
6. Header flags.
7. Shell pattern catalog + one `page-home`.
8. Woo templates.
9. `functions.php` (notice, breakpoints; supports/enqueue/body class already exist).
10. Directory packaging (`screenshot.png`, `readme.txt`, tags, licenses).
11. Snap-in (classes, overlay reception). Do not import.

## File map (destination, not the current tree)

| Path | Owns |
| --- | --- |
| `style.css` | Theme header, tags |
| `theme.json` | Tokens, custom templates, template part registration, default styles |
| `styles/colors/*.json` | Color skins |
| `styles/typography/*.json` | Type skins |
| `templates/*.html` | Canvases (pattern includes) |
| `parts/*.html` | Header and footer (pattern includes) |
| `patterns/*.php` | Shell patterns + one Homepage starter |
| `functions.php` | Supports, enqueue compiled extras, body class, notice, breakpoint filter, pattern categories if needed |
| `src/` | Source for compiled extras (header flags). Not in the zip. |
| `assets/build/` | Compiled `frontend.css` / `frontend.js` / `frontend.asset.php` |
| `assets/fonts/` | Plus Jakarta Sans (headings) |
| `assets/images/` | CC0 pattern images |
| `webpack.config.js` | `@wordpress/scripts` entry → `assets/build/` |
| `screenshot.png` | Directory first paint (must match Default) |
| `readme.txt` | Directory listing, licenses |

## E2E (create these after the surface exists)

Harness: Playwright + WordPress Playground, theme as the active theme, **plugin not installed** unless the spec name says `with-plugin`.
Assert Gutenberg recovery UI, not console `Block validation`.
Be pixel-strict on the first-load header and footer, and on header-over-hero.
How to run: [`e2e/readme.md`](../../e2e/readme.md).

Ship a spec only when that surface exists.
Do not add failing specs for an unfinished header or footer.

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
