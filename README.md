# Sheet Metal Workers Local 10 — PWA Resource Hub

A 5-page Progressive Web App (PWA) resource hub for Local 10 union members. Mobile-app-like, ultra-accessible, with share buttons on every page.

## Pages

| Page | Purpose |
|------|---------|
| **index.html** | Home — Union contract (searchable PDF), QR code, search chips, MN 2026 updates, share |
| **grievances.html** | Grievances & FAQs — 10 common issues, steward contact, submit concern, whistleblower info |
| **safety.html** | Safety & Worker Rights — OSHA/MN focus, right to refuse, hazards, emergency contacts |
| **meetings.html** | Meetings & Local Info — Hall, calendar, voting/jury duty rights, apprenticeship |
| **benefits.html** | Benefits & Resources — Health/pension, prevailing wages, MN PFML, meal/rest breaks |

## Quick Start

1. **Replace contract.pdf** with your real union contract (text-based PDF for searchability)
2. **Deploy** to Vercel or GitHub Pages — no build step
3. **Add to Home Screen** — PWA manifest enables "Add to Home Screen" on mobile

## Files

| File | Purpose |
|------|---------|
| `index.html` | Home / Contract |
| `grievances.html` | Grievances & FAQs |
| `safety.html` | Safety & Worker Rights |
| `meetings.html` | Meetings & Local Info |
| `benefits.html` | Benefits & Resources |
| `contract.pdf` | Union contract PDF |
| `manifest.json` | PWA manifest (Add to Home Screen) |
| `sw.js` | Service worker (offline caching) |
| `icon-192.png`, `icon-512.png` | PWA icons |

## Features

- **PWA** — manifest.json, service worker, Add to Home Screen
- **Mobile-first** — Hamburger nav, stacked buttons, touch-friendly
- **Accessible** — ARIA labels, high contrast (navy #0a1428, red #dc2626)
- **Share buttons** — WhatsApp, email, copy URL on every page
- **Search** — Nav search bar finds terms in contract PDF
- **8 search chips** — Pay Rates, Sick Time, Overtime, Vacation, Seniority, Benefits, Grievance, PPE

## Tech

Tailwind CDN + QRCode.js CDN only. No build tools. Single HTML files.

---

Informational only • Verify with rep • Updated Feb 2026 • [smw10.org](https://www.smw10.org/)
