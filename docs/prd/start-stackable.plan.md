# Start Stackable - implementation plan

This is the **playbook** a human developer follows to implement the entire theme.
Product law: [`start-stackable.md`](./start-stackable.md) and [`start-stackable.agents.md`](./start-stackable.agents.md).
When a phase is done, run [`start-stackable.check.md`](./start-stackable.check.md) for that phase (or the full check at the end).
Do not skip a phase.
Do not start e2e until the matching surface exists (agents.md e2e table).

WordPress target: `Requires at least` in `style.css` (currently 6.7).
`theme.json` version 3.
Text domain: `start-stackable`.
Function prefix: `start_stackable_`.
No `stackable/*` blocks in this repo.

---

## Ideal theme tree

When you are done, the **shipped zip** (what `npm run build` copies) looks like this:

```text
start-stackable/
  style.css
  theme.json
  functions.php
  screenshot.png
  readme.txt
  assets/
    fonts/          # bundled webfont (woff2 + license note in readme)
    css/            # header-flag CSS only if theme.json cannot express it
    js/             # header-flag JS only if needed
    images/         # CC0 images used by patterns
  templates/
    index.html
    home.html
    page.html
    full-width.html
    blank.html
    single.html
    archive.html
    search.html
    404.html
    archive-product.html      # Woo; unused until Woo is active
    single-product.html
    page-cart.html
    page-checkout.html
    # plus Woo account / order confirmation if the current Woo block theme handbook lists them
  parts/
    header.html
    header-transparent.html
    header-minimal.html
    footer.html
    footer-landing.html
  patterns/
    # see Pattern inventory below
  styles/
    colors/*.json
    typography/*.json
    # optional named looks (color+type together) only if they still override the same slugs
```

Do not ship `front-page.html`.
Do not ship `function.php`.
Repo-only files (docs, e2e, `.cursor`, `package.json`) stay out of the zip (`scripts/package.js`).

---

## Pattern inventory

Templates and parts are **one-line pattern includes**.
That keeps strings translatable and layouts in one place.

Name slugs `start-stackable/<name>`.
Every user-visible string uses `esc_html__` / `esc_html_e` with text domain `start-stackable`.
Every preset is a `theme.json` slug, not a raw hex or `spacing|50`.

### Template patterns (`Inserter: false`)

| Slug | Template Types | Contents |
| --- | --- | --- |
| `template-index-grid` | `index`, `home` | header part + query grid of post cards + pagination + footer |
| `template-archive` | `archive` | header + archive title + same grid (or shared inner pattern) + footer |
| `template-search` | `search` | header + search title/field + results + footer |
| `template-404` | `404` | header + designed not-found + search + footer |
| `template-single` | `single` | header + terms, H1 title, meta, featured image, content, comments, post nav + footer |
| `template-page` | `page` | header + title + featured image + content + footer |
| `template-full-width` | (used by custom template) | header + `post-content` alignfull, no Post Title, no extra `main` padding + footer |
| `template-blank` | (custom) | `post-content` only |

### Part patterns (`Block Types: core/template-part/header` or `footer`, Inserter true)

| Slug | Part |
| --- | --- |
| `header` | Solid bar: Site Title or Logo, Navigation **without `ref`**, optional search or button |
| `header-transparent` | Same structure, no opaque background |
| `header-minimal` | Compact |
| `footer` | Columns: site identity, socials, two nav columns, copyright = site name not "Start Stackable Theme" |
| `footer-landing` | Compact |

### Atoms (Inserter true)

| Slug | Role |
| --- | --- |
| `post-card` | Featured image (fixed aspect), title link, excerpt, category, date |
| `post-meta` | Author · date · categories |
| `comments` | Heading, comment list, form; designed, not leftover core |

### Starter page (exactly one marketing composition)

| Slug | Role |
| --- | --- |
| `page-home` | `Block Types: core/post-content`. One full homepage built from **core** Group/Cover/Columns/Heading/Buttons/Query. Not a section catalog. |

Do not add standalone hero, pricing, testimonial, team, FAQ, or logo-grid patterns.

### Woo patterns (`Inserter: false` unless a card is reusable)

Shop archive, single product, cart, checkout, account: core/Woo blocks, same tokens, not unstyled.

---

## Technical bar (every phase)

- Core blocks only in templates, parts, patterns.
- No hardcoded Navigation `ref`.
- No undefined presets.
- `useRootPaddingAwareAlignments`: true.
- Navigation overlay `z-index` above a full-bleed first section.
- i18n + escaping on every pattern string.
- Font and image licenses listed in `readme.txt`.
- Theme Review: no remote fetch, no plugin requirement, no demo importer, `functions.php` (not `function.php`).

---

## Phase 0 - Bootstrap

**Goal:** the theme loads as a block theme with a legal PHP entry file.

