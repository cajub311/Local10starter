# PROJECT_INDEX.md (Brain Map)

Cam’s workspace brain map. Keep this file up to date after major work is finished.

## What’s in the root

- `README.md`: Very short repo description.
- `PROJECT_INDEX.md`: This brain map (you’re reading it).
- `brain-preview.html`: Offline “brain viewer” (tabs + copy-all) for the brain map and rules.
- `.cursor/`: Cursor agent rules and long-term guardrails.

## Folders

- `.cursor/rules/`: Permanent rules for how the agent works in this repo.
  - `brain.mdc`: Memory + self-improvement loop + “keep the workspace clean”.
  - `union.mdc`: Union dashboard rules (mobile-first, glove-friendly, Charles #1).
  - `gamedev.mdc`: Simple HTML/JS game rules (fun, tiny, readable).
  - `style.mdc`: Plain-English responses + full ready-to-copy files + no clutter.

## Projects (current + planned)

### Union dashboards (Local 10)

- **Goal**: Simple, offline-friendly dashboards that work great on a phone at work.
- **Must-haves**:
  - Biggest red call button at the top for **Charles Grinstead (612-428-8004)**.
  - Big tap targets, high contrast, clean tabs.
  - One-tap call/text buttons, and QR codes for quick sharing.

**Next steps**
- Create the first dashboard as a single `index.html` in a clearly named folder (example: `dashboards/contacts/index.html`).
- Keep it offline-first (no build step, no server needed).

### Simple game dev (for breaks / learning)

- **Goal**: Tiny HTML5 + JS games. One folder per game. Easy to read.

**Next steps**
- Add a first super-simple phone-friendly game (example: `games/tap-game/index.html`).

