// =============================================================================
// Thirty — Prisma Config (Prisma 7)
// =============================================================================
// Prisma 7 sépare la config runtime (datasource URL, migrations)
// du schema (models, enums). Ce fichier remplace les env() dans schema.prisma.
// =============================================================================

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: env("DATABASE_URL"),
  },
});
