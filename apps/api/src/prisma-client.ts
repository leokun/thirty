// =============================================================================
// Thirty - Prisma Client Instance (Prisma 7)
// =============================================================================
// Prisma 7 requires an explicit driver adapter.
// No more new PrismaClient() without arguments.
// =============================================================================

import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// The driver adapter manages the connection pool
// Prisma 7 delegates pooling to the native driver (pg)
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  // Pool config - in Prisma 7, the pg driver handles this,
  // not Prisma (unlike v6)
  pool: {
    max: 10,
    connectionTimeoutMillis: 5000, // Prisma 6 defaulted to 5s, pg defaults to 0
  },
});

export const prisma = new PrismaClient({ adapter });
