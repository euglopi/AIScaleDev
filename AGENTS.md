## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Project: AI Method (aimethod.dev)
This repository belongs to AI Scale Dev, the parent brand, which also owns the aiscale.dev address and the owner's X account. AI Method is AI Scale Dev's first project and the only work in this repository today. The parent may later offer consulting and have its own site; none is being built now.
Rules for AI Method only: no consulting or selling on AI Method's pages; everything public; every change goes through LID. When work on a parent-brand site starts, it gets its own folder with its own notes, and LID is then narrowed to AI Method's folders (LID's scoped mode). Until then LID stays in full mode, because AI Method is the only work here.
AI Method is a research site: finds research and practice on building software with AI, grades how well each method or claim is proven, tracks what leading voices say, and links every source. It does not review or rank products, and it offers no consulting. Design: docs/high-level-design.md. Editorial rules: docs/editorial/.
Astro static, MDX, Tailwind.
Built in public: the repository holds everything, drafts and working records included. Never commit keys or passwords. Nothing is published on the site before public launch.
Deploy: Vercel. The site answers at https://ai-scale-dev.vercel.app.
Domains (as of Nov 14 2026): aimethod.dev is AI Method's address. aiscale.dev is the parent brand's address, not a forward to AI Method; what it shows is not decided. Both are registered at Porkbun, use Porkbun's nameservers and show its placeholder page; neither is connected to the Vercel site yet.
The earlier Cloudflare DNS setup for aiscale.dev, its Vercel DNS targets and its email forwarding are not in effect. Email forwarding needs to be set up again when the domains are connected.
Brand display name: "AI Method". Address: aimethod.dev. Repo: AIScaleDev (name unchanged). Local: ~/code/aiscaledev. The site's code shows the name "AI Method" (site title, header, page titles, link-preview image); the pages' content is still the old template text until the site-pages redesign.
The blog collection (src/content/blog/, schema in src/content.config.ts) holds no posts. The existing pages are redesigned under the site-pages design.
Astro-only — the /contact form uses vanilla JS (no React), posting to Web3Forms.
Contact form: /contact. Access key placeholder in src/consts.ts (WEB3FORMS_ACCESS_KEY); form self-disables until a real key is set.
Analytics: Vercel Web Analytics via @vercel/analytics (<Analytics/> in BaseHead). Must be enabled in the Vercel dashboard for data to flow.
Default blog template is a placeholder; replace, don't extend.
Typeface: Inter only, matching Vercel's Next.js blog-starter (decided Jul 28 2026). Self-hosted via Astro's `fonts` config with `fontProviders.google()`; latin subset, variable 400-700. Replaced the template's Atkinson.

## LID
- Mode: Full
- Version: 1.4.5

## Linked-Intent Development (MANDATORY)

**Consult the `linked-intent-dev` skill for ALL code changes.** All changes flow through the arrow of intent in one direction:

```
HLD → LLDs → EARS → Tests → Code
```

- **All changes**: consult the `linked-intent-dev` skill if your harness provides it; otherwise read `docs/lid/workflow.md` before making changes, and if it is missing and `## LID` records no decline, offer the user once to add it from https://raw.githubusercontent.com/jszmajda/lid/v1.4.5/plugins/linked-intent-dev/skills/update-lid/references/workflow-doc.md (on decline, add `- Workflow doc: declined` to `## LID`). The workflow in one line: HLD check → LLD → EARS specs → edge audit → failing tests first → code — inspected at each phase.
- **Bug fixes**: walk the arrow like any other change — find where behavior diverged from intent and cascade from there. No short-circuit.

Each phase's output is inspected — by the user or an inspector they name — before the next begins; ambiguous spec readings go back to the user. **Docs carry current intent, written to be read cold** — write each doc as if authored fresh today, from current intent alone: no narration of how it changed, no meaning that needs the conversation that produced it, no rebuttals to questions only a past discussion raised. Rationale, considered alternatives, and constraints a fresh author would independently write stay; record rejected alternatives and why in the LLD's Decisions & Alternatives table, not as asides in body prose.

**Memory vs. intent.** Before saving durable project knowledge to agent or tool memory, test whether it is project *intent* — would a fresh agent, in any tool, next session, need it to build this system correctly? If yes, record it in the arrow (HLD / LLD / EARS / decision doc), which travels and cascades — not in private, per-tool memory, where intent escapes the arrow. Knowledge about the user or how they like to work stays in memory.

### Navigation

| What you need | Where to look |
|---|---|
| High-level design | `docs/high-level-design.md` |
| Design tree (sub-HLDs, LLDs, their specs) | `docs/intent/` — one folder per node |
| EARS specs | beside each design doc as `{node}-specs.md` in the node's folder under `docs/intent/` |
| Decision docs | `docs/decisions/` (project-level) and `docs/intent/<segment>/decisions/` |

### Terminology

- **HLD**: High-Level Design — single project-level doc at `docs/high-level-design.md`.
- **LLD**: Low-Level Design — detailed component design doc in `docs/intent/`. The design layer is a recursive tree: the root is the HLD, leaf LLDs own EARS, and a component deep enough to outgrow one doc becomes a sub-HLD (HLD-shaped, owns no EARS) with children beneath it. "HLD" and "LLD" are roles by position; depth-2 (one HLD over flat leaf LLDs) is the default.
- **EARS**: Easy Approach to Requirements Syntax — structured one-line requirements beside each design doc as `{node}-specs.md` in the node's folder under `docs/intent/`. IDs are path-concatenated — the root-to-leaf path of the owning segment plus a number — so a prefix grep gathers a subtree. Markers: `[x]` implemented, `[ ]` active gap, `[D]` deferred.
- **Arrow**: the unidirectional chain from vision to code (HLD → LLDs → EARS → Tests → Code). Strictly a DAG of intent.
- **Arrow segment**: the territory owned by one leaf LLD — the LLD itself plus the specs, tests, and code that cite its EARS IDs. The boundary is the leaf prefix. Within-segment cascade is free; across-segment cascade pauses.
- **Cascade**: propagating a change downstream through the arrow so adjacent levels stay coherent.

### Code annotations

Annotate code and tests with `@spec` comments citing EARS IDs:

```
// @spec AUTH-UI-001, AUTH-UI-002
```

Place the annotation at the *entry point of the behavior's implementation graph* — the topmost function or module owning the specified behavior, not every helper. When a behavior spans multiple subsystems (UI + API + database, for example), annotate at the entry point in each subsystem. Tests follow the same rule: annotate the test that directly exercises the spec, not every inner assertion.
