---
name: standards
description: Git conventions, code formatting, TypeScript rules, and naming patterns for Thirty
license: MIT
metadata:
  author: thirty
  version: "1.0.0"
---

# Development Standards

Standards for the Thirty monorepo. Apply these to every commit, branch, and file.

## Git Conventions

### Branch Naming

```
<type>/<short-description>
```

| Type       | Purpose                              | Example                         |
|------------|--------------------------------------|---------------------------------|
| `feat`     | New feature                          | `feat/food-search`              |
| `fix`      | Bug fix                              | `fix/rolling-window-off-by-one` |
| `refactor` | Code restructure, no behavior change | `refactor/scoring-service-split` |
| `test`     | Adding or fixing tests               | `test/diversity-use-case`       |
| `docs`     | Documentation only                   | `docs/adr-009-auth-flow`        |
| `chore`    | Tooling, deps, CI                    | `chore/upgrade-prisma-7.1`      |
| `infra`    | Deployment, Coolify, Hetzner         | `infra/healthcheck-endpoint`    |

Rules:
- Lowercase, kebab-case after the `/`
- No issue number in branch name (use PR body instead)
- Max 50 characters for the description part
- Branch from `main`, merge via PR (no direct push to `main`)

### Commit Messages (Gitmoji)

Format:
```
<gitmoji> [<domain>] <imperative summary> (max 72 chars)

<optional body: explain WHY, not WHAT>
```

The `[domain]` scope is **required** and refers to the domain touched:

| Domain       | Scope                                      |
|--------------|--------------------------------------------|
| `scoring`    | Microbiome scoring engine (6 axes)         |
| `journal`    | Meal entries, food logs, daily aggregation |
| `diversity`  | 30-plant counter, rolling window           |
| `suggestion` | Contextual suggestions engine              |
| `shared`     | Shared enums, constants                    |
| `food-db`    | Curated food database, seed data           |
| `auth`       | Authentication, sessions, user profiles    |
| `infra`      | Config, tooling, CI/CD, monorepo setup     |
| `docs`       | Documentation, ADRs, CLAUDE.md             |
| `ui`         | Frontend components, styling, PWA          |

| Gitmoji | Code                      | When                                  |
|---------|---------------------------|---------------------------------------|
| ✨       | `:sparkles:`              | New feature                           |
| 🐛       | `:bug:`                   | Bug fix                               |
| ♻️       | `:recycle:`               | Refactor                              |
| ✅       | `:white_check_mark:`      | Add or update tests                   |
| 📝       | `:memo:`                  | Documentation                         |
| 🔧       | `:wrench:`                | Config files (biome, tsconfig, turbo) |
| ⬆️       | `:arrow_up:`              | Upgrade dependency                    |
| 🗃️       | `:card_file_box:`         | Prisma schema / migration             |
| 🏗️       | `:building_construction:` | Architecture change                   |
| 🎨       | `:art:`                   | Improve structure / format            |
| 🔥       | `:fire:`                  | Remove code or files                  |
| 🚀       | `:rocket:`                | Deploy / infra                        |
| 💄       | `:lipstick:`              | UI / styling                          |
| 🔒       | `:lock:`                  | Security fix                          |
| 🩹       | `:adhesive_bandage:`      | Simple non-critical fix               |

Examples:
```
✨ [diversity] Add rolling window plant counter

Tracks unique plants over a 7-day sliding window (ADR-004).
```
```
♻️ [scoring] Extract per-axis computation services

Split monolithic computeDailyScore into per-axis functions
for testability (ADR-002 compliance).
```
```
🗃️ [journal] Add FavoriteMeal model to Prisma schema
```
```
🔧 [infra] Add shared TypeScript configs
```
```
📝 [docs] Add CLAUDE.md for all packages
```

### PR Conventions

- Title: same format as commit (`<gitmoji> [<domain>] <imperative summary>`)
- Body must include:
  - **What**: 1-3 bullet points
  - **Why**: context / ADR reference if applicable
  - **How to test**: steps or automated test references
