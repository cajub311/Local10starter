# Local 10 Member Hub

PWA resource portal for SMART Sheet Metal Workers Local 10 (Minnesota). Mobile-first, works offline, steward contact on every page.

## Pages
- **index.html** — Contract PDF viewer, search chips, quick links
- **grievances.html** — FAQs, deadlines, incident log, submit concern form
- **safety.html** — Right to refuse, PPE, heat rules (expanded), emergency contacts
- **meetings.html** — Hall info, directions, calendar, member rights
- **benefits.html** — Pay estimator, PFML 2026, health/pension, apprentice scale
- **404.html** — Custom error page with nav

## Tech
Pure HTML/CSS/JS. Tailwind via CDN. QRCode.js for flyers. No build step. `manifest.json` + `service-worker.js` for offline PWA.

## Deploy
Hosted on Vercel. Push to main triggers auto-deploy. Config in `vercel.json`.

## Union One
[Atlas Union Contract](union-one/atlas-union-contract.md) (CBA) in markdown.
