# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

SMART Local 10 Emergency Dashboard — a single-page, mobile-first web app for Minnesota Sheet Metal Workers. The entire application lives in `index.html` (HTML + Tailwind CDN + Vanilla JS), `manifest.json` (PWA), and `sw.js` (offline caching). There is no build step, no framework, and no external dependencies.

### Running the dev server

```bash
npx serve -l 3000 .
```

This serves static files from the repo root. The app is at `http://localhost:3000`.

### Project structure

| File | Purpose |
|------|---------|
| `index.html` | Full dashboard — all HTML, CSS (Tailwind CDN), and JS inline |
| `manifest.json` | PWA manifest (theme color, icons, display mode) |
| `sw.js` | Service worker for offline caching |
| `package.json` | Minimal — only defines the `dev`/`start` scripts |

### Gotchas

- **No build step.** Tailwind is loaded from CDN (`cdn.tailwindcss.com`). There is no `npm install` needed for the app itself — only `npx serve` for the dev server.
- **No linter configured.** The project is intentionally vanilla HTML/JS with no framework or build tooling. If adding a linter, use standalone ESLint or HTMLHint.
- **Service worker caching.** After changing `index.html`, bump the `CACHE_NAME` version in `sw.js` to invalidate old caches.
- **Tailwind config is inline** in a `<script>` tag inside `index.html` (not a separate config file) to keep the single-file architecture.
- **All interactive elements are 60px+ tall** ("Greasy Hand" rule for gloved workers). Maintain this when adding new buttons or inputs.
