# Start Stackable - implementation plan

This is the step-by-step playbook for building the theme.
Read [`start-stackable.md`](./start-stackable.md) first if you do not yet know what Default, tokens, or phases are.

Work **one phase at a time**, in order.
When a phase is done, tick that phase in [`start-stackable.check.md`](./start-stackable.check.md).
Do not start the next phase until the current one is checked off.

---

## How to use this file

1. Confirm you are on the phase marked **do this next** (right now: Phase 1).
2. Read that phase's "is for" sentence so you know the job.
3. Do the numbered items in order.
   Each item has **What** (the outcome) and **How** (the files and edits).
4. Use **This phase is done when** as your own smoke test in WordPress.
5. Then run the matching list in the [acceptance check](./start-stackable.check.md).

Skip Phase 0.
It is already finished.

Product rules (what you must not add): [`start-stackable.md`](./start-stackable.md).
Word meanings: [`CONTEXT.md`](../../CONTEXT.md).

Constants for every file you add:

- WordPress: `Requires at least` in `style.css` (currently 6.7)
- `theme.json` version: `3`
- Text domain: `start-stackable`
- PHP function prefix: `start_stackable_`
- No `stackable/*` blocks in this repo
- PHP bootstrap filename: `functions.php` (never `function.php`)

---

## You are here

| Phase | Status |
| --- | --- |
| 0 Bootstrap | **Done.** Skip it. |
| 1 Design system | **Do this next.** |
| 2-11 | Later. Do not start these yet. |

