# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Type-check-free production build (vite build) into dist/
npm run preview   # Preview the production build locally
```

```bash
npm run format       # Format all files with Prettier (semi: false, per .prettierrc)
npm run format:check # Check formatting without writing
```

There is no lint script and no test suite/framework configured in this repo. `tsc` is not run directly (`noEmit: true`, `build` uses Vite/esbuild for transpilation only) — type errors won't fail the build, so check `tsconfig.json` strictness manually if needed (`strict`, `noUnusedLocals`, `noUnusedParameters` are all on).

## Architecture

Dash and Dine is a **single-page vanilla TypeScript app** (no framework — no React/Vue) styled with Tailwind CSS v4, bundled by Vite.

- **`index.html`** contains all static markup, including empty containers (`#menu-root`, `#cart-root`, `#cart-items`, `#order-confirmation`) and the payment modal (`#pay-modal`). There is no client-side templating library — all dynamic content is built with `document.createElement` and injected via `.replaceChildren` in `src/index.ts`.
- **`src/index.ts`** is the entire application logic in one file: menu/cart state (plain arrays), rendering functions (`renderMenu`, `renderCart`), event delegation (click handlers attached to root containers like `#menu-root`/`#cart-root` rather than individual items, since items are re-rendered), the payment modal open/close/submit flow, and the dark-mode toggle. There is no module split by feature — new functionality is typically added directly to this file following the existing render-function + delegated-listener pattern.
- **`src/theme.ts`** is loaded as a separate `<script>` in `<head>` (before `index.ts`, before body paint) specifically to set the `dark` class on `<html>` from `localStorage`/`prefers-color-scheme` and avoid a flash of incorrect theme. The toggle _behavior_ (click handler, `aria-checked`, persisting to `localStorage`) lives in `index.ts`, not `theme.ts` — don't merge these; the split is intentional for load-order reasons.
- **Theming**: Tailwind v4's CSS-based config — there is no `tailwind.config.js`. Color tokens (`canvas`, `surface`, `ink`, `muted`, `line`, `accent`, `accent-foreground`, `focus`) are defined via `@theme` in `src/index.css`, with dark-mode overrides under a `.dark` class selector (toggled on `<html>`, not via `prefers-color-scheme` media query at the Tailwind level).
- **Icons**: Font Awesome is loaded via CDN `<link>` in `index.html`, not an npm package.
- **Deployment**: `.github/workflows/main.yml` builds and deploys `dist/` to GitHub Pages on push to `main`. Note the README also lists a Netlify live demo URL — confirm which target is current before assuming either is authoritative.

## README.md

Please read if you need more info: @README.md
