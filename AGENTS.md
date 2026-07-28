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

## Project: AIScale.dev
Blog + consulting site. Astro static, MDX, Tailwind.
Blog subject: firsthand AI software and agent engineering learnings. Specific, from real builds. No generic AI commentary.
Deploy: Vercel. DNS: Cloudflare, DNS-only (grey cloud, no proxy) so Vercel terminates SSL. With grey cloud the Cloudflare SSL/TLS mode does not apply. LIVE at https://aiscale.dev since Jul 28 2026 (Let's Encrypt cert via Vercel).
Apex aiscale.dev belongs to the blog. The Short.io link shortener moves to a subdomain (decided Jul 28 2026).
Vercel DNS targets (Jul 28 2026): CNAME @ -> e364c7306bdf607c.vercel-dns-017.com and CNAME www -> e364c7306bdf607c.vercel-dns-017.com, both proxy off. www redirects to apex (308) in Vercel.
Never touch the 3 route*.mx.cloudflare.net MX records or the v=spf1 TXT record: that is live email forwarding.
Brand display name: "AI Scale Dev" (with spaces). Domain/URL stays aiscale.dev. Repo: AIScaleDev. Local: ~/code/aiscaledev.
Posts: src/content/blog/*.mdx, schema in src/content.config.ts.
Astro-only — no React islands except a contact form on /work.
Homepage = positioning, not a post feed.
Default blog template is a placeholder; replace, don't extend.
Typeface: Inter only, matching Vercel's Next.js blog-starter (decided Jul 28 2026). Self-hosted via Astro's `fonts` config with `fontProviders.google()`; latin subset, variable 400-700. Replaced the template's Atkinson.
