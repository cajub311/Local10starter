# AGENTS.md

## Cursor Cloud specific instructions

This repo has two products living on feature branches (the `main` branch is essentially empty):

### 1. Python CLI (`local10`)
- Shift-logging + overtime/pay calculator for union workers.
- **Install (dev):** `pip install -e . && pip install ruff pytest`
- **Lint:** `ruff check .`
- **Test:** `pytest`
- **Run:** `local10 --help` (entry point defined in `pyproject.toml` as `local10 = "local10.cli:app"`)
- Requires Python 3.12+. The system Python satisfies this.
- `~/.local/bin` must be on `PATH` for the `local10`, `ruff`, and `pytest` commands (user-installed pip scripts land there).

### 2. Emergency Dashboard (PWA)
- A single `index.html` file served statically. No build step, no npm dependencies.
- **Run dev server:** `python3 -m http.server 3000` from the repo root, then open `http://localhost:3000/index.html`.
- Uses Tailwind via CDN (external network needed on first load; has inline CSS fallback).

### Notes
- No external databases, APIs, or Docker required.
- CI (`.github/workflows/ci.yml`) runs `ruff check .` and `pytest` on Python 3.12.
