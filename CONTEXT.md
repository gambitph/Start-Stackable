# Start Stackable

Start Stackable is a WordPress block theme.
It is a complete site on its own and the shell that Site Kits snap into.
The Stackable plugin is a separate product.

## Language

### Product

**Start Stackable**:
The block theme in this repository.
_Avoid_: Stackable theme (ambiguous with the plugin), SUG B theme

**Default**:
The site you get on theme activate with Stackable off: designed blog chrome, tokens, and templates.
_Avoid_: Default Site Kit (it is not a kit package), demo import, starter site

**Shell**:
Theme-owned chrome and templates: header, footer, blog, archives, 404, search, page canvases, `theme.json`.
_Avoid_: layout (too vague), page builder, Design Library

**Token**:
A named value in `theme.json` (color, font size, spacing, content/wide width) that Stackable blocks inherit.
_Avoid_: CSS variable alone, Global Color Scheme (plugin)

**Style variation**:
A `styles/**/*.json` file that reskins the same tokens (color and/or typography).
_Avoid_: Site Kit (plugin bundle), Global Color Scheme (plugin)

**Theme styles overlay**:
A kit-owned `theme.json` styles object the plugin writes as user Global Styles so chrome matches the kit without a theme release.
_Avoid_: editing theme files from the plugin, a second palette vocabulary

**Header part**:
A template part that is the site header (`header`, `header-transparent`, `header-minimal`).
_Avoid_: header block (unless you mean a core block inside the part)

**Header flag**:
A behavior applied to a header part: sticky, transparent, hide.
_Avoid_: treating sticky as a fourth header layout

**Page canvas**:
How a page’s main content is framed: default, full-bleed no-title, blank (no header/footer).
_Avoid_: Site Kit page (plugin content)

**Shell pattern**:
A theme pattern that reconstructs Default (chrome, blog atoms, template guts) or the one DIY Homepage starter page.
_Avoid_: Design Library section, kit page, hero/pricing/testimonial catalog

**Shell contract**:
The theme primitives a Site Kit is allowed to depend on (sticky, transparent, no-title canvas, header-height token, and related flags).
_Avoid_: inventing kit-only CSS in the plugin to fake these

### Companion

**Stackable**:
The block plugin in the sibling `Stackable` repo.
_Avoid_: putting plugin features in this theme

**Site Kit**:
A plugin-owned import package (pages, optional patterns, menus, template map, theme styles, Global Design System).
_Avoid_: starter site (competitor copy), theme demo import (forbidden in this theme), Default (the theme itself)

**Global Design System**:
Stackable plugin site-wide tokens (color schemes, typography, presets, block styles).
_Avoid_: theme.json (this theme’s tokens), style variation (this theme’s skins)
