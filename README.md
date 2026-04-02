# Thirty

> Tracker alimentaire centré microbiote intestinal — PWA mobile-first

**Thirty** t'aide à nourrir ton microbiote. Logue tes repas, suis ta diversité alimentaire, et vise les 30 plantes par semaine.

## Pourquoi Thirty ?

Les apps de tracking alimentaire comptent les calories. Thirty score ton alimentation sur un axe complètement différent : **l'impact sur ton microbiote intestinal**.

- 🌱 **Compteur 30 plantes / semaine glissante** — l'objectif validé par l'American Gut Project
- 🧀 **Score microbiote global** — intègre plantes, fermentés, poissons gras, fromages affinés…
- 🔥 **Impact du mode de préparation** — cru, cuit, fermenté, lactofermenté, frit… le même aliment n'a pas le même score
- 💡 **Suggestions contextuelles** — règles métier transparentes, pas de ML opaque

## Stack

| Couche | Choix |
|---|---|
| Langage | TypeScript 6.0 |
| Frontend | React 19.2, Vite 8, Tailwind 4.2, TanStack |
| Backend | NestJS 11 → 12 |
| Base de données | PostgreSQL 17, Prisma 7 |
| Auth | Better Auth |
| Infra | Coolify sur VPS Hetzner |
| Monorepo | pnpm 11 + Turborepo 2.9 |
| Linting | Biome 2.4 |
| Tests | Vitest |

## Structure

```
thirty/
├── apps/
│   ├── web/              # React PWA (mobile-first)
│   └── api/              # NestJS API (pur HTTP adapter)
├── packages/
│   ├── shared/           # Types, interfaces, DTOs, validators Zod, enums, constantes
│   ├── db/               # Schema Prisma, client, migrations, seed data
│   ├── core/             # Logique métier, use cases, ports, adapters Prisma
├── docs/
│   ├── prd.md            # Product Requirements Document
│   ├── adr/              # Architecture Decision Records
│   └── diagrams/         # C4, domain model
└── ...config files
```

## Documentation

- [PRD — Product Requirements Document](./docs/prd.md)
- [ADR-001 — PostgreSQL vs MongoDB](./docs/adr/adr_001.md)
- [ADR-002 — Scoring par règles métier vs ML](./docs/adr/adr_002.md)
- [ADR-003 — Base aliments curatée vs API externe](./docs/adr/adr_003.md)
- [ADR-004 — Semaine glissante vs calendaire](./docs/adr/adr_004.md)
- [ADR-005 — Mode de préparation comme multiplicateur](./docs/adr/adr_005.md)
- [ADR-006 — Better Auth vs Passport.js](./docs/adr/adr_006.md)
- [ADR-007 — Coolify sur Hetzner vs Fly.io](./docs/adr/adr_007.md)
- [ADR-008 - Clean architecture DDD par domaine](./docs/adr/adr_008.md)
- [ADR-009 - Types dans shared, adapters dans core, package @thirty/db](./docs/adr/adr_009.md)

## Getting Started

```bash
# Prérequis : Node.js 24 LTS + Corepack
corepack enable pnpm

# Install
pnpm install

# Dev
pnpm dev
```

## Licence

MIT
