import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Singleton pattern for Prisma Client
// NOTE: In production we cache on global to prevent connection pool exhaustion.
// In development we always create a fresh client so schema changes are picked up
// immediately without needing a full process restart.
const globalForPrisma = global as unknown as { prisma: PrismaClient; pool: Pool };

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
}) as any;

if (process.env.NODE_ENV === 'production') {
  globalForPrisma.pool = pool;
  globalForPrisma.prisma = prisma;
}

export default prisma;
