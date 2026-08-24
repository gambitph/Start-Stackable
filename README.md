# Start Stackable
**Contributors:** [gambittechnolgies](https://gambit.ph/)

**Requires at least:** 6.7

**Tested up to:** 6.8

**Requires PHP:** 7.2

**Stable tag:** 1.0.0

**License:** GPLv2 or later

**License URI:** http://www.gnu.org/licenses/gpl-2.0.html

## Description

Start Stackable is a WordPress block theme: the site shell and token layer for Stackable Site Kits.
It is a complete theme without the plugin (blog, header, footer, `theme.json`).
With Stackable installed, Site Kits snap into this shell.

## Build

Node **20+**. Theme extras (header-flag CSS/JS) compile with `@wordpress/scripts`.
Tokens and layout stay in `theme.json` / HTML templates; do not dump a design system into CSS.

```bash
npm install
npm run start      # watch src/ → assets/build/
npm run compile    # production compile
npm run build      # compile + zip
```

- `src/` is the edit surface for compiled extras. `assets/build/` is generated.
- `build/start-stackable/` is the theme tree (extract this for Theme Directory SVN).
- `dist/start-stackable-{version}.zip` is the installable zip (root folder `start-stackable/`).
- PR suffix: `npm run build --suffix=branch-name`.

## Documentation

The theme is a working scaffold, not a finished product.
New to the repo? Start with the developer guide (what it is, current state, how we work, then product rules).

| When | Doc |
| --- | --- |
| New here / how we develop | [`docs/prd/start-stackable.md`](./docs/prd/start-stackable.md) |
| Implement the next phase | [`docs/prd/start-stackable.plan.md`](./docs/prd/start-stackable.plan.md) (Phase 1 is next) |
| Check a phase | [`docs/prd/start-stackable.check.md`](./docs/prd/start-stackable.check.md) |
| Word meanings | [`CONTEXT.md`](./CONTEXT.md) |
| Agents (same law, shorter) | [`docs/prd/start-stackable.agents.md`](./docs/prd/start-stackable.agents.md) |
| Site Kits (plugin) | Sibling repo `../Stackable/docs/prd/site-kits.md` |
| E2E | [`e2e/readme.md`](./e2e/readme.md) |

## Copyright

Start Stackable Theme, (C) 2025 Gambit Tehcnologies Inc.
Start Stackable is distributed under the terms of the GNU GPL.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
