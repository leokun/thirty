// =============================================================================
// Thirty — Prisma Client Instance (Prisma 7)
// =============================================================================
// Prisma 7 requiert un driver adapter explicite.
// Plus de new PrismaClient() sans argument.
// =============================================================================

import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Le driver adapter gère le pool de connexions
// Prisma 7 délègue le pooling au driver natif (pg)
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  // Config pool — en Prisma 7, c'est le driver pg qui gère,
  // pas Prisma (contrairement à v6)
  pool: {
    max: 10,
    connectionTimeoutMillis: 5000, // Prisma 6 avait 5s par défaut, pg a 0 par défaut
  },
});

export const prisma = new PrismaClient({ adapter });
