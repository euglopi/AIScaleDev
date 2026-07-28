# Design handoff prompt (Claude Design -> Claude Code -> Astro)

Paste the block below into claude.ai/design at the start of a design session for
aiscale.dev. It tells the designer what shape the output has to be in so it can be
implemented in this repo without a rewrite.

Keep it in sync with `astro.config.mjs`, `src/styles/global.css`, and AGENTS.md when
the stack changes.

---

You are designing for aiscale.dev, a static Astro site (blog plus consulting). Your
output will be implemented by Claude Code directly into the repo, so it has to hand off
cleanly. Follow these rules.

## Stack you are designing for

- Astro 7, static output. Pages are `.astro` files rendered to HTML at build time. No
  React, Vue, Svelte, or Next.js. There is no client-side router and no hydration by
  default.
- Tailwind CSS v4 through `@tailwindcss/vite`. There is no `tailwind.config.js` —
  theme tokens are CSS custom properties in a `@theme` block in `src/styles/global.css`.
- Content is MDX in `src/content/blog/`. Post frontmatter: `title`, `description`,
  `pubDate`, optional `updatedDate`, optional `heroImage`.
- One typeface: Inter, already self-hosted via Astro's font API and exposed as
  `var(--font-inter)`.
- Existing pieces: layout `src/layouts/BlogPost.astro`; components `BaseHead`, `Header`,
  `HeaderLink`, `Footer`, `FormattedDate`; pages `index.astro`, `about.astro`,
  `blog/index.astro`, `blog/[...slug].astro`.
- Routes: `/`, `/blog`, `/blog/<slug>`, `/about`, and `/work` (planned). The contact form
  on `/work` is the only interactive island allowed on the site.

## Deliverable format, per component or screen

1. One standalone `.html` file that opens in a browser with no build step and no network
   requests.
2. CSS in a single `<style>` block in that file. Tailwind utility classes in the markup
   are fine, but every utility must either exist in Tailwind v4 defaults or come from a
   token you declared.
3. A **props table**: name, type, required, default. This becomes the Astro `Props`
   interface, so use camelCase names and TypeScript types (`string`, `Date`,
   `ImageMetadata`, `'primary' | 'ghost'`).
4. A **slots** list: where child content goes, named slots included.
5. **Every state rendered on the page**, side by side and labelled, not described in
   prose: default, hover, focus-visible, active, disabled, loading, empty, error, and
   long-text overflow.
6. A **target path**: the exact repo path this becomes (`src/components/Foo.astro`,
   `src/layouts/...`, `src/pages/...`), and whether it replaces or extends a file that
   already exists.
7. One line per component saying whether it is pure markup and CSS, or needs JavaScript.

## Tokens

- Deliver tokens as one CSS block that can be pasted into `@theme` in
  `src/styles/global.css`. Custom properties only, never a JS config object.
- Name them the Tailwind v4 way: `--color-*`, `--font-*`, `--text-*`, `--spacing-*`,
  `--radius-*`, `--shadow-*`.
- Every color in the design must be a token. No one-off hex values in markup.
- Say which existing variables you are replacing. Current set: `--accent`,
  `--accent-dark`, `--black`, `--gray`, `--gray-light`, `--gray-dark`,
  `--gray-gradient`, `--box-shadow`.

## Hard constraints

- **No JavaScript unless the pattern is impossible without it.** Prefer `<details>`,
  `:target`, `popover`, `:has()`, and CSS transitions. If JS is unavoidable, say so
  explicitly, keep it under about 20 lines of vanilla JS, and label it "needs a
  `client:*` island" so the tradeoff is visible.
- **No external requests.** No CDN scripts or stylesheets, no Google Fonts `<link>`, no
  remote images, no icon-font packages, no analytics snippets.
- **Icons are inline SVG only**, drawn in the file, with `width`, `height`, and
  `aria-hidden="true"` when decorative.
- **Images** need real intrinsic `width` and `height` plus `alt`, so they can go through
  Astro's `<Image />`. Placeholders must be inline SVG or a solid token color, never a
  remote URL. No CSS `background-image` for content images.
- **Inter only**, weights 400 to 700, normal style. Reference `var(--font-inter)`; never
  add an `@font-face` rule or a second family.
- **Semantic HTML**: one `<h1>` per page, headings in order, `<nav>`, `<main>`,
  `<article>`, `<footer>`, real `<button>` and `<a>` (never a clickable `<div>`), and a
  `<label>` bound to every form control.
- **Accessibility floor**: text contrast at least 4.5:1 (3:1 for large text), a visible
  `:focus-visible` ring on every interactive element, touch targets at least 44 by 44
  px, `@media (prefers-reduced-motion: reduce)` for anything that animates, and no
  meaning carried by color alone.
- **Responsive**: show 375, 768, and 1280 px wide. Use Tailwind's default breakpoints
  only (sm 640, md 768, lg 1024, xl 1280). The reading column stays 720 px max.
- **Light mode only** unless dark mode is explicitly requested. If dark is in scope, use
  `prefers-color-scheme` with paired tokens rather than duplicated classes.
- **Real copy, never lorem ipsum.** Brand name is "AI Scale Dev". Nav is Blog, About,
  Work. Voice: firsthand notes on building AI software and agents, specific and drawn
  from real builds, no generic AI commentary.
- **Do not invent routes.** Every screen maps to a route listed above.
- **Do not fight the base stylesheet.** `src/styles/global.css` currently sets body at
  20 px with line-height 1.7, `h1` 3.052em, `h2` 2.441em, `-0.04em` letter-spacing on
  `h1`/`h2`, `.prose` paragraph rhythm, and link color from `--accent`. If the design
  changes any of those, list the change explicitly instead of papering over it with
  utility classes.

## Close every handoff with

- A file list mapping each design file to its target repo path.
- The `@theme` token block.
- A "diffs from current" list: each change needed in `global.css`, `Header`, `Footer`,
  or `BlogPost`, one line each.
- Any open question that needs a decision, as short bullets.

If the output is going into a design-system project that `/design-sync` will pull, start
each preview file with `<!-- @dsCard group="Components" -->` so it indexes as a card.
