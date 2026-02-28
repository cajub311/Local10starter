# Local 10 Union Contract — Searchable Website

A clean, professional, fully responsive single-page website that makes the full union contract instantly accessible and easy to search. Built for union members.

## Quick Start

### 1. Replace contract.pdf with your real contract

- Delete or overwrite the placeholder `contract.pdf` in the repo root
- Save your actual union contract PDF as exactly **`contract.pdf`** (same folder as `index.html`)
- **Important:** Use a text-based PDF (not scanned images) for best searchability

### 2. Deploy to Vercel (recommended) or GitHub Pages

**Vercel:**
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Deploy — no build step needed, it's static HTML

**GitHub Pages:**
1. Push to GitHub
2. Settings → Pages → Source: Deploy from branch
3. Select `main` branch, root folder
4. Save

### 3. Done — QR code and search work automatically

After deploy, the QR code and all links will automatically point to your live PDF URL. Union members can:
- Scan the QR code with their phone to open the contract
- Use the built-in search (magnifier icon in the PDF viewer)
- Download, open in new tab, or copy the direct link

## Files

| File | Purpose |
|------|---------|
| `index.html` | Complete single-page website (Tailwind + QRCode.js via CDN) |
| `contract.pdf` | Your union contract — replace the placeholder with the real file |

## Features

- **Direct load** — Page opens straight to the PDF viewer, no splash screen
- **Searchable** — Mozilla PDF.js viewer with built-in search, highlights matches
- **Mobile-friendly** — Works great on phones
- **QR code** — Large 380×380px code, dynamically points to live PDF URL
- **Action buttons** — Download, Open in New Tab, Copy Link
- **Union aesthetic** — Red + navy, bold fonts, optional dark mode

