// =============================================================================
// @thirty/food-db - Curated food database
// =============================================================================
// ADR-003: 300-500 manually curated foods > 50,000 via external API.
// The value is in the quality of microbiome scoring, not quantity.
//
// Structure:
//   src/data/       -> YAML/JSON files per food category
//   src/validate.ts -> schema validator for food data
//   src/index.ts    -> typed export of the full database
// =============================================================================

// TODO: import and merge data by category
// export { foods } from './data/index.js';
// export { validateFood } from './validate.js';
