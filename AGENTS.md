# Start Stackable agent notes

Start Stackable is a WordPress **block theme**.
It is the site shell and token layer for Stackable Site Kits.
The Stackable **plugin** owns blocks, Global Design System, Design Library, and Site Kit import.

## Product & architecture docs

| Kind | Where |
| --- | --- |
| Glossary | [`CONTEXT.md`](./CONTEXT.md) |
| Product (agents) | [`docs/prd/start-stackable.agents.md`](./docs/prd/start-stackable.agents.md) |
| Product (devs / on-ramp) | [`docs/prd/start-stackable.md`](./docs/prd/start-stackable.md) |
| Implementation plan | [`docs/prd/start-stackable.plan.md`](./docs/prd/start-stackable.plan.md) |
| Acceptance check | [`docs/prd/start-stackable.check.md`](./docs/prd/start-stackable.check.md) |
| Site Kits (plugin, agents) | Sibling repo `../Stackable/docs/prd/site-kits.agents.md` |
| Site Kits (plugin, devs) | Sibling repo `../Stackable/docs/prd/site-kits.md` |
| Site Kit import contract | Sibling repo `../Stackable/docs/prd/site-kits.CONTRACT.md` |
| ADRs | [`docs/adr/`](./docs/adr/) |
| Architecture | [`docs/architecture.md`](./docs/architecture.md) |
| E2E | [`e2e/readme.md`](./e2e/readme.md) |
| Release roadmap | [GitHub Project #2](https://github.com/orgs/gambitph/projects/2/views/1) |
| Repos / companion plugin | [`.cursor/rules/project-repos.mdc`](./.cursor/rules/project-repos.mdc) |
| Issue labels | [`.cursor/rules/issue-labels.mdc`](./.cursor/rules/issue-labels.mdc) |

When code and docs disagree, **PRD and contract win** (WordPress.org Theme Review constraints still apply to the theme zip).
How-it-works maps describe current machinery only. They must not invent product law.

Load [`docs/prd/start-stackable.agents.md`](./docs/prd/start-stackable.agents.md) before changing templates, `theme.json`, header behavior, onboarding, patterns, or theme e2e.
Use [`docs/prd/start-stackable.plan.md`](./docs/prd/start-stackable.plan.md) when implementing a phase (Phase 0 is done; start at Phase 1).
Use [`docs/prd/start-stackable.check.md`](./docs/prd/start-stackable.check.md) to verify a finished (or phase-complete) theme without relying on e2e.

Changing a shell-contract **primitive** requires updating the matching PRD/contract surfaces and tests in the same change.

## General guidelines

- Never use the em dash "—". Use plain dash "-" instead, but if applicable, just use a comma.
- When writing commit messages, NEVER auto-add your agent name as co-author.
- Never manually modify CHANGELOG.md files or any files that are marked as auto-generated.
- When writing or substantially editing long Markdown files, put each full sentence on its own line.
  Preserve normal Markdown structure, but avoid wrapping multiple sentences onto one physical line.
- When making technical decisions, do not give much weight to development cost.
  Instead, prefer quality, simplicity, robustness, scalability, and long term maintainability.
- When doing bug fixes, always start with reproducing the bug in an E2E setting as closely aligned with how an end user would experience it as possible.
  This makes sure you find the real problem so your fix will actually solve it.
- When end-to-end testing a product, be picky about the UI you see and be obsessed with pixel perfection.
  If something clearly looks off, even if it is not directly related to what you are doing, try to get it fixed along the way.
- Apply that same high standard to engineering excellence: lint, test failures, and test flakiness.
  If you see one, even if it is not caused by what you are working on right now, still get it fixed.

## Coding standards (agents)

Maintainability / anti-slop (deepen seams, no phantom tokens or plugin leaks): [`.cursor/rules/anti-slop.mdc`](./.cursor/rules/anti-slop.mdc) - always-on Cursor rule.

WordPress.org Theme Review for the theme zip: [`.cursor/rules/wordpress-theme-review.mdc`](./.cursor/rules/wordpress-theme-review.mdc).

Prefer **deep modules**: lots of behaviour behind a small interface at a clear seam (tokens in `theme.json`, header flags in one host, canvases in `templates/` + `parts/`).
Do not add a shallow wrapper or a second parallel path beside an existing one.
Skill: `.cursor/skills/codebase-design/`.

Theme product rules:

- The theme stays presentational.
- Site Kit markup, Design Library content, and Global Design System writes live in the plugin.
- The theme must work as a complete block theme with Stackable inactive (WordPress.org Theme Review).
- Do not add custom blocks, shortcodes, or demo import inside this theme.

## Agent skills

Project skills live under [`.cursor/skills/`](./.cursor/skills/).
Prefer `wp-block-themes`, `wordpress-router`, `wp-project-triage`, `ensure-quality`, and `codebase-design` for this repo.
Plugin, block-development, REST, and directory-guidelines skills apply mainly to the sibling Stackable plugin, not this theme.

Changelog version for this theme comes from the `Version:` header in `style.css` (and `Stable tag:` in `readme.txt`).
Skill: `add-changelog`.

### Packaging

`npm run start` watches `src/` and compiles into `assets/build/` (`frontend.css`, `frontend.js`, `frontend.asset.php`).
`npm run compile` is the production compile.
`npm run build` compiles, then copies only Theme Directory files into `build/start-stackable/` and zips them to `dist/start-stackable-{version}.zip`.
The zip root folder is `start-stackable/` so WordPress can install it.
Extract `build/start-stackable/` (or the zip) for WordPress.org theme SVN.
PR suffix: `npm run build --suffix=branch-name`.
Script: [`scripts/package.js`](./scripts/package.js).
Do not put docs, e2e, Cursor files, `src/`, `webpack.config.js`, or `node_modules` in the zip.

### Issue tracker

GitHub Issues on this repo (`gambitph/Start-Stackable`) via the `gh` CLI.
Roadmap / version targeting: [org project #2](https://github.com/orgs/gambitph/projects/2/views/1).
Do not apply GitHub changes (close, comment, relabel) without user sign-off.

### Testing

- Playwright e2e (WordPress Playground, no Docker): see [`e2e/readme.md`](./e2e/readme.md).
  Requires Node 20+ (`npm install`, then `npx playwright install chromium`).
  Run: `npm run test:e2e`. UI: `npm run test:debug`.
  Standalone specs run **without** the Stackable plugin.
  Snap-in coverage that needs both products is owned by the plugin suite.
- Reproduce bugs in e2e first, then add or update the spec with the fix.
- Do not add specs for shell-contract surfaces that are not implemented yet.
- Lint whatever the repo documents for touched files. If none exists yet, do not invent a stack.

### Quality gate

Local review (incl. anti-slop) → test → document → lint before commit / after substantive or AI-generated changes.
Skill: `.cursor/skills/ensure-quality/` (project-agnostic; loads this repo's anti-slop rules via discovery).
