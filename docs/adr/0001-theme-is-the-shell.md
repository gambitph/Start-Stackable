# Theme is the shell, not the page builder

Start Stackable exists so Site Kits can land as a full website, not so the theme can compete with the plugin on sections.
The theme owns header, footer, templates, `theme.json` tokens, style variations, and header *behavior* (sticky, transparent, hide).
It is also a complete Default site on activate ([`0002-theme-is-the-default.md`](./0002-theme-is-the-default.md)).
The plugin owns blocks, Design Library, Global Design System, and Site Kit import.

WordPress.org Theme Review requires a theme to work without plugins and forbids demo imports, custom blocks, and plugin territory in the theme zip.
Full-site starter packages live in the companion plugin, not in the theme.

Kits may depend only on the shell contract documented in the PRD.
If a kit needs a new header or footer behavior, add it to this theme (and the contract) instead of faking it in Stackable CSS.