- One logical change per PR (not a grab bag)
- Squash merge to `main`

## Code Formatting (Biome 2.4)

The project uses Biome exclusively (no ESLint, no Prettier). Config lives in `/biome.json`.

| Rule               | Value         |
|--------------------|---------------|
| Indent style       | `space`       |
| Indent width       | `2`           |
| Line width         | `100`         |
| Quote style        | `single`      |
| Semicolons         | `always`      |
| Trailing commas    | `all`         |
| Organize imports   | `enabled`     |
| Linter rules       | `recommended` |

Run formatting:
```bash
pnpm format          # format entire monorepo
biome check .        # lint + format check (per-package)
```

Ignored paths: `node_modules`, `dist`, `.turbo`, `src/generated`.

## TypeScript Conventions

### Strict Mode (TS 6.0)

The base `tsconfig.base.json` enables:
- `strict: true` (default in TS 6.0)
- `noUncheckedIndexedAccess: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `exactOptionalPropertyTypes: true`
- `isolatedModules: true`

Never suppress with `@ts-ignore`. Use `@ts-expect-error` with a comment if absolutely necessary.

### Module System

- ESM everywhere (`"type": "module"` in package.json)
- Exception: `apps/api` uses CJS (NestJS 11 requirement, will migrate with NestJS 12)
- Always use `.js` extension in imports within `@thirty/core` and `@thirty/shared`:
  ```typescript
  import { computeWindowStart } from '../services/rolling-window.service.js';
  ```

### Enum Pattern

Never use TypeScript `enum`. Use the const-object-plus-type pattern:

```typescript
export const FoodCategory = {
  VEGETABLE: 'VEGETABLE',
  FRUIT: 'FRUIT',
  // ...
} as const;
export type FoodCategory = (typeof FoodCategory)[keyof typeof FoodCategory];
```

### Readonly by Default

All interfaces use `readonly` on every property:
```typescript
export interface MicrobiomeProfile {
  readonly solubleFiberScore: number;
  readonly insolubleFiberScore: number;
  // ...
}
```

Arrays use `readonly`:
```typescript
readonly uniquePlantIds: readonly string[];
```

Function parameters use `readonly` for arrays:
```typescript
export function scoreDayEntries(entries: readonly FoodLogEntry[]): readonly ScoredFoodLog[] {
```

### Type-only Imports

Use `import type` when importing only types:
```typescript
import type { FoodCategory, PreparationMethod } from '@thirty/shared';
import type { MicrobiomeProfile } from '../../scoring/value-objects/microbiome-profile.vo.js';
```

## Naming Conventions

### Files

| Artifact       | Suffix                        | Example                              |
|----------------|-------------------------------|--------------------------------------|
| Entity         | `.entity.ts`                  | `food-log.entity.ts`                 |
| Value Object   | `.vo.ts`                      | `microbiome-profile.vo.ts`           |
| Service        | `.service.ts`                 | `rolling-window.service.ts`          |
| Use Case       | `.use-case.ts`                | `score-day.use-case.ts`              |
| Repository     | `.repository.ts`              | `food-log.repository.ts`            |
| Test           | `.test.ts`                    | `rolling-window.service.test.ts`     |
| Constants      | plain `.ts`                   | `preparation-defaults.ts`            |
| In-memory repo | `in-memory-*.repository.ts`   | `in-memory-food-log.repository.ts`   |

### Exports

- Types/interfaces: `export type { ... }` via domain `index.ts`
- Functions: named exports, no default exports
- Classes: only for in-memory repositories (implementing interfaces)

### Variables and Functions

- `camelCase` for functions and variables
- `PascalCase` for types, interfaces, and classes
- `SCREAMING_SNAKE_CASE` for constants (`PREPARATION_DEFAULTS`, `SCORING_WEIGHTS`)
- No `I` prefix on interfaces: `FoodLogRepository`, not `IFoodLogRepository`

### Folders

- `kebab-case` for all folder names
- Domain folders: `entities/`, `value-objects/`, `repositories/`, `services/`, `use-cases/`, `constants/`
