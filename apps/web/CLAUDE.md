# CLAUDE.md - @thirty/web

## Overview

React PWA mobile-first. Currently a skeleton (no src/, no components, no Vite config yet).

## Planned stack

- **UI**: React 19.2 + Tailwind 4.2
- **Bundler**: Vite 8
- **State/routing**: TanStack (Query, Router, Form, Table, Virtual)
- **Module system**: ESM native (`"type": "module"`)
- **Dependencies**: `@thirty/core` (business logic), `@thirty/shared` (enums, constants)

## Scripts

- `dev` - vite
- `build` - tsc --noEmit && vite build
- `preview` - vite preview
- `lint` - biome check .
- `check` - tsc --noEmit
- `test` - vitest
