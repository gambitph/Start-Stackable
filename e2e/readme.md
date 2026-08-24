# E2E Testing

Start Stackable's end-to-end tests verify that the block theme activates and
renders as a complete WordPress.org theme **without** the Stackable plugin.

WordPress is provided by [`@wp-playground/cli`](https://www.npmjs.com/package/@wp-playground/cli)
(WASM PHP + SQLite, **no Docker**). Playwright's `webServer` boots it
automatically before the suite runs.

This harness mirrors Stackable (`../Stackable/e2e/readme.md`).
The theme zip has no Node runtime.
Compiled extras live in `assets/build/` (from `src/` via `npm run compile`).
Playground mounts the theme folder, so run `npm run compile` (or `npm run start`) before e2e if that bundle is missing.

## Prerequisites

Node **20+** and npm - no Docker, Composer, Local WP, or `.env` file.

```bash
npm install
npx playwright install chromium
```

## Usage

```bash
npm run test:e2e
```

or with the Playwright UI:

```bash
npm run test:debug
```

Playground starts on port `9430` if nothing is already listening.
Locally, Playwright reuses an already-running Playground on that port when present.
In CI it always boots fresh.
If a stale instance is misbehaving after editing PHP/HTML that Playground mounted at boot, kill whatever is listening on that port and re-run.

Optional overrides:

```
WP_PORT=9430
WP_BASE_URL=http://127.0.0.1:9430
WP_PHP_VERSION=8.2
WP_VERSION=latest
WP_USERNAME=admin
WP_PASSWORD=password
THEME_SLUG=start-stackable
```

## CI

`.github/workflows/e2e-tests.yml` runs the suite on `main` pushes and PRs.
Two corners: latest WP + PHP 8.3, and WP 6.7 (theme `Requires at least`) + PHP 7.4.
A new push to the same PR or branch cancels the previous E2E run.

## What is covered

Standalone specs run **without** the Stackable plugin.
Assertions for invalid blocks use **Gutenberg recovery UI only** when a spec
opens the editor. Do not listen for console `Block validation` messages.

| Spec | Assertions (shipped now) |
| --- | --- |
| `e2e/tests/standalone-activate.spec.ts` | Theme activates from a default theme; admin Themes screen has no PHP error; front page shows header (site title) + footer; no `stackable/` markup; 404 template renders. |

Deferred until those surfaces ship (see [`docs/prd/start-stackable.agents.md`](../docs/prd/start-stackable.agents.md#e2e-create-these)):

- Navigation without stale `ref`
- `tokens-and-variations.spec.ts`
- `blog.spec.ts` (`home.html`, `search.html`, post card completeness)
- `canvases.spec.ts` (`full-width` / `blank` contract)
- `header-flags.spec.ts`
- `onboarding.spec.ts`
- `with-plugin-snap-in.spec.ts` (plugin-owned snap-in plus a thin theme smoke)

## Files

| Path | Role |
| --- | --- |
| `../playwright.config.js` | Suite; Playground on 9430; mounts this repo as the theme |
| `playground-blueprint.json` | Login + activate Start Stackable |
| `config/global-setup.js` | Cookie auth + write `e2e/.auth/test-env.json` |
| `test-utils/test.ts` | Re-export Playwright + WordPress e2e fixtures |
| `tests/*.spec.ts` | Browser specs |
| `.auth/` | Gitignored; written by global setup |

## Troubleshooting

- **`browserType.launch: Executable doesn't exist`** - run
  `npx playwright install chromium` once per machine.
- **Stale theme behaviour after editing PHP/HTML** - Playground snapshots the
  mount at boot. Stop the process on port `9430` and re-run.
- **Port already in use** - another Playground is still running. Kill it or set `WP_PORT`.
