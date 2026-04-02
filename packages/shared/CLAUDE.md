# CLAUDE.md - @thirty/shared

## Overview

Minimal shared package: enums and constants used across `@thirty/core`, `@thirty/api`, and `@thirty/web`.

## Contents

Single barrel file `src/index.ts` exporting:

- **Enums**: `FoodCategory`, `PreparationMethod`, `MealMoment`, `PortionSize`, `Trend`
- **Constants**: `SCORING_WEIGHTS`, `WEEKLY_PLANT_GOAL`, `ROLLING_WINDOW_DAYS`

## Conventions

- Enums are implemented as `const` objects + extracted type (no native TS `enum`)
- Keep this package minimal: only truly shared primitives belong here
- Complex business interfaces live in `@thirty/core` (ADR-008)
- No DTOs here - API-specific types stay in `apps/api`
- ESM native (`"type": "module"`)
