# Architecture

Start Stackable is a WordPress block theme (FSE).
The **target** is a complete Default site on activate and the **shell** for Stackable Site Kits.
The repo today is a scaffold toward that target.
Current phase status and how to implement live in [`prd/start-stackable.md`](./prd/start-stackable.md).

**Glossary:** [`CONTEXT.md`](../CONTEXT.md)
**PRD (agents):** [`prd/start-stackable.agents.md`](./prd/start-stackable.agents.md)
**PRD (devs):** [`prd/start-stackable.md`](./prd/start-stackable.md)
**Implementation plan:** [`prd/start-stackable.plan.md`](./prd/start-stackable.plan.md)
**Acceptance check:** [`prd/start-stackable.check.md`](./prd/start-stackable.check.md)

```text
 theme.json + styles/              design system (Default)
 templates/ + parts/ + patterns/   header, footer, canvases, blog
 src/ → assets/build/              header-flag CSS/JS (theme.json cannot express)
 functions.php                     enqueue, body class, recommend plugin, flags host
        ▲
        │  CONTRACT snap-in (plugin writes flags / variation / styles overlay)
        │
 Stackable plugin Site Kit import  (not Default; never on activate)
```

Default is the theme.
Kits and Design Library content do not live in this repo.
