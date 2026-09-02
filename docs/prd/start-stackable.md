# Start Stackable - developer implementation guide

This is the human product guide for the block theme.
It explains what the theme is, where the repo stands today, how we develop, and the product rules that every change must follow.

Agents follow [`start-stackable.agents.md`](./start-stackable.agents.md) (same product law, shorter, no teaching).

## Start here

This repository is a WordPress **block theme** named Start Stackable.
A block theme is a theme you edit in the Site Editor.
Layout lives in HTML templates.
Colors, fonts, and spacing live in `theme.json`.
There is almost no classic PHP templating.

The theme is **not finished**.
What you have now is a working **scaffold**: it activates, the Site Editor opens, and the compile/zip tooling works.
Default (the designed blog you should see on first activation) is not a product yet.

Work is organized as **phases 0 through 11** in the [implementation plan](./start-stackable.plan.md).
Phases 0-2 are done.
**The current work is Phase 3** (header and footer parts plus patterns).
Do not skip ahead to blog templates, canvases, or Site Kit snap-in until that phase's **Done when** is true.

If a word feels loaded (Default, shell, token, canvas, header flag), see [`CONTEXT.md`](../../CONTEXT.md).

## Which doc do I open?

| I want to... | Open |
| --- | --- |
| Understand the product and how we work | This file |
| Implement the next phase | [Implementation plan](./start-stackable.plan.md) |
| Check whether a phase actually landed | [Acceptance check](./start-stackable.check.md) |
| Look up a word | [`CONTEXT.md`](../../CONTEXT.md) |
| Run or add browser tests | [`e2e/readme.md`](../../e2e/readme.md) |
| See the two big decisions (theme is shell, theme is Default) | [`../adr/`](../adr/) |
| Work on Site Kits (plugin, not this theme) | Sibling `../Stackable/docs/prd/site-kits.md` |

You do not need the plugin docs or the import contract to start Phase 3.

## Block theme in 60 seconds

These are the files you will touch, and what each one is for:

| Location | What it is |
| --- | --- |
| `theme.json` | The design system: named colors, font sizes, spacing, content/wide widths, and default styles for headings, buttons, and core blocks. |
| `styles/colors/` and `styles/typography/` | Optional skins (style variations) that restyle the **same** named colors or fonts. Switching a variation in Site Editor → Styles should restyle the whole site. |
| `templates/` | One HTML file per kind of page (blog home, single post, page, search, 404, and so on). WordPress picks the file automatically. |
| `parts/` | Reusable header and footer pieces that templates include. |
| `patterns/` | Reusable block layouts. Phase 3 adds header/footer patterns; later phases add blog atoms, template patterns, and one optional Homepage starter. |
| `functions.php` | The only PHP bootstrap WordPress loads from the theme. Must be this filename (not `function.php`). |
| `src/` | Extra CSS and JS for behavior `theme.json` cannot express (sticky/transparent header). Compiles into `assets/build/`. |
| `style.css` | Theme identity for WordPress (name, version, tags). It is not where the design system lives. |

**Tokens** are the named values in `theme.json` (for example color `primary`, spacing `large`).
Templates and patterns must use those names.
A raw hex or a made-up slug such as `spacing|50` is a bug.

**Do not** put the color palette, type scale, or spacing scale into CSS.
That belongs in `theme.json`.
CSS in `src/` is only for things `theme.json` cannot do, such as measuring header height or sticky overlay behavior.

## Current state (you are here)

Snapshot of the tree as of 1 September 2026.
If the files and this section disagree, trust the files and the [phase checklists](./start-stackable.check.md).

**Phases 0-2 are complete.**
The theme is a valid block theme that activates without a PHP fatal.
`functions.php` enqueues `assets/build/frontend.*` and adds the body class `stk--is-stackable-theme`.
`npm run start` compiles `src/` into `assets/build/`.
Template and part **files** exist.
Color palette **slugs** and content/wide widths already match the token contract below.

**Phase 3 is in progress.**
Phases 4-11 are not started.
What you see on `/` is a skeleton blog (site title, a basic post grid, a footer), not the designed Default the product requires.

