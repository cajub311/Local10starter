# Local 10 Member Hub — Deploy & Update Guide

## Changes Made (Feb 28, 2026)

- **Removed prevailing wage** — All prevailing wage dollar amounts and references removed from benefits.html
- **Fixed OSHA references** — Sharp Edges now shows full "OSHA 29 CFR 1910.138" (hand protection)
- **Updated vercel.json** — Simplified config with cleanUrls
- **Updated README** — Removed prevailing wage from benefits page description

## Deploy to Vercel

### Option 1: GitHub Auto-Deploy (Recommended)

If your repo `cajub311/Local10starter` is connected to Vercel:

1. **Merge the PR** — Go to https://github.com/cajub311/Local10starter/pull/new/cursor/website-content-and-deployment-e361 and create/merge the pull request
2. Vercel will auto-deploy when you push to the main/production branch
3. Your site will update at `local10starter.vercel.app`

### Option 2: Vercel CLI

```bash
# Install and login (one-time)
npm i -g vercel
vercel login

# Deploy from project root
cd /workspace
vercel --prod
```

### Option 3: Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **Local10starter** project
3. Click **Deployments** → **Redeploy** (or trigger from the connected Git branch)

## Where to Update Content

| Content | File |
|---------|------|
| Contract PDF | `contract.pdf` (in project root) |
| Steward phone | All HTML files — search for `612-428-8004` |
| Steward email | All HTML files — search for `gorillagrad9@gmail.com` |
| Union hall info | `meetings.html` |
| Meeting dates | `meetings.html` — "Next Meeting" card + schedule |
| Pay rates (contract) | `benefits.html` — Pay Estimator dropdown |
| PFML / benefits | `benefits.html` |
| Safety contacts | `safety.html` |

## Vercel Project Settings

If you need to change the Vercel project:

- **Root Directory:** Leave blank (or `.`) for this structure
- **Build Command:** None needed — static HTML
- **Output Directory:** Leave blank
- **Install Command:** None

## Prevailing Wage Note

Prevailing wage rates were removed per audit. Rates vary by project, county, and trade classification. For current rates, members should check: https://www.dli.mn.gov/business/employment-practices/prevailing-wage
