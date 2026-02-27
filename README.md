# SMART Local 10 — Emergency Dashboard

A mobile-first emergency rights dashboard for Minnesota Sheet Metal Workers (SMART Local 10). Designed for factory/shop floor workers scanning a hardhat QR code — big buttons, dark industrial theme, works with gloves.

## Features

- **Panic Dashboard** — 4-button grid for immediate action (Discipline, Unsafe Work, Text BA, Wages)
- **Weingarten Rights** — One-tap copy of the union representation script
- **Right to Refuse** — MN Statute 182.654 with one-tap MNOSHA call
- **MN Labor Laws** — Wage theft, sick time (ESST), overtime at a glance
- **Grievance Calculator** — Working-day deadline calculator (skips weekends)
- **Union Contacts** — One-tap call/text to Business Manager and MNOSHA
- **PWA** — Installable to home screen for offline access in shops with bad cell service

## Quick Start

```bash
npx serve .
```

Open [http://localhost:3000](http://localhost:3000) on your phone or browser.

## Files

| File | Purpose |
|------|---------|
| `index.html` | The entire dashboard — HTML + Tailwind + Vanilla JS |
| `manifest.json` | PWA manifest for home screen install |
| `sw.js` | Service worker for offline caching |

## Tech Stack

- **HTML5** + **Tailwind CSS** (CDN)
- **Vanilla JavaScript** (no frameworks)
- **PWA** (manifest.json + service worker)