The file tree in the [appendix](#appendix-a-finished-zip) is the **destination**.
It is not what the repo looks like today.

---

## How to preview your work

You need a local WordPress where this folder is the active theme.

1. Point `wp-content/themes/start-stackable` at this repo (symlink or copy).
2. In wp-admin: Appearance → Themes → Activate **Start Stackable**.
3. Open Appearance → Editor (Site Editor) to judge styles, headers, and templates.
4. Open the front of the site (`/`) to judge first activation.

What to run while you edit:

| You are editing | Command |
| --- | --- |
| `theme.json`, `templates/`, `parts/`, `patterns/`, `styles/` | Nothing to compile. Refresh the Site Editor or front. |
| `src/css/` or `src/js/` | `npm run start` (watches and writes `assets/build/`) |
| Need an installable zip | `npm run build` |

If a `theme.json` change seems ignored, the site may have user Global Styles stored in the database.
Test on a fresh site, or in Site Editor → Styles reset to defaults.

Do not put colors, font sizes, or spacing into CSS.
Those belong in `theme.json`.

---

## Rules for every phase

1. Use **core blocks only** in templates, parts, and patterns (no `stackable/*`).
2. Navigation blocks must **not** have a `"ref":` attribute.
   Let WordPress create the menu on the site.
3. Every color, font-size, and spacing value in HTML must be a slug that exists in `theme.json`.
   `spacing|50` and color `secondary` are bugs unless those slugs exist (they do not).
4. Keep `settings.useRootPaddingAwareAlignments` as `true`.
5. Every user-visible string in a PHP pattern uses `esc_html__` / `esc_html_e` with text domain `start-stackable`.
6. No remote file fetch, no demo importer, no plugin requirement.

---

## Phase 0 is for getting the theme to load

**Status:** done. Do not redo this.

This phase already gave us a legal block theme: `functions.php`, compile tooling, empty folders for later work, and stub templates/parts.

Already true (do not recreate from scratch):

1. `functions.php` exists and enqueues `assets/build/frontend.*` when that file is present.
2. It adds body class `stk--is-stackable-theme`.
3. `npm run start` compiles `src/` → `assets/build/`.
4. `templates/` and `parts/` files exist (they are still skeleton markup).
5. `patterns/`, `assets/fonts/`, `assets/images/`, and `styles/typography/` are empty on purpose.
6. Navigation has no hardcoded `ref`.

**This phase is done when:** the theme activates with no PHP fatal, Site Editor opens, and `npm run start` emits `assets/build/frontend.js` and `frontend.css`.
That is already true.

---

## Phase 1 is for making the design system look like a product

**Status:** **do this next.**

**What you are making:** colors, type, spacing, shadows, radius, and default styles for headings/buttons/quotes so a boring core-block page already looks intentional.
Default type is Plus Jakarta Sans for headings and the system UI stack for body.
You are **not** redesigning the header, post cards, or patterns yet.
Those come in later phases and will inherit this work.

**Files you will edit:**

- `theme.json` (main work)
- `assets/fonts/` (add `.woff2` files)
- `readme.txt` (font license)

### Implement the following

1. **Bundle Plus Jakarta Sans for headings**

   What: Default headings use a bundled OFL webfont.
   Body copy uses the system UI stack (already registered as slug `sans-serif`).
   That pairing is intentional: headings carry the product voice, body stays native and small in the zip.

   How:
   - Download **Plus Jakarta Sans** (variable `.woff2` if available, otherwise the weights you need).
   - Confirm the license file is OFL or SIL.
   - Put the `.woff2` file(s) in `assets/fonts/`.
   - Put the license text in `readme.txt` under Copyright (font name, license, URL).
   - Do **not** replace body with this face.
   - Do **not** pick a different heading font unless the PRD changes.

   Check: `assets/fonts/` is no longer only `.gitkeep`.

2. **Register two families and assign heading vs body**

   What: WordPress loads Jakarta for headings (including site title and post title).
   Paragraphs, excerpts, nav, captions, and buttons keep the system stack.

   How: **keep** the existing `sans-serif` family in `settings.typography.fontFamilies` for body.
   Add a second family with `fontFace` pointing at the file you added.
   Keep `styles.typography.fontFamily` as `var:preset|font-family|sans-serif`.

   Shape (path must match the file you added):

   ```json
   {
     "name": "Plus Jakarta Sans",
     "slug": "plus-jakarta-sans",
     "fontFamily": "\"Plus Jakarta Sans\", sans-serif",
     "fontFace": [
       {
         "fontFamily": "Plus Jakarta Sans",
         "fontWeight": "200 800",
         "fontStyle": "normal",
         "src": ["file:./assets/fonts/plus-jakarta-sans.woff2"]
       }
     ]
   }
   ```

   Then set `styles.elements.heading.typography.fontFamily` to `var:preset|font-family|plus-jakarta-sans`.
   Set the same family on `styles.blocks.core/site-title` and `styles.blocks.core/post-title` so those match headings.

   Check: Site Editor → a Heading uses Plus Jakarta Sans.
   A Paragraph still uses the system stack.

3. **Keep palette slugs; you may refine hex values**

   What: Stackable already inherits these slug names.
   Renaming a slug breaks the contract.

   How: in `settings.color.palette`, **do not** rename or delete:
   `primary`, `primary-light`, `primary-soft`, `primary-deep`, `base`, `base-accent`, `tint`, `contrast`, `contrast-accent`, `outline`, `outline-contrast`.
   You may change the `"color"` hex so Default looks better.
   Keep `layout.contentSize` at `645px` and `layout.wideSize` at `1340px`.

   Check: grep `theme.json` for those eleven slugs; they still exist.

4. **Make font sizes fluid**

   What: type should scale between a min (phone) and max (desktop), not a single rem.

   How: each object in `settings.typography.fontSizes` already has `name`, `slug`, and `size`.
   Add a `fluid` object with `min` and `max`.
   Keep the existing slugs (`x-small` through `xxx-large`).

   Shape:

   ```json
   {
     "name": "M",
     "slug": "medium",
     "size": "1.125rem",
     "fluid": {
       "min": "1rem",
       "max": "1.125rem"
     }
   }
   ```

   Repeat for every size.
   `settings.typography.fluid` is already `true`; leave it.

   Check: resize the front end from ~375px to desktop; body and headings change size smoothly.

5. **Make spacing fluid with `clamp()`**

   What: mobile must not look like a shrunk desktop (huge padding, huge gaps).

   How: in `settings.spacing.spacingSizes`, change each `"size"` from a single rem (for example `"0.5rem"`) to a `clamp()`.
   Keep the existing slugs (`small` through `xxxx-large`).

   Shape:

   ```json
   {
     "name": "S",
     "slug": "small",
     "size": "clamp(0.5rem, 0.4rem + 0.3vw, 0.5rem)"
   }
   ```

   Tune the middle values so the scale still feels even.
   Do not invent new slugs such as `50` or `60`.

   Check: a page with padding presets does not look oversized on a 375px-wide window.

6. **Add shadow presets**

   What: the editor can pick Small / Medium / Large shadows instead of raw CSS.

   How: add `settings.shadow.presets` (create the `shadow` object if missing).

   Shape:

   ```json
   {
     "name": "Small",
     "slug": "small",
     "shadow": "0 1px 2px rgb(0 0 0 / 0.06)"
   }
   ```

   Add at least small, medium, and large.
   Use a darker shadow only if you also ship a dark variation later.

   Check: Site Editor → a Group block → Border & Shadow shows your presets.

7. **Add border radius sizes**

   What: buttons and cards use named radii, not a one-off `5px` in templates.

   How: add `settings.border.radiusSizes`.

   Shape:

   ```json
   {
     "name": "Small",
     "slug": "small",
     "size": "4px"
   }
   ```

   Add a range from small through large, plus a full/pill size if you want round buttons.
   Square buttons (`0`) are allowed only if that is a deliberate Default look.
   Otherwise point `styles.blocks.core/button` border radius at a preset, not `"0"` unless you mean it.

   Check: a Button in the editor offers your radius presets.

8. **Style elements (headings, links, buttons, captions)**

   What: default HTML elements look designed without the user picking anything.

   How: extend `styles.elements` in `theme.json`.
   Headings already have font sizes.
   Heading `fontFamily` should already be Plus Jakarta Sans from step 2.
   Add `fontWeight` and `lineHeight` on `h1`-`h6`.
   Add `button` (fill) and make sure outline buttons stay readable (the outline variation already lives under `styles.blocks.core/button.variations.outline`).
   Style `link` (and hover if you set it) and `caption`.

   Check: a page with Heading, Paragraph, Button (fill + outline), and a caption looks consistent in the editor with no extra CSS file.

9. **Style core blocks you will actually use**

   What: navigation, quotes, search, pagination, and post title match Default, not leftover core greys.

   How: add entries under `styles.blocks` for at least:
   `core/button` (already started), `core/navigation`, `core/site-title`, `core/quote`, `core/pullquote`, `core/separator`, `core/search`, `core/query-pagination`, `core/post-title`, `core/post-terms`, `core/post-comments-form` (and comment blocks if you touch them).
   Use palette slugs (`var:preset|color|primary`, and the other contract slugs), not raw hex.

   Check: insert each of those blocks on a test page; none look like unstyled core.

10. **Confirm custom templates and parts are registered**

    What: Site Editor lists Blank, Full Width, and all header/footer parts.

    How: `customTemplates` and `templateParts` are **already** in `theme.json`.
    Do not duplicate them.
    Only edit titles if a name is unclear.

    Check: in Site Editor, you can assign Blank Canvas and Full Width to a page, and swap header/footer parts.

11. **Optional extras**

    What: a short gradient or duotone set that uses palette colors.

    How: only if it still references existing palette slugs.
    If you replace core defaults, turn `defaultPalette` / `defaultGradients` / `defaultDuotone` off so the UI is not a second vocabulary.

    Skip this if time is tight.
    Items 1-10 are the phase.

### This phase is done when

- Site Editor → Styles looks like a finished design system (type, colors, shadows, radius).
- A Heading uses Plus Jakarta Sans; a Paragraph uses the system stack.
- A page of core Paragraph + Heading + Button looks intentional.
- You did **not** need a new CSS file to achieve that.
- `readme.txt` names Plus Jakarta Sans and its license.

Then work the **Phase 1** list in [`start-stackable.check.md`](./start-stackable.check.md).

---

## Phase 2 is for making "Browse styles" a real product

**Status:** later (after Phase 1).

**What you are making:** skins the user can switch in Site Editor → Styles.
Not a second palette with different slug names.
Same slugs, different values.

**Files you will edit:**

- `styles/colors/*.json` (already eight hue files)
- `styles/typography/*.json` (empty except `.gitkeep`)
- optionally one combined file under `styles/` for a named look

### Implement the following

1. **Audit existing color files**

   What: each color skin is accessible and uses the **same eleven slugs** as `theme.json`.

   How: open every file in `styles/colors/`.
   Keep the slug list identical to Default.
   Adjust hex so `contrast` text on `base` (and buttons on `primary`) is readable.
   Do not add `secondary` or other extra slugs.

   Check: switch Purple, Teal, etc. in Styles; header, footer, and buttons change; no leftover blue from Default.

2. **Add at least two typography variations**

   What: the user can pick more than one type treatment (for example Default vs Display).

   How: add JSON files under `styles/typography/` (for example `display.json`).
   Each file needs `"version": 3`, a `"title"`, and `settings.typography` and/or `styles.typography` that change `fontFamilies` or heading scale.
   Still use the Phase 1 pairing as Default (Jakarta headings, system body).
   A variation may change heading scale or weight.
   If a variation introduces another webfont, bundle and license it the same way.

   Check: switching a typography variation changes headings on the front.

3. **Add at least one dark variation**

   What: a dark skin that still uses slugs `base`, `contrast`, `primary`, and the rest.

   How: either a new file in `styles/colors/` (for example `dark.json`) or a combined file in `styles/`.
   Invert `base` / `contrast` (dark background, light text).
   Recheck button and link contrast.

   Check: activating the dark style makes the whole site dark, including header and footer, with no hardcoded white/black left in templates.

4. **Optional named looks**

   What: a combined "Agency" style that sets color + type together.

   How: only if it still overrides the **same slugs**.
   Skip if the color + typography files already cover it.

### This phase is done when

Switching each variation in Site Editor updates header, footer, buttons, and blog cards.
Templates contain no leftover hardcoded hex that ignores the variation.

Then work the **Phase 2** list in the acceptance check.

---

## Phase 3 is for designing the header and footer

**Status:** later (after Phase 2).

**What you are making:** header and footer that look designed on a blank install, and that are safe (no broken menu IDs).
The intended structure is: markup lives in a **pattern** file, and `parts/*.html` only includes that pattern.

**Files you will add or edit:**

- `patterns/header.php`, `header-transparent.php`, `header-minimal.php`, `footer.php`, `footer-landing.php`
- `parts/*.html` (replace current markup with a pattern include)
- `theme.json` `templateParts` (already registered; do not duplicate)

See [Appendix B](#appendix-b-pattern-inventory) for the slug list.

### Implement the following

1. **Write the header pattern first**

   What: a solid bar with site title or logo, and Navigation, optional search or button.

   How: add `patterns/header.php`.
   WordPress reads the file header automatically.

   ```php
   <?php
   /**
    * Title: Header
    * Slug: start-stackable/header
    * Categories: header
    * Block Types: core/template-part/header
    */
   ?>
   ```

   Below the header, paste block markup (you can copy from `parts/header.html` as a starting point, then design it).
   Every user-visible string: `esc_html_e( 'Search', 'start-stackable' );` or wrap in `esc_html__()`.
   Navigation: `<!-- wp:navigation {"overlayMenu":"mobile"} /-->` with **no** `"ref"`.

   Check: Appearance → Editor → Patterns shows Header.

2. **Point `parts/header.html` at that pattern**

   What: the template part is one line, so header markup lives in one place.

   How: replace the contents of `parts/header.html` with:

   ```html
   <!-- wp:pattern {"slug":"start-stackable/header"} /-->
   ```

   Check: the front still shows a header.
   Editing the pattern edits every template that uses the header part.

3. **Repeat for transparent, minimal, both footers**

   What: five designed parts, five patterns.

   How: same as steps 1-2 for:
   - `start-stackable/header-transparent` (same structure, no opaque background)
   - `start-stackable/header-minimal` (compact)
   - `start-stackable/footer` (columns: identity, socials, two navs, copyright)
   - `start-stackable/footer-landing` (compact)

   Social links: `url":"#"` only.
   Footer copyright: site title or "© {year} {site name}", **not** "Start Stackable Theme".
   Optional: a core Buttons CTA in the default header.

   Check: you can swap header/footer parts in the Site Editor.
   Front shows logo/title + nav + footer with no "Attempt recovery" warnings.

### This phase is done when

Activate on a blank site, assign a menu in the Site Editor, and the front shows a designed header and footer.
No missing-block warnings.
No author brand in the copyright.

Then work the **Phase 3** list in the acceptance check.

---

## Phase 4 is for making `/` look like a designed blog

**Status:** later (after Phase 3).

**What you are making:** first activation "wow" with only Hello World (or a couple of posts).
`index.html` is the latest-posts front.
`home.html` is the same grid when the user later sets a static front page.

**Files you will add or edit:**

- `patterns/post-card.php`, `post-meta.php`, `comments.php`
- `patterns/template-index-grid.php`, `template-archive.php`, `template-search.php`, `template-404.php`, `template-single.php`
- `templates/index.html`, `home.html`, `archive.html`, `search.html`, `404.html`, `single.html`

Template patterns use `Inserter: false` so users do not insert a whole page layout by accident.
See [Appendix B](#appendix-b-pattern-inventory).

### Implement the following

1. **Build a post card pattern**

   What: one card used in every grid (home, archive, search results).

   How: `patterns/post-card.php`, inserter true, category posts.
   Include featured image with a **fixed aspect ratio**, title as a link, excerpt, category, date.
   Use `theme.json` spacing and radius presets, not `border-radius:5px` and not `spacing|50`.

   Check: inserting the pattern in a post looks like a real card, not loose core blocks.

2. **Build the index/home template pattern**

   What: header + grid of cards + pagination + footer.

   How: `patterns/template-index-grid.php` with `Template Types: index, home` and `Inserter: false`.
   Query Loop `inherit: true`.
   Inside `post-template`, include the post-card pattern (or the same blocks).
   Add query pagination.

   Then make `templates/index.html` and `templates/home.html` each:

   ```html
   <!-- wp:pattern {"slug":"start-stackable/template-index-grid"} /-->
   ```

   Check: `/` on a latest-posts site shows header, grid, footer.
   No `front-page.html` file exists.

3. **Build archive, search, and 404 the same way**

   What: those views feel like the same product.

   How:
   - Archive: header + archive title + same grid + footer.
   - Search: header + search title/field + results (cards or a designed list) + empty state + footer.
   - 404: header + designed "not found" + search + footer.
   Replace `templates/archive.html`, `search.html`, `404.html` with pattern includes.

   Check: a category URL, a search, and a bogus URL all look designed.
   Empty search still looks designed.

4. **Build the single post**

   What: a crafted article, not leftover core.

   How: `template-single` with category terms, H1 title, `post-meta` pattern (author · date · categories), featured image, content, `comments` pattern, previous/next or a related Query Loop.
   Point `templates/single.html` at that pattern.
   Fix any leftover `spacing|50` / `secondary` slugs while you are here.

   Check: a post with a featured image shows title, image, meta, comments form.

### This phase is done when

A site with two posts and featured images shows a designed grid on `/`, a crafted single, working search and 404.
No overlapping header.
Cards, type, and spacing match Phase 1.

Then work the **Phase 4** list in the acceptance check.

---

## Phase 5 is for page canvases (ordinary vs marketing vs blank)

**Status:** later (after Phase 4).

**What you are making:** three ways a page can sit in the shell.
Ordinary pages keep a title.
Site Kit marketing pages need **no** theme title and **no** extra padding that blocks a full-bleed first section.
Blank is content only (no header/footer).

**Files:** `patterns/template-page.php`, `template-full-width.php`, `template-blank.php` (or edit the HTML templates directly if you have not extracted patterns yet), plus `templates/page.html`, `full-width.html`, `blank.html`.
`theme.json` already registers `full-width` and `blank` under `customTemplates`.

### Implement the following

1. **Ordinary page canvas**

   What: title is allowed, content is constrained.

   How: `templates/page.html` (or `template-page` pattern include): header, Post Title, optional featured image, Post Content, footer.
   Use constrained layout so text does not span the whole viewport.

   Check: a normal page shows an H1 that comes from Post Title.

2. **Full-width canvas (kit default)**

   What: header + footer, **no** Post Title, **no** extra `main` padding.

   How: today's `templates/full-width.html` wraps `post-content` in a padded Group.
   Remove that padding (and any margin that keeps `alignfull` off the viewport edges).
   Do not output a Post Title block.
   `post-content` should be `alignfull`.

   Check: the same page assigned to Full Width has no theme H1.
   A full-width Group/Cover as the first block reaches the left and right edges.

3. **Blank canvas**

   What: landing / coming soon: content only.

   How: `templates/blank.html` should be Post Content only.
   No `wp:template-part` for header or footer.

   Check: view source or the front DOM: no site header or footer.

### This phase is done when

`page` shows a title.
`full-width` does not, and `alignfull` works.
`blank` has no header/footer in the DOM.

Then work the **Phase 5** list in the acceptance check.

---

## Phase 6 is for sticky and transparent header behavior

**Status:** later (after Phase 5).

**What you are making:** theme-owned header **flags** (behaviors), with Stackable off.
`theme.json` cannot do this, so it lives in `src/`.
`functions.php` already enqueues the compiled bundle.
Do not add a second enqueue.

**Files:** `src/css/header-flags.css`, `src/js/header-flags.js` (stubs already exist).
Run `npm run start` while you edit them.

Contract class names (honor these on `body` or the header wrapper):

- `stk-shell-header-sticky`
- `stk-shell-header-transparent`

### Implement the following

1. **Keep measuring `--stk-header-height`**

   What: heroes can pad themselves below the bar.

   How: `src/js/header-flags.js` already sets `--stk-header-height` on `:root` from `.wp-site-blocks > header`.
   Keep that.
   If the bar shrinks after scroll, also set a scrolled variant (document it if kits will use it).

   Check: in DevTools, `--stk-header-height` is a non-zero `px` value.

2. **Sticky**

   What: the header stays at the top while the page scrolls.

   How: in `header-flags.css`, when `.stk-shell-header-sticky` is present, position the header so it sticks.
   Do not require a Stackable container.

   Check: add the class in the editor or as a body class; scroll; the bar stays.

3. **Transparent + scroll-to-solid**

   What: overlay on a full-bleed first section; after scroll, opaque background and readable text.

   How: `.stk-shell-header-transparent` removes the opaque bar at the top of the page.
   On scroll, JS adds a scrolled class; CSS gives a solid background and contrast-safe text.
   Works on the `full-width` canvas with a tall `alignfull` first Group (no Stackable block required).

   Check: nav sits over the hero; after scroll the bar is opaque and still readable.

4. **Dual logo (if two logos exist)**

   What: optional logo swap when the bar becomes solid.

   How: two Site Logo blocks (or an image pair).
   Toggle visibility with the scrolled class.
   Skip the extra markup if you only have one logo; still support the class for kits.

5. **Mobile menu above the hero**

   What: the overlay Navigation must not sit under the first section.

   How: raise `z-index` of the nav overlay above the full-bleed first section.

   Check: on a phone width, open the menu over a hero; it is clickable and visible.

### This phase is done when

A `full-width` page with a tall `alignfull` first Group shows nav over the hero.
After scroll the bar is opaque.
`--stk-header-height` is non-zero px.
Mobile menu works over the hero.
All with Stackable off.

Then work the **Phase 6** list in the acceptance check.

---

## Phase 7 is for the pattern catalog and one Homepage starter

**Status:** later (after Phase 6).

**What you are making:** users can reconstruct Default from the inserter, and optionally start **one** marketing page without the plugin.
This is not a Design Library.
Do **not** add standalone hero, pricing, testimonial, team, FAQ, or logo-grid patterns.

**Files:** finish any missing patterns from [Appendix B](#appendix-b-pattern-inventory); add `patterns/page-home.php`.

### Implement the following

1. **Finish atoms**

   What: post-card, post-meta, comments, header/footer patterns all exist and are inserter-visible where the inventory says so.

   How: add whatever Phase 3-4 did not already add.
   Template patterns stay `Inserter: false`.

   Check: inserter shows header, footer, post-card, comments.

2. **Add exactly one Homepage starter**

   What: a full homepage built from **core** Group, Cover, Columns, Heading, Buttons, Query.

   How: `patterns/page-home.php` with `Slug: start-stackable/page-home` and `Block Types: core/post-content` so it appears when creating a new page.
   Core blocks only.
   Use Default tokens.

   Check: New Page offers the starter.
   Inserted on a Full Width page it looks coherent with Default.
   Inserter does **not** list a hero/pricing/testimonial set.

3. **Pattern categories**

   What: patterns are findable.

   How: use core categories (`header`, `footer`, `posts`) first.
   Register extra categories in `functions.php` only if those are not enough.

### This phase is done when

Inserter shows the shell patterns plus `page-home`, and does not show a section catalog.

Then work the **Phase 7** list in the acceptance check.

---

## Phase 8 is for WooCommerce templates

**Status:** later (after Phase 7).

**What you are making:** if Woo is installed, shop/product/cart/checkout/account are not unstyled core.
If Woo is not installed, the theme still activates.

**Files:** `templates/archive-product.html`, `single-product.html`, `page-cart.html`, `page-checkout.html`, plus account / order confirmation if the current Woo block-theme handbook lists them.
Optional hidden Woo patterns.

### Implement the following

1. **Add the HTML templates**

   What: Woo views use Woo/core blocks and this theme's tokens.

   How: follow the current Woo block theme handbook for the file names.
   Reuse spacing, radius, and type from `theme.json`.
   Do not require Woo in PHP.
   Unused templates are harmless until Woo is active.

   Check: with Woo active, shop and product are designed.
   With Woo inactive, the theme still activates.

2. **Mobile cart and checkout**

   What: readable on a phone.

   How: check the templates at 375px width.
   Fix spacing with presets, not a one-off CSS file unless `theme.json` cannot express it.

3. **Tags**

   What: do not advertise e-commerce until these files exist.

   How: add the `e-commerce` tag to `style.css` only after this phase ships.

### This phase is done when

Woo on → shop/product look like Default.
Woo off → theme still activates.
Theme Check does not fail on missing Woo.

Then work the **Phase 8** list in the acceptance check.

---

## Phase 9 is for the remaining PHP host work

**Status:** later (after Phase 8).

**What you are making:** recommend Stackable without auto-installing it, and optionally share breakpoints with the plugin.
Identity (supports, enqueue, body class) is **already** in `functions.php`.
Do not add a kit catalog, importer, or remote pattern fetch.

**File:** `functions.php` only.

### Implement the following

1. **Leave existing setup alone unless it is wrong**

   What: supports, enqueue, body class already exist.

   How: `start_stackable_setup`, `start_stackable_enqueue_assets`, and `start_stackable_body_class` are done.
   Do not add a second enqueue path for header flags.

2. **Dismissible "install Stackable" admin notice**

   What: if the plugin is inactive, show a notice.
   User installs from WordPress.org if they want it.
   Gone when the plugin is active.

   How: in `functions.php`, on `admin_notices`, if Stackable is not active, print a dismissible notice.
   Recommend slug `stackable-ultimate-gutenberg-blocks` (WordPress.org only).
   Use core plugin-install capability or TGMPA; **install only on user action**.
   Persist dismiss (user meta or similar) so it does not return every page load after dismiss.
   If the plugin is active, output nothing.

   Check: plugin off → notice shows and can be dismissed.
   Plugin on → no notice.

3. **Breakpoint handshake**

   What: when the plugin is present, it can use this theme's tablet/mobile widths.

   How: wrap in `function_exists` / plugin-active check, then `add_filter( 'stackable_responsive_breakpoints', ... )` with this theme's widths.
   Do nothing if the plugin is absent.

   Check: with plugin off, no PHP notices.
   With plugin on, the filter runs.

4. **Never import on activate**

   What: switching to this theme does not create kit pages or menus (beyond what core Navigation does).

   How: do not hook `after_switch_theme` / `after_setup_theme` to create content.

### This phase is done when

Plugin off → notice dismissible, site works.
Plugin on → body class present, notice gone.
Activate never creates kit pages.

Then work the **Phase 9** list in the acceptance check.

---

## Phase 10 is for WordPress.org packaging

**Status:** later (after Phase 9).

**What you are making:** a zip a Theme Directory reviewer can walk **without** Stackable.

**Files:** `screenshot.png`, `readme.txt`, `style.css`.

### Implement the following

1. **Screenshot of Default**

   What: 1200×900 image of `/` with sample posts, not a Site Kit.

   How: capture the designed blog after Phase 4.
   Save as `screenshot.png` in the theme root.

   Check: the file exists and matches what a fresh latest-posts site shows.

2. **readme.txt for the listing**

   What: sells the designed blog + FSE, not the architecture.

   How: Description, FAQ (plugin is optional; no bundled starter sites), licenses (GPL, font, images), changelog via the existing process.
   Do not hand-edit changelog files that the repo marks as generated.

3. **Honest `style.css` tags**

   What: only tags that are true.

   How: include `full-site-editing`, `block-patterns`, `style-variations`, `blog`.
   Add `e-commerce` only if Phase 8 shipped.

4. **Theme Check**

   What: fix real Theme Review issues.

   How: run Theme Check (or the project's equivalent) against the theme folder or the `npm run build` zip.
   Fix failures rather than silencing them without cause.

### This phase is done when

A reviewer with Stackable deleted can walk Default, and the listing matches the zip.

Then work the **Phase 10** list in the acceptance check.

---

## Phase 11 is for Site Kit snap-in (theme side only)

**Status:** later (after Phase 10).

**What you are making:** a kit import can assign canvases and header flags **without** editing theme PHP and **without** this theme importing anything.

**Files:** header-flag CSS/JS (already from Phase 6), maybe a thin `functions.php` reader for post meta if classes are not enough.
Contract: sibling repo `../Stackable/docs/prd/site-kits.CONTRACT.md`.

### Implement the following

1. **Honor the classes/meta the plugin writes**

   What: import sets `full-width` + sticky + transparent and the home hero sits under the header.

   How: implement whatever the contract names (`stk-shell-header-sticky`, `stk-shell-header-transparent`, and any page meta).
   Do not invent a second set of class names.
   If the contract and this theme disagree, update **both** in the same change.

   Check: with Stackable mounted, a fixture import (plugin e2e or a manual assignment) produces the overlay hero.

2. **Receive a style overlay**

   What: the plugin may select a shipped variation **or** write user Global Styles using the same token slugs.

   How: do not have the theme edit its own JSON from the plugin.
   Just keep slugs stable so an overlay works.

3. **Do not import**

   What: this repo still contains zero kit HTML.

   How: no pages, menus, or kit JSON in this theme.

### This phase is done when

Plugin can assign `full-width` + transparent + sticky without a theme PHP change for each kit.
This repo still has zero kit HTML.

Then work the **Phase 11** list in the acceptance check.

---

## After the last phase

1. Run the **full** [`start-stackable.check.md`](./start-stackable.check.md).
2. Add e2e specs listed in [`start-stackable.agents.md`](./start-stackable.agents.md#e2e-create-these) for surfaces that now exist.
   Do not add failing specs for unfinished work.
3. `npm run build` and install that zip on a clean WordPress.

The theme is **done** when the full acceptance check passes and Theme Review constraints in `.cursor/rules/wordpress-theme-review.mdc` still hold.

---

## Appendix A - Finished zip

When every phase is done, `npm run build` copies a tree like this (docs, e2e, `.cursor`, `src/`, `webpack.config.js`, and `node_modules` stay out):

```text
start-stackable/
  style.css
  theme.json
  functions.php
  screenshot.png
  readme.txt
  assets/fonts/          # Plus Jakarta Sans (headings) + license cited in readme
  assets/images/         # CC0 images used by patterns
  assets/build/          # compiled frontend.css / .js / .asset.php
  templates/             # index, home, page, full-width, blank, single,
                         # archive, search, 404, plus Woo files if Phase 8 shipped
  parts/                 # header, header-transparent, header-minimal,
                         # footer, footer-landing
  patterns/              # see Appendix B
  styles/colors/*.json
  styles/typography/*.json
```

Do not ship `front-page.html`.
Do not ship `function.php`.

Developer-only (not in the zip): `src/` (edit here), `webpack.config.js`.

---

## Appendix B - Pattern inventory

Use this when you reach Phases 3, 4, and 7.
Slugs are `start-stackable/<name>`.

Templates and parts should become **one-line pattern includes** so strings stay translatable and layout lives in one file.

### Template patterns (`Inserter: false`)

| Slug | Template Types | Contents |
| --- | --- | --- |
| `template-index-grid` | `index`, `home` | header part + query grid of post cards + pagination + footer |
| `template-archive` | `archive` | header + archive title + same grid + footer |
| `template-search` | `search` | header + search title/field + results + footer |
| `template-404` | `404` | header + designed not-found + search + footer |
| `template-single` | `single` | header + terms, H1, meta, featured image, content, comments, post nav + footer |
| `template-page` | `page` | header + title + featured image + content + footer |
| `template-full-width` | (custom template) | header + `post-content` alignfull, no Post Title, no extra `main` padding + footer |
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

### Starter page (exactly one)

| Slug | Role |
| --- | --- |
| `page-home` | `Block Types: core/post-content`. One full homepage from **core** blocks. Not a section catalog. |

Do not add standalone hero, pricing, testimonial, team, FAQ, or logo-grid patterns.

### Woo patterns (`Inserter: false` unless a card is reusable)

Shop archive, single product, cart, checkout, account: core/Woo blocks, same tokens.
