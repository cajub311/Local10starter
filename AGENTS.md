# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Local10starter is a Next.js 15 (App Router) web application for union workers, using TypeScript and Tailwind CSS. It is a single-service application with no external dependencies (no database, no Docker).

### Running services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Dev server | `npm run dev` | 3000 | Hot-reloads on file changes |

### Standard commands

All commands are documented in `package.json` scripts and `README.md`:

- **Dev**: `npm run dev`
- **Lint**: `npm run lint`
- **Test**: `npm test`
- **Build**: `npm run build`

### Gotchas

- `next lint` emits a deprecation warning about being removed in Next.js 16. This is cosmetic and does not affect linting correctness.
- The Jest config uses a `.js` file (not `.ts`) to avoid requiring `ts-node` as a dependency.
- The tsconfig `jsx` setting is `"preserve"` (Next.js convention), but Jest overrides it to `"react-jsx"` via `ts-jest` config for test compilation.
