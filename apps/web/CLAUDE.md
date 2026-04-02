# CLAUDE.md - @thirty/web

## Overview

React 19.2 PWA mobile-first. Scaffolded with Vite 8, Tailwind 4.2, shadcn/ui, and TanStack ecosystem.

## Stack

- **UI**: React 19.2 + Tailwind 4.2 + shadcn/ui (New York style)
- **Bundler**: Vite 8
- **State/routing**: TanStack (Query, Router, Form, Table, Virtual)
- **Module system**: ESM native (`"type": "module"`)
- **Dependencies**: `@thirty/shared` (types, DTOs, enums, constants)

## Key paths

- `src/main.tsx` - createRoot + QueryClient + RouterProvider
- `src/router.tsx` - TanStack Router config
- `src/styles/globals.css` - Tailwind 4 + shadcn CSS variables
- `src/api/client.ts` - fetch wrapper
- `src/api/` - TanStack Query hooks (foods, journal, scores, favorites)
- `src/components/ui/` - shadcn generated components
- `src/components/layout/` - app shell, bottom nav
- `src/components/journal/` - day view, meal cards, score summary
- `src/components/log/` - food search, preparation picker, portion picker
- `src/components/favorites/` - favorite list, save dialog
- `src/routes/` - TanStack Router file-based routes

## Conventions

- Mobile-first: bottom nav, `dvh`, touch targets >= 44px
- shadcn/ui for base components, custom components compose on top
- TanStack Query for all data fetching (no direct fetch in components)
- Optimistic updates on quick-add, debounce 200ms on search
- Does NOT depend on `@thirty/core` or `@thirty/db` (only `@thirty/shared`)

## Scripts

- `dev` - vite
- `build` - tsc --noEmit && vite build
- `preview` - vite preview
- `lint` - biome check .
- `check` - tsc --noEmit
- `test` - vitest
