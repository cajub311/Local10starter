# Local 10 Member Hub

PWA resource portal for SMART Sheet Metal Workers Local 10 (Minnesota). Mobile-first, works offline, steward contact on every page.

## Pages
- **index.html** — Contract PDF, QR code, search chips, 2026 updates, quick links
- **grievances.html** — FAQs, deadlines, incident log, submit concern
- **safety.html** — Right to refuse, PPE, heat rules, emergency contacts
- **meetings.html** — Hall (1681 E Cope Ave, Maplewood), Matt Fairbanks, calendar
- **benefits.html** — Pay estimator, PFML, health/pension, member tools

## Tech
Pure HTML/CSS/JS. Tailwind via CDN. QRCode.js. No build tools. `manifest.json` + `service-worker.js` for PWA.

## Deploy (Vercel) + `.app` domain
- Import this GitHub repo into Vercel as a new project.
- **Framework preset**: Other
- **Build command**: None
- **Output directory**: `.`
- `vercel.json` handles routing (`/` → `index.html`).

### Add/Update your `.app` domain
- In Vercel: Project → Settings → Domains
- Add your domain (example: `local10starter.app`) and set it as **Primary**
- Follow Vercel’s DNS instructions at your domain registrar (common defaults):
  - Apex/`@` A record → `76.76.21.21`
  - `www` CNAME → `cname.vercel-dns.com`

### If phones still show an old cached page
This site is a PWA and can cache pages aggressively. If someone still sees an old “Prevailing Wage” page after you deploy:
- On Android Chrome: long-press the app icon → App info → Storage → **Clear data**
- Or in Chrome: Settings → Site settings → Storage → select the site → **Clear & reset**
- Then reload the site once while online (service worker will refresh).

## Union One
[Atlas Union Contract](union-one/atlas-union-contract.md) (CBA) in markdown.