1. Rename `function.php` → `functions.php`.
2. Keep `style.css` headers valid (`Theme Name`, `Text Domain: start-stackable`, tags).
3. Confirm `npm run build` still zips only theme files.

**Done when:** WordPress activates the theme from the folder without a missing-`functions.php` fatal.
Site Editor opens.

---

## Phase 1 - Design system (`theme.json`)

**Goal:** Default looks like a product before any template craft.

### Font (pick now, not in the PRD)

Bundle **one** variable (or small family) OFL/SIL webfont as body + headings for v1.
Optional second family for headings or a serif pairing if contrast is worth the zip size.

Candidates designers are using now (all commonly OFL; confirm the license file you commit):

| Face | Why |
| --- | --- |
| **Geist** | Current product UI sans; variable, clean at many sizes. |
| **Plus Jakarta Sans** | Geometric, widely used for SaaS/marketing. |
| **Manrope** | Readable, neutral, works as a default body+heading face. |
| **Outfit** | Geometric, friendly, good for headings+body. |
| **Instrument Sans** | Editorial-product hybrid; pair with Instrument Serif if you want a two-family system. |
| **Mona Sans** | Distinctive variable sans (including width). Use if you want more character than a typical UI face. |

Do not use the system UI stack as Default.
Put `woff2` under `assets/fonts/` and register `fontFace` in `theme.json`.
Cite the license in `readme.txt`.

### `theme.json` work

1. Keep palette **slugs** exactly as the token contract (values may be refined for Default).
2. Add fluid `min`/`max` on font sizes.
3. Prefer `clamp()` spacing sizes so mobile is not a shrunk desktop scale.
4. Add `settings.shadow.presets` (small/medium/large, light and dark if needed).
5. Add `settings.border.radiusSizes` (sm → full).
6. Optional: a short duotone and gradient set that uses palette colors, `defaultPalette`/`defaultGradients`/`defaultDuotone` off if you replace them.
7. `styles.elements`: heading weights/line-heights, link, button (fill + outline), caption.
8. `styles.blocks` for at least: `core/button`, `core/navigation`, `core/site-title`, `core/quote`, `core/pullquote`, `core/separator`, `core/search`, `core/query-pagination`, `core/post-title`, `core/post-terms`, `core/post-comments-form` / comment blocks.
9. Register custom templates `full-width` and `blank` and all template parts in `theme.json`.
10. Square buttons are allowed only if they are a deliberate Default look; otherwise use a radius preset.

**Done when:** Site Editor Styles looks like a finished design system: type, colors, shadows, radius, buttons, quotes, nav all look intentional on a core paragraph + heading + button page with no custom CSS file yet.

---

## Phase 2 - Style variations

**Goal:** Browse styles is a product, not only a hue swap.

1. `styles/colors/*.json`: keep existing color files if slugs match; refine values so each skin is accessible (contrast on `base`/`contrast` and buttons).
2. `styles/typography/*.json`: at least two type presets (for example default vs display) that change `fontFamilies` / heading scale, still using the bundled font files.
3. At least one **dark** variation (color file or combined file) that keeps the same slugs.
4. Optional named looks (Agency-style) only if they compose the same slugs.

**Done when:** switching each variation in Site Editor updates header, footer, buttons, and blog cards with no leftover hardcoded hex.

---

## Phase 3 - Chrome

**Goal:** header and footer are designed and fresh-install safe.

1. Write part patterns first, then `parts/*.html` as `<!-- wp:pattern {"slug":"start-stackable/header"} /-->` (and the other slugs).
2. Navigation: **no** `ref` attribute. Let core create a menu on the site.
3. Footer copyright: site title or "© {year} {site name}", not "Start Stackable Theme".
4. Register `header-transparent` and `header-minimal` in `theme.json` `templateParts`.
5. Social links: placeholder `#` URLs only.
6. Optional header CTA button using core Buttons.

**Done when:** activate on a blank site, assign a menu in the Site Editor, front end shows logo/title + nav + footer with no missing-block warnings and no author brand in the copyright.

---

## Phase 4 - First-activation blog

**Goal:** `/` is WOW with Hello World.

1. `template-index-grid` + `post-card` + pagination.
2. `templates/index.html` and `templates/home.html` include that pattern (or share it via `Template Types: index, home`).
3. `template-archive` for category/tag/date.
4. `template-search` and `template-404`.
5. `template-single`: category, H1, `post-meta`, featured image, content, `comments`, previous/next or a related Query Loop.
6. Image aspect on cards is consistent (fixed height or aspect-ratio).
7. Empty states still look designed (no posts, no search hits).

**Done when:** a site with two posts + featured images shows a designed grid on `/`, a crafted single, working search and 404.
No overlapping chrome.
Pixel-strict: cards, type, spacing match the Default design system.

---

## Phase 5 - Canvases

**Goal:** kit pages have a place to land; ordinary pages still have titles.

