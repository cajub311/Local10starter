# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

SMART Local 10 Emergency Dashboard — a single-page, mobile-first web app for Minnesota Sheet Metal Workers. Designed for shop floor workers scanning a hardhat QR code with dirty hands and work gloves.

The entire application lives in three files: `index.html` (HTML + Tailwind CDN + Vanilla JS), `manifest.json` (PWA), and `sw.js` (offline caching). There is no build step, no framework, and no npm dependencies.

### Running the dev server

```bash
python3 -m http.server 3000 --directory /workspace
```

Or: `npx serve -l 3000 .`

The app is at `http://localhost:3000/index.html`.

### Project structure

| File | Purpose |
|------|---------|
| `index.html` | Full dashboard — all HTML, CSS (Tailwind CDN), and JS inline |
| `manifest.json` | PWA manifest (theme `#cc1f1f`, standalone display, SVG icon) |
| `sw.js` | Service worker for offline caching |
| `package.json` | Minimal — only defines `dev`/`start` scripts (no dependencies) |

### Gotchas

- **No build step.** Tailwind is loaded from CDN. There is nothing to `npm install`.
- **Service worker caching.** After changing `index.html`, bump the `CACHE_NAME` version in `sw.js` to invalidate old caches.
- **Tailwind config is inline** in a `<script>` tag inside `index.html` (not a separate file).
- **All interactive elements are 60px+ tall** ("Greasy Hand" rule). Maintain this when adding new buttons or inputs.
- **COPY SCRIPT uses optimistic UI** — shows green "COPIED!" immediately, then copies to clipboard in background. This is intentional; the Clipboard API can be slow or fail on HTTP.
- **No lint or test commands.** There are no ESLint, Prettier, or test configurations. The project is pure HTML/CSS/JS with no tooling.
- **`serve` redirects `/index.html` to `/`.** When verifying with curl, check `http://localhost:3000/` (200) rather than `/index.html` (301 redirect).
