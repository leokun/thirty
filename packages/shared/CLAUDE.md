# CLAUDE.md - @thirty/shared

## Overview

Shared types, interfaces, DTOs, validators, enums, and constants used across all packages (`@thirty/core`, `@thirty/db`, `@thirty/api`, `@thirty/web`).

## Contents

### Enums (`src/enums/`)

- `FoodCategory`, `PreparationMethod`, `MealMoment`, `PortionSize`, `Trend`
- Implemented as `const` objects + extracted type (no native TS `enum`)

### Constants (`src/constants/`)

- `SCORING_WEIGHTS`, `WEEKLY_PLANT_GOAL`, `ROLLING_WINDOW_DAYS`

### Types & interfaces (`src/types/`)

Business types imported by core, db, api, and web:

- `MicrobiomeProfile`, `ComputedFoodScore`, `PreparationModifier` (scoring)
- `FoodLogEntry`, `MealData`, `DayData`, `ScoredFoodLog`, `DailyScoreBreakdown` (journal)
- `RollingWindowData`, `WeeklyDiversityResult` (diversity)
- `Suggestion`, `SuggestionCondition`, `SuggestionContext` (suggestion)

### DTOs (`src/dto/`)

Shared between NestJS (validation) and React (TanStack Query typing):

- `food.dto.ts` - `SearchFoodQuery`, `FoodResponse`, `RecentFoodResponse`
- `journal.dto.ts` - `CreateMealInput`, `AddFoodLogInput`, `QuickAddInput`, `MealResponse`, `DayResponse`
- `score.dto.ts` - `DailyScoreResponse`, `WeeklyDiversityResponse`
- `favorite.dto.ts` - `CreateFavoriteInput`, `FavoriteResponse`

### Validators (`src/validators/`)

Zod v4 schemas for input validation:

- `food-definition.schema.ts` - scores 0-5, preparations, months 1-12
- `meal-input.schema.ts` - CreateMealInput, AddFoodLogInput, QuickAddInput
- `search-query.schema.ts` - SearchFoodQuery
- `favorite-input.schema.ts` - CreateFavoriteInput

## Dependencies

- `zod` (v4) for validators
- No other external dependencies

## Conventions

- Enums as `const` objects + extracted type (no native TS `enum`)
- Types are the single source of truth: core, db, api, and web all import from here
- DTOs are shared between API and frontend (no duplication)
- ESM native (`"type": "module"`)