| Phase | Status | What is true now | What "done" looks like |
| --- | --- | --- | --- |
| 0 Bootstrap | Done | Theme activates; compile/zip works | (already met) |
| 1 Design system | Done | Token contract, Jakarta headings, system body, fluid type and spacing, shadows, radius, and core-block styles are implemented | (already met) |
| 2 Style variations | Done | Nine color skins, including Dark, plus Compact and Editorial typography presets use the shared token contract | (already met) |
| 3 Header and footer | In progress | Five core-only patterns own the shell markup; parts are thin pattern includes | Designed, fresh-install-safe header/footer with no hardcoded Navigation `ref` |
| 4 First-activation blog | Scaffold | `index.html` is a basic two-column Query Loop | Crafted post cards, designed single/search/404, `/` looks like a product with Hello World |
| 5 Canvases | Scaffold | `page`, `full-width`, and `blank` files exist; `full-width` still wraps content in padding | Ordinary pages have a title; kit pages are full-bleed with no theme title |
| 6 Header flags | Stub | JS only sets `--stk-header-height`; no sticky/transparent CSS yet | Sticky, transparent overlay, scroll-to-solid, mobile nav above a hero, plugin off |
| 7 Patterns | Not started | Header/footer patterns exist; blog atoms and `page-home` do not | Header/footer/post-card/comments + exactly one Homepage starter; no hero/pricing catalog |
| 8 Woo templates | Not started | No Woo HTML templates | Shop/product/cart/checkout look designed if Woo is active; theme still works if it is not |
| 9 PHP host | Partial | Setup, enqueue, body class | Dismissible "install Stackable" notice + optional breakpoint handshake |
| 10 Directory packaging | Not started | No `screenshot.png`; tags incomplete | WP.org zip: screenshot of Default, licenses, honest tags |
| 11 Snap-in | Not started | Contract is documented only | Plugin can assign `full-width` + header flags without a theme PHP change |

Honest one-liner: this is a **legal scaffold**.
Default is not designed yet.
Continue Phase 3.

## How we develop

This is sequential craft, not "pick a random file."

1. **Read this guide** so you know what the theme is allowed to own.
2. **Open the next unfinished phase** in the [plan](./start-stackable.plan.md).
   Right now that is Phase 3.
   Do not skip a phase.
3. **Implement in the existing seam**, not a parallel system:
   - look → `theme.json` and `styles/`
   - layout → `templates/`, `parts/`, and `patterns/`
   - behavior `theme.json` cannot express → `src/css/` and `src/js/`
   - PHP → `functions.php` only, functions prefixed `start_stackable_`
4. **Stay inside product law** (the rest of this file).
   Core blocks only in templates, parts, and patterns.
   No `stackable/*` markup.
   No `front-page.html`.
   No demo or Site Kit importer.
   No second token system in CSS.
5. **Verify with the matching checklist** in the [acceptance check](./start-stackable.check.md).
   Each item is pass or fail with a file path, not a vibe.
6. **Then** add Playwright e2e for surfaces that now exist.
   Do not add a failing spec for a header, footer, or flag that is not implemented yet.
   Bug fixes start by reproducing in e2e the way a user would see the bug.
7. **Package** with `npm run build` when you need an installable zip.
   Docs, e2e, `.cursor`, `src/`, and `node_modules` stay out of the zip.

Day-to-day commands (Node 20+):

```bash
npm install          # once
npm run start        # watch src/ → assets/build/ while editing CSS/JS
# theme.json, templates, and parts: refresh the site; no compile needed
npm run test:e2e     # Playwright + WordPress Playground (no Docker)
npm run compile      # production compile of src/
npm run build        # compile + zip
```

A phase is done when its **Done when** line is true and that phase's checkboxes in the acceptance check pass.

## What "done" means for the whole theme

The theme is finished when **every** phase checklist passes, and all of the following stay true:

1. Activate with Stackable **off**, latest posts: `/` shows a designed header, post grid, and footer.
2. Style variations (color and typography, at least one dark) restyle header, footer, and blog cards.
3. A WordPress.org reviewer with the plugin deleted can still walk a complete blog.
4. A Site Kit can depend on the shell primitives in this file without a CSS hack in the plugin.
5. This repo still contains zero kit HTML, zero custom blocks, and zero importer.

Until then, implement the next phase.
Do not treat the "ideal theme tree" in the plan as the current tree.
That tree is the destination.

---

## What this theme is

Start Stackable is two things at once:

1. **Default** - a complete, designed site the moment someone activates it from WordPress.org, with the Stackable plugin off.
2. **Shell** - the header, footer, page canvases, tokens, and header flags that Site Kits later snap into.

The theme must work as a full site on its own.
The Stackable plugin (sibling repo `../Stackable`) adds Site Kits, a Global Design System, a Design Library, and block controls you do not get from core WordPress.

WordPress.org will reject a theme that only works with a plugin, or that imports demo sites from inside the theme zip.
Full-site starter packages live in the companion plugin, not in this theme.

Two decisions lock this split: [`0001-theme-is-the-shell.md`](../adr/0001-theme-is-the-shell.md) and [`0002-theme-is-the-default.md`](../adr/0002-theme-is-the-default.md).

## First activation (Default)

Fresh WordPress shows **latest posts**.
There is no imported page.

