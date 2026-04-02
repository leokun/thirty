// =============================================================================
// @thirty/food-db — Base de données aliments curatée
// =============================================================================
// ADR-003 : 300-500 aliments curatés manuellement > 50 000 via API externe.
// La valeur est dans la qualité du scoring microbiote, pas la quantité.
//
// Structure :
//   src/data/       → fichiers YAML/JSON par catégorie d'aliments
//   src/validate.ts → validateur de schéma pour les données
//   src/index.ts    → export de la base complète typée
// =============================================================================

// TODO: importer et merger les données par catégorie
// export { foods } from './data/index.js';
// export { validateFood } from './validate.js';
