// =============================================================================
// Thirty - Prisma Client Instance (Prisma 7)
// =============================================================================
// Prisma 7 requires an explicit driver adapter.
// No more new PrismaClient() without arguments.
// =============================================================================

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });
