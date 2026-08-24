# Start Stackable - acceptance check

Load this file to **verify** a theme implementation (full build or a named phase).
Do not use this file to implement.
New to the repo? Read [`start-stackable.md`](./start-stackable.md) first, then implement via [`start-stackable.plan.md`](./start-stackable.plan.md).
Law: [`start-stackable.agents.md`](./start-stackable.agents.md).

Work the lists that match the claimed phase.
For a finished theme, work **every** list.
Each item is pass or fail.
Fail is a concrete file, slug, class, or screenshot note, not a vibe.
Do not add e2e in this pass unless the user asked; this check is the guardrail before e2e.

## How to run

1. Read law + the phase(s) claimed complete.
2. Inspect the filesystem (tree, `theme.json`, templates, parts, patterns, `functions.php`, `readme.txt`, `style.css`).
3. Grep for forbidden strings (`stackable/`, `"ref":`, `function.php`, `front-page.html`, undefined presets).
4. If a WordPress install is available, activate with Stackable **off** and walk Default.
5. Report: phase, pass count, fail list (path + what is wrong), leftover plan items.

Stop if law and the tree disagree; law wins.

---

## Guardrails (always)

- [ ] `functions.php` exists; `function.php` does not.
- [ ] No `templates/front-page.html`.
- [ ] No `stackable/` in `templates/`, `parts/`, `patterns/`.
- [ ] No Navigation `ref` in committed HTML/PHP patterns.
- [ ] No `var:preset|spacing|50` (or `60`/`70`/`80`) and no color slugs `secondary` / `main` unless they exist in `theme.json`.
- [ ] Every template/part/pattern preset slug exists in `theme.json` or a style variation that overrides the same slug.
- [ ] Footer copyright is the user's site, not "Start Stackable Theme".
- [ ] No kit importer, no kit wizard, no remote demo fetch, no import on `after_setup_theme` / `after_switch_theme`.
- [ ] No custom blocks, shortcodes, or CPTs.
- [ ] Functions prefixed `start_stackable_`; text domain `start-stackable`.
- [ ] Zip (or `npm run build` output) excludes docs, e2e, `.cursor`, `node_modules`, `src/`, `webpack.config.js`.

---

## Phase 0 - Bootstrap

- [ ] Theme activates without a PHP fatal.
- [ ] `style.css` has `Theme Name`, `Text Domain: start-stackable`, `Requires at least`.
- [ ] `npm run start` / `npm run compile` emit `assets/build/frontend.js` and `frontend.css`.
- [ ] `functions.php` enqueues that bundle when the `.asset.php` file exists.

---

## Phase 1 - Design system

- [ ] Palette slugs match the token contract (`primary` … `outline-contrast`).
- [ ] `layout.contentSize` is `645px`; `wideSize` is `1340px`.
- [ ] Font sizes have fluid min/max (or equivalent fluid config).
- [ ] Spacing uses `clamp` or otherwise does not look like desktop scale on a 375px width.
- [ ] Shadow presets exist.
- [ ] Border radius sizes exist.
- [ ] Plus Jakarta Sans is registered via `fontFace` and files live under `assets/fonts/`.
- [ ] Headings, site title, and post title use slug `plus-jakarta-sans`.
- [ ] Body (`styles.typography.fontFamily`) uses the system UI stack (slug `sans-serif`).
- [ ] `styles.elements` covers heading, link, button (including outline).
- [ ] `styles.blocks` covers button, navigation, site-title, quote, search, query-pagination, post-title at minimum.
- [ ] `customTemplates` includes `full-width` and `blank`.
- [ ] `templateParts` includes `header`, `header-transparent`, `header-minimal`, `footer`, `footer-landing`.

---

## Phase 2 - Style variations

- [ ] `styles/colors/` files override the **same** palette slugs.
- [ ] `styles/typography/` has at least two type presets.
- [ ] At least one dark variation exists and keeps the same slugs.
- [ ] Switching a variation in Styles would change header, footer, and blog cards (no hardcoded hex in templates/parts).

---

## Phase 3 - Header and footer

- [ ] `parts/header.html` (and transparent/minimal) are pattern includes or equivalent core-only markup.
- [ ] `parts/footer.html` and `footer-landing` exist.
- [ ] Header contains Site Title or Logo and Navigation without `ref`.
- [ ] Front-end copyright is not the theme author brand.

---

## Phase 4 - Blog (first-activation WOW)

- [ ] `templates/index.html` is a designed post grid (header + cards + footer), not a bare Query Loop.
- [ ] `templates/home.html` uses the same grid (posts index when a static front is set).
- [ ] `templates/archive.html`, `search.html`, `404.html`, `single.html` exist and are designed.
- [ ] Single includes title, featured image, meta, comments form.
- [ ] Post cards share an image aspect or height.
- [ ] On a latest-posts site, `/` would show header + grid + footer without creating a page.

---

## Phase 5 - Canvases

- [ ] `page` template shows a theme post title.
- [ ] `full-width` has no Post Title block and no extra `main` padding that blocks `alignfull`.
- [ ] `blank` has no header or footer template parts.

---

## Phase 6 - Header flags

- [ ] Sticky works without a Stackable container.
- [ ] Transparent header overlays a full-bleed first section on `full-width`.
- [ ] After scroll, header background is opaque and text stays readable.
- [ ] `--stk-header-height` is set to a non-zero px value on the front.
- [ ] Contract classes `stk-shell-header-sticky` and `stk-shell-header-transparent` are the names the theme honors.
- [ ] Mobile nav overlay sits above a full-bleed first section.

---

## Phase 7 - Patterns

- [ ] Inventory in the plan exists: template patterns, part patterns, `post-card`, `post-meta`, `comments`.
- [ ] Exactly one marketing starter: `page-home` (or equivalent slug) with `core/post-content`.
- [ ] No standalone theme patterns whose job is hero, pricing, testimonial, team, FAQ, or logo grid.
- [ ] Pattern strings are i18n-escaped.

---

## Phase 8 - Woo

- [ ] Shop, product, cart, checkout templates exist and use Woo/core blocks + theme tokens.
- [ ] Theme still activates with Woo inactive.

---

## Phase 9 - PHP host

- [ ] `body` gets `stk--is-stackable-theme` when this theme is active.
- [ ] Admin notice recommends `stackable-ultimate-gutenberg-blocks` only when the plugin is inactive; dismissible; user-initiated install.
- [ ] Notice is absent when Stackable is active.
- [ ] Breakpoint filter runs only if the plugin is present.
- [ ] Switching the theme does not create kit pages.

---

## Phase 10 - Directory

- [ ] `screenshot.png` exists and depicts Default, not a Site Kit.
- [ ] `readme.txt` states the plugin is optional and starter sites are not in the zip.
- [ ] Font and image licenses are listed.
- [ ] `style.css` tags that are advertised are true (`block-patterns`, `style-variations`, `e-commerce` only if Woo templates shipped).

---

## Phase 11 - Snap-in

- [ ] Theme does not import kit JSON.
- [ ] Plugin can assign `full-width` + header flags without a theme PHP change (classes/meta documented in the contract).
- [ ] User Global Styles / variation overlay can restyle the same token slugs.

---

## Finished theme

All phase lists pass.
First-activation look is designed-blog craft, not a marketing landing in `home.html`.
Shell contract table in `start-stackable.agents.md` still matches the tree.
