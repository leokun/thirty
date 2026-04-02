# CLAUDE.md — Thirty

## Projet

Thirty est un tracker alimentaire centré microbiote intestinal, sous forme de PWA mobile-first.
L'objectif phare est d'aider l'utilisateur à atteindre 30 aliments végétaux différents par semaine glissante,
tout en scorant l'ensemble de son alimentation (y compris non-végétale) sur son impact microbiote.

## Stack technique

- **Langage** : TypeScript 6.0 (ESM natif, strict par défaut)
- **Runtime** : Node.js 24 LTS
- **Frontend** : React 19.2 + Vite 8 + Tailwind 4.2 + TanStack (Query, Router, Form, Table, Virtual)
- **Backend** : NestJS 11 (migration vers 12 ESM prévue Q3 2026)
- **BDD** : PostgreSQL 17 via Prisma 7 (driver adapter `PrismaPg`)
- **Auth** : Better Auth (`@thallesp/nestjs-better-auth`)
- **Monorepo** : pnpm 11 (local via Corepack) + Turborepo 2.9
- **Linting** : Biome 2.4
- **Tests** : Vitest + React Testing Library
- **Infra** : Coolify v4 sur VPS Hetzner CX22

## Architecture monorepo

```
apps/web        → React PWA mobile-first
apps/api        → NestJS API
packages/shared → Enums, constantes partagées (@thirty/shared)
packages/core   → Logique métier, clean archi DDD (@thirty/core)
packages/food-db → Base d'aliments curatée, seed data (@thirty/food-db)
```

## Conventions

- **ESM partout** sauf l'app NestJS (CJS en v11, ESM en v12)
- **Biome** pour le formatting et linting (pas d'ESLint/Prettier)
- **Prisma 7** : client généré dans `apps/api/src/generated/prisma`, driver adapter obligatoire
- **ADRs** dans `docs/adr/` — chaque décision technique est documentée
- **Core** : clean architecture DDD par domaine (scoring, journal, diversity, suggestion). Entities, VOs, use cases et ports purs dans `@thirty/core`. Repos in-memory pour les tests. Infrastructure Prisma/NestJS dans `apps/api`. Les interfaces métier (`MicrobiomeProfile`, `PreparationModifier`, `DailyScoreBreakdown`) vivent dans core, pas dans shared (ADR-008).
- **Scoring** : règles métier explicites, pas de ML (ADR-002). Le moteur de scoring vit dans `@thirty/core/domains/scoring`, pur TS, testable isolément.
- **Tests** : colocalisés (`*.test.ts` à côté du fichier testé). Scope unitaire strict : un test de use-case mock les repositories via les implémentations in-memory, un test de service ne teste que sa logique pure.
- **Base aliments** : curatée manuellement (300-500 aliments), qualité > quantité (ADR-003)
- **Commits** : toujours suivre les conventions gitmoji du skill `/standards` avant de commiter. Format : `<gitmoji> [<domain>] <imperative summary>`

## Domaine métier

### Scoring microbiote (6 axes, score sur 100)
1. Diversité végétale (25%) — compteur 30 plantes / semaine glissante
2. Fibres prébiotiques (20%) — inuline, FOS, GOS, amidon résistant
3. Aliments fermentés (20%) — végétaux ET animaux
4. Polyphénols (10%) — baies, thé, café, cacao
5. Soutien muqueux (15%) — oméga-3, collagène, zinc
6. Mode de préparation (10%) — bonus lactofermenté/cru, malus frit

### Mode de préparation
Un même aliment a un score différent selon sa préparation (ADR-005).
Système : score_base × facteur_préparation + bonus, avec override possible pour les fermentés.

### Semaine glissante
J-6 à J (pas calendaire). Pas de reset le lundi (ADR-004).

## Documentation

- PRD complet : `docs/prd.md`
- ADRs : `docs/adr/adr_001.md` à `adr_008.md`
- Schéma Prisma : `apps/api/prisma/schema.prisma`