1. `page.html` / `template-page`: title allowed, constrained content.
2. `full-width.html`: **no** Post Title, **no** extra padding on `main` that blocks `alignfull`.
3. `blank.html`: no header, no footer.
4. Register both custom templates in `theme.json` `customTemplates`.

**Done when:** a page on `page` shows an H1 from Post Title.
The same page on `full-width` has no theme title and a full-bleed Group reaches the viewport edges.
`blank` has no header/footer in the DOM.

---

## Phase 6 - Header flags

**Goal:** Sticky, transparent, and hide-header behavior, theme-owned, plugin off.

1. Small CSS/JS in `assets/` scoped to the header wrapper.
2. Body or wrapper classes the contract names: `stk-shell-header-sticky`, `stk-shell-header-transparent`.
3. Sticky + transparent: overlay at top; after scroll, opaque background and readable text.
4. `--stk-header-height` on `:root` (and scrolled variant if the bar shrinks).
5. Dual logo toggle on scrolled class when two logos exist.
6. Mobile Navigation overlay above a full-bleed first section (`z-index`).
7. Works on `full-width` without a Stackable container.

**Done when:** a `full-width` page with a tall `alignfull` first Group shows nav over the hero; after scroll the bar is opaque; `--stk-header-height` is a non-zero px value; mobile menu is usable over the hero.
All with Stackable off.

---

## Phase 7 - Pattern catalog + Homepage starter

**Goal:** Site Editor can reconstruct Default and optionally start a marketing page.

1. Finish any missing atoms from the inventory.
2. Add **one** `page-home` starter pattern (core blocks only).
3. Register pattern categories in `functions.php` only if core categories are not enough (`header`, `footer`, `posts` are enough for most).
4. `page-home` appears when creating a new page (post-content starter).

**Done when:** inserter shows header/footer/post-card/comments/`page-home`.
Inserter does **not** show a hero/pricing/testimonial section set.
`page-home` inserted on a `full-width` page looks coherent with Default tokens.

---

## Phase 8 - Woo templates

**Goal:** directory-complete if Woo is installed; harmless if not.

1. Add Woo HTML templates + patterns using Woo/core blocks.
2. Same tokens, radius, type.
3. Cart/checkout readable on mobile.
4. Do not require Woo in `style.css` beyond the `e-commerce` tag once these files exist.

**Done when:** with Woo active, shop and product are not unstyled core.
With Woo inactive, the theme still activates and Theme Check does not fail on missing Woo.

---

## Phase 9 - PHP host

**Goal:** identity, recommend plugin, optional breakpoint handshake.

In `functions.php`:

1. Theme supports (editor styles, wp-block-styles, responsive embeds as needed).
2. Enqueue header-flag CSS/JS only on the front (and editor if the flag must preview).
3. `body_class` → `stk--is-stackable-theme`.
4. Dismissible admin notice if Stackable is inactive.
   Recommend `stackable-ultimate-gutenberg-blocks` from WordPress.org.
   Install only on user action.
   Notice gone when the plugin is active.
5. If plugin active: `stackable_responsive_breakpoints` filter with this theme's tablet/mobile widths.
6. No kit catalog, no importer, no remote pattern fetch.

**Done when:** plugin off → notice dismissible and site works.
Plugin on → body class present, notice gone.
Activate never creates pages or menus beyond what core Navigation does.

---

## Phase 10 - Directory packaging

**Goal:** WP.org listing is a complete product.

1. `screenshot.png` (1200×900) of **Default** (`/` with sample posts), not a kit.
2. `readme.txt`: Description sells the designed blog + FSE; FAQ (plugin optional, no bundled starter sites); licenses (GPL, font, images); changelog via existing process.
3. `style.css` tags that are true, including `full-site-editing`, `block-patterns`, `style-variations`, `blog`, and `e-commerce` if Phase 8 shipped.
4. `Theme URI` / demo URL if a live Default demo exists (do not screenshot a kit).
5. Run Theme Check / Plugin Check equivalents the project uses; fix real issues.

**Done when:** a reviewer with Stackable deleted can walk Default and the listing matches the zip.

---

## Phase 11 - Snap-in (theme side only)

**Goal:** a kit import can assign canvases and flags without editing theme PHP.

1. Document and implement the class/meta the plugin writes (already named in the contract).
2. Receive a style variation slug **or** a user Global Styles overlay using the same token slugs.
3. Do not import pages, menus, or kits.

**Done when:** with Stackable mounted, a fixture import (plugin e2e / manual) can set `full-width` + transparent + sticky and the home hero sits under the header.
This repo still contains zero kit HTML.

---

## After the last phase

1. Run the full [`start-stackable.check.md`](./start-stackable.check.md).
2. Add e2e specs from the agents.md table for surfaces that now exist.
3. `npm run build` and smoke-install the zip on a clean WordPress.

The theme is **done** when the full acceptance check passes and Theme Review constraints in `.cursor/rules/wordpress-theme-review.mdc` still hold.