`/` must look like a product: designed header, two-column (or equivalent) post grid of crafted cards, designed footer, Plus Jakarta Sans headings, system-stack body, tokens.
Hello World is enough content.
The "wow" is craft, not a fake SaaS homepage.

Do **not** ship `front-page.html`.
`index.html` is the latest-posts front.
`home.html` is the posts index when the user later sets a static front page under Settings → Reading.
That posts index must be the same grid, not a marketing landing.
A marketing `home.html` fights that setting and duplicates what Site Kits already do.

A user can insert the one theme **Homepage** starter pattern onto a page (core blocks only) if they want a marketing home without Stackable.
That is DIY, one page, no importer.
Site Kits replace that job with a full site.

Sticky, transparent, and per-page hide are theme-owned **flags** (behaviors), not extra header layouts.
See [Header flags](#header-flags-site-kit-requirement).

## Standalone bar (no plugin)

When Default is finished, a user with only this theme can:

- See designed header and footer on first activation (logo or site title + navigation, no broken Navigation `ref`).
- Edit the header and footer in the Site Editor, including swapping header/footer patterns.
- Switch **color and typography** style variations, including at least one dark.
- Run a blog: home/archive grid, single post (image, meta, comments), search, 404.
- Choose page canvases: default, full-width (no title), blank (no header or footer).
- Insert the one Homepage starter pattern onto a new page.
- Use core blocks that inherit `theme.json`.
- If WooCommerce is active: shop/product/cart/checkout/account templates that are not unstyled.

They cannot import a multi-page marketing Site Kit until Stackable is installed.
That gap is the conversion, not a broken empty site.

## Conversion (no import on activate)

**Directory user, plugin off:** activate → already on Default → optional Styles / starter page → dismissible notice to install Stackable (user-initiated, WordPress.org plugin slug) → plugin catalog.

**Stackable already active:** activate theme → notice is gone → user opens Site Kits in plugin admin when they want a kit.
The catalog may show Default as a **label** ("you are on the theme").
Clicking Default does not import and does not reset an imported kit.
Never import on theme or plugin activation.

## What lives here vs the plugin

| Own in the theme | Own in Stackable |
| --- | --- |
| Header/footer parts and shell patterns | `stackable/*` blocks, Design Library sections, kit pages |
| `theme.json` + color/typography variations | Global Color Schemes, typography presets, Global Block Styles |
| Sticky / transparent / hide header or footer | Section motion, block sticky, responsive hide on blocks |
| Blog, Woo, and utility templates | Site Kit wizard, import, design-system side editor |
| One Homepage starter page (core blocks) | Multi-page kits + menus + Global Design System |
| Dismissible "install Stackable" notice | Plugin admin, Freemius, REST |

Header **layouts** are template parts (`header`, `header-transparent`, `header-minimal`).
Header **flags** are behaviors (sticky, transparent, on-scroll solid).
A kit says: use part X with flags Y.
Do not create a new part for every combination.

If you find yourself adding a hero, pricing, or testimonial **section** pattern, that work belongs in the plugin Design Library, not here.

## Token contract

`theme.json` is the contract the Stackable plugin already reads (style inheritance, widths, size presets).
It is also the visual product: fluid type, fluid spacing, shadow presets, radius presets, element and core-block styles, Plus Jakarta Sans headings.

Keep these aligned with the plugin's inheritance layer:

| Token | v1 value / rule |
| --- | --- |
| `layout.contentSize` | `645px` |
| `layout.wideSize` | `1340px` |
| Palette slugs | `primary`, `primary-light`, `primary-soft`, `primary-deep`, `base`, `base-accent`, `tint`, `contrast`, `contrast-accent`, `outline`, `outline-contrast` |
| Font size slugs | `x-small` … `xxx-large` as in current `theme.json` (add fluid `min`/`max`) |
| Spacing slugs | `small` … `xxxx-large` as in current `theme.json` (prefer `clamp`) |
| Heading font | Plus Jakarta Sans (bundled OFL, slug `plus-jakarta-sans`) on `styles.elements.heading`, site title, and post title |
| Body font | System UI stack (existing slug `sans-serif`) on `styles.typography.fontFamily` |
| `--stk-header-height` | Theme CSS/JS, not `theme.json` (measured at runtime) |

Every HTML template and pattern must use these presets.
Undefined slugs (`spacing|50`, color `secondary`) are bugs.

Color variations live under `styles/colors/` and override the **same slugs**.
Typography variations live under `styles/typography/`.
Do not invent a second palette vocabulary for "industry kits".
A kit may **select** a shipped variation and/or write a **theme styles overlay** (user Global Styles) plus Stackable Global Design System.
Industry identity lives in the kit package, not in a theme fork.

Font family: **Plus Jakarta Sans** for headings (bundled).
**System UI stack** for body (the `sans-serif` family already in `theme.json`).
Do not bundle a second webfont for Default body.
Cite the Jakarta license in `readme.txt`.

## Templates and parts

A **template** is the HTML WordPress uses for a kind of view.
A **part** is a header or footer chunk templates include.
A **canvas** is how a page’s main content is framed: ordinary page (title OK), full-width (no title, full-bleed), or blank (content only).

| Template | When to use |
| --- | --- |
| `index.html` | Latest-posts front and fallback |
| `home.html` | Posts page when a static front page is set |
| `page.html` | Ordinary pages (title OK) |
| `full-width.html` | Kit marketing pages: no Post Title, no extra padding on `main`, `alignfull` works |
| `blank.html` | Landing / coming soon: content only |
| `single.html` | Blog post |
| `archive.html` | Category/tag/date |
| `search.html` | Search results |
| `404.html` | Not found |
| Woo templates | Shop, product, cart, checkout, account |

Do not ship `front-page.html`.

| Part | Role |
| --- | --- |
| `header` | Default solid bar |
| `header-transparent` | Overlay for hero homes |
| `header-minimal` | Quiet inner/landing |
| `footer` | Default columns |
| `footer-landing` | Compact |

`full-width` is the kit default for Home/About/Pricing/Contact.
If the theme prints a page title or large padding above the first section, the kit looks wrong even with a perfect sticky header.

## Header flags (Site Kit requirement)

Core Group `position: sticky` is not enough for marketing kits.
Kits need:

1. Transparent overlay on a full-bleed first section.
2. After scroll: opaque background, readable nav, optional logo swap.
3. `--stk-header-height` so heroes can pad content below the bar.
4. Mobile overlay above the hero.

Implement as small theme CSS/JS in `src/` attached to the header part wrapper (Phase 6).
Keep it presentational.
Per-page flags can be post meta the plugin writes on import, or a class on `body`/`main`.
Prefer classes the kit contract names (`stk-shell-header-sticky`, `stk-shell-header-transparent`) so import is one write.

Dual logo: two Site Logo blocks or an image pair toggled with the scrolled class.
Document the class names in the Site Kit import contract if they are part of the public kit API.

## Patterns

Theme patterns reconstruct Default.
They are not a second Design Library.

**In the theme:** header/footer variants, post card, post meta, comments, template patterns (inserter hidden), one Homepage starter page.

**In the plugin:** heroes, pricing, testimonials, team, FAQ, logos, kit pages.

The plan has the full pattern inventory.
Do not add those files until you are on Phase 3 (parts) or Phase 7 (catalog + starter).

## `functions.php`

WordPress only loads **`functions.php`** from the theme root.
A file named `function.php` is ignored.
Do not ship `function.php`.

Compiled extras enqueue from here (`assets/build/frontend.*`, source in `src/`).

Minimum (Phase 9 completes the last two; Phase 0 already has the first two):

- `add_theme_support` for editor styles / responsive embeds / block styles as needed.
- `body_class` filter → `stk--is-stackable-theme`.
- Dismissible admin notice if Stackable is inactive; recommend plugin `stackable-ultimate-gutenberg-blocks` from WordPress.org; install only on user action (`TGMPA` or core plugin-install capability).
- If `function_exists` / plugin active: add `stackable_responsive_breakpoints` filter with the theme's tablet/mobile widths.

No options framework.
No React admin app for kits.
No remote file fetch without explicit user consent (Theme Review).
No import on activate.

## Directory launch

WordPress.org reviewers never see Site Kits.
The zip must stand alone: `screenshot.png` that matches Default, designed templates, style variations, `block-patterns` and `style-variations` tags, `e-commerce` only if Woo templates ship, licenses for fonts and images, user (not author) copyright on the front.

`readme.txt` sells the site, not the architecture.

## Implementation

Numbered what/how steps per phase: [`start-stackable.plan.md`](./start-stackable.plan.md).
Skip Phases 0-2 (done).
Continue Phase 3 and do the numbered items in order.
Do not skip a phase's **This phase is done when**.

E2E specs to create once a surface exists: table in [`start-stackable.agents.md`](./start-stackable.agents.md#e2e-create-these).
Do not add failing specs for an unfinished header or footer.

## Review questions

Use these before you call a change done:

- Would Theme Review still accept this zip with Stackable deleted from the world?
- Does `/` on a blank latest-posts site look like a product?
- Can a kit depend on this without a CSS hack in the plugin?
- Did we add a hero/pricing/testimonial *section* that belongs in Design Library?
- Did we import anything on activate?
