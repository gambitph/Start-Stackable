# Start Stackable - developer implementation guide

This is the human product guide for the block theme.
Agents follow [`start-stackable.agents.md`](./start-stackable.agents.md) (same law, shorter).
To **build** the theme, follow the [implementation plan](./start-stackable.plan.md).
To **verify** a build, use the [acceptance check](./start-stackable.check.md).
Site Kits (plugin): `../Stackable/docs/prd/site-kits.md`.
Import schema: `../Stackable/docs/prd/site-kits.CONTRACT.md`.
ADRs: [`../adr/0001-theme-is-the-shell.md`](../adr/0001-theme-is-the-shell.md), [`../adr/0002-theme-is-the-default.md`](../adr/0002-theme-is-the-default.md).

## What this theme is

Start Stackable is a **block theme**: Full Site Editing, `theme.json`, HTML templates, template parts.

It is two things at once:

1. **Default** - a complete, designed site the moment someone activates it from WordPress.org, with Stackable off.
2. **Shell** - chrome, canvases, tokens, and header flags that Site Kits snap into.

The theme must work as a full site on its own.
Stackable adds Site Kits, Global Design System, Design Library, and block controls you do not get from core WordPress.

WordPress.org will reject a theme that only works with a plugin, or that imports demo sites from inside the theme zip.
Full-site starter packages live in the companion plugin, not in the theme zip.

## First-activation and chrome

First activation is a designed blog: templates as pattern includes, header/footer as swappable patterns, and `theme.json` as a design system.

Sticky, transparent, and per-page hide are theme-owned **flags**.
Do not bake a marketing landing into `home.html`.
That landing fights Settings → Reading (the posts page inherits it) and duplicates Site Kits.

## First activation (Default)

Fresh WordPress shows latest posts.
There is no imported page.

`/` must look like a product: designed header, two-column (or equivalent) post grid of crafted cards, designed footer, bundled webfont, tokens.
Hello World is enough content.
WOW is craft, not a fake SaaS homepage.

Do **not** ship `front-page.html`.
`index.html` is the latest-posts front.
`home.html` is the posts index when the user later sets a static front (same grid, not a marketing page).

A user can insert the one theme **Homepage** starter pattern onto a page (core blocks) if they want a marketing home without Stackable.
That is DIY, one page, no importer.
Site Kits replace that job with a full site.

## Standalone bar (no plugin)

A user with only this theme can:

- See designed header and footer on first activation (logo/title + navigation, no broken `ref`).
- Edit chrome in the Site Editor, including swapping header/footer patterns.
- Switch **color and typography** style variations, including at least one dark.
- Run a blog: home/archive grid, single post (image, meta, comments), search, 404.
- Choose page canvases: default, full-width (no title), blank (no chrome).
- Insert the one Homepage starter pattern onto a new page.
- Use core blocks that inherit `theme.json`.
- If WooCommerce is active: shop/product/cart/checkout/account templates that are not unstyled.

They cannot import a multi-page marketing Site Kit until Stackable is installed.
That gap is the conversion, not a broken empty site.

## Conversion (no import on activate)

**Directory user, plugin off:** activate → already on Default → optional Styles / starter page → dismissible notice to install Stackable (user-initiated, WordPress.org slug) → plugin catalog.

**Stackable already active:** activate theme → notice is gone → user opens Site Kits in plugin admin when they want a kit.
The catalog may show Default as a **label** ("you are on the theme").
Clicking Default does not import and does not reset an imported kit.
Never import on theme or plugin activation.

## Shell vs engine

| Own in the theme | Own in Stackable |
| --- | --- |
| Header/footer parts and shell patterns | `stackable/*` blocks, Design Library sections, kit pages |
| `theme.json` + color/typography variations | Global Color Schemes, typography presets, Global Block Styles |
| Sticky / transparent / hide-chrome | Section motion, block sticky, responsive hide on blocks |
| Blog, Woo, and utility templates | Site Kit wizard, import, design-system side editor |
| One Homepage starter page (core blocks) | Multi-page kits + menus + GDS |
| Dismissible "install Stackable" notice | Plugin admin, Freemius, REST |

