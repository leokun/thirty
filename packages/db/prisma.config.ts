// =============================================================================
// Thirty - Prisma Config (Prisma 7)
// =============================================================================
// Prisma 7 separates runtime config (datasource URL, migrations)
// from schema (models, enums). This file replaces env() in schema.prisma.
// =============================================================================

import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',

  migrations: {
    path: 'prisma/migrations',
  },

  datasource: {
    url: env('DATABASE_URL'),
  },
});
