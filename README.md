# Bubblecraft — Bubble Development Agency Landing Page

A landing page for a specialist [Bubble](https://bubble.io) development agency, built as a static
site: no build step, no framework, no dependencies.

## Files

- `index.html` — page markup and copy
- `styles.css` — design system, layout, responsive rules, reduced-motion support
- `script.js` — nav, scroll reveal, counters, FAQ accordion, form validation, hero bubble canvas
- `favicon.svg` — brand mark
- `scripts/static-server.js` — local preview server (unchanged)

## Local Preview

```bash
pnpm dev
```

Default host and port come from `.env` when loaded externally, or from the server defaults
(`http://localhost:5173`).

## Docker

```bash
docker build -t bubblecraft-landing .
docker run --rm -p 5173:5173 bubblecraft-landing
```

## Notes

- The contact form is front-end only: it validates and confirms in the browser, then resets.
  Wire the `submit` handler in `script.js` to a form endpoint or CRM before going live.
- Content is placeholder copy for a fictional agency — swap names, prices, case studies and the
  `mailto:` address in `index.html` and `script.js` structured data.