Header **layouts** are template parts (`header`, `header-transparent`, `header-minimal`).
Header **flags** are behaviors (sticky, transparent, on-scroll solid).
A kit says: use part X with flags Y.
Do not create a new part for every combination.

## Token contract

`theme.json` is the contract Stackable already reads (style inheritance, widths, size presets).
It is also the visual product: fluid type, fluid spacing, shadow presets, radius presets, element and core-block styles, bundled font.

Keep these aligned with the plugin's inheritance layer:

| Token | v1 value / rule |
| --- | --- |
| `layout.contentSize` | `645px` |
| `layout.wideSize` | `1340px` |
| Palette slugs | `primary`, `primary-light`, `primary-soft`, `primary-deep`, `base`, `base-accent`, `tint`, `contrast`, `contrast-accent`, `outline`, `outline-contrast` |
| Font size slugs | `x-small` … `xxx-large` as in current `theme.json` (add fluid `min`/`max`) |
| Spacing slugs | `small` … `xxxx-large` as in current `theme.json` (prefer `clamp`) |
| `--stk-header-height` | Theme CSS, not `theme.json` (runtime) |

Every HTML template and pattern must use these presets.
Undefined slugs (`spacing|50`, color `secondary`) are bugs.

Color variations live under `styles/colors/` and override the **same slugs**.
Typography variations live under `styles/typography/`.
Do not invent a second palette vocabulary for "industry kits".
A kit may **select** a shipped variation and/or write a **theme styles overlay** (user Global Styles) plus Stackable GDS.
Industry identity lives in the kit package, not in a theme fork.

Font family: bundle a webfont.
Pick the face during implementation (candidates are in the plan).
Do not leave the system UI stack as the Default look.

## Templates and parts

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

Implement as small theme CSS/JS attached to the header part wrapper.
Keep it presentational.
Per-page flags can be post meta the plugin writes on import, or a class on `body`/`main`.
Prefer classes the kit contract names (`stk-shell-header-sticky`, `stk-shell-header-transparent`) so import is one write.

Dual logo: two Site Logo blocks or an image pair toggled with the scrolled class.
Document the class names in the contract if they are part of the public kit API.

## Patterns

Theme patterns reconstruct Default.
They are not a second Design Library.

**In the theme:** header/footer variants, post card, post meta, comments, template patterns (inserter hidden), one Homepage starter page.

**In the plugin:** heroes, pricing, testimonials, team, FAQ, logos, kit pages.

## `functions.php`

Rename `function.php` → `functions.php`.

Minimum:

- `add_theme_support` for editor styles / responsive embeds / block styles as needed.
- `body_class` filter → `stk--is-stackable-theme`.
- Dismissible admin notice if Stackable is inactive; recommend plugin `stackable-ultimate-gutenberg-blocks` from WordPress.org; install only on user action (`TGMPA` or core plugin-install capability).
- If `function_exists` / plugin active: add `stackable_responsive_breakpoints` filter with the theme's tablet/mobile widths.

No options framework.
No React admin app for kits.
No remote file fetch without explicit user consent (Theme Review).
No import on activate.

## Directory launch

WP.org reviewers never see Site Kits.
The zip must stand alone: `screenshot.png` that matches Default, designed templates, style variations, `block-patterns` and `style-variations` tags, `e-commerce` only if Woo templates ship, licenses for fonts and images, user (not author) copyright on the front.

`readme.txt` sells the site, not the architecture.

## Implementation

Phases and file-level steps: [`start-stackable.plan.md`](./start-stackable.plan.md).
Do not skip a phase's **Done when**.

E2E specs to create: table in [`start-stackable.agents.md`](./start-stackable.agents.md#e2e-create-these).
Do not add failing specs for unfinished chrome.

## Review questions

- Would Theme Review still accept this zip with Stackable deleted from the world?
- Does `/` on a blank latest-posts site look like a product?
- Can a kit depend on this without a CSS hack in the plugin?
- Did we add a hero/pricing/testimonial *section* that belongs in Design Library?
- Did we import anything on activate?
