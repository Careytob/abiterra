import { PrismaClient } from '../prisma/generated/client';

// Supabase's "Transaction pooler" (port 6543) runs PgBouncer in transaction mode, which
// breaks Prisma's prepared statements ("prepared statement \"s1\" already exists",
// Postgres error 42P05). Prisma needs `pgbouncer=true` in that case. Add it automatically
// so a pasted connection string "just works"; a string that already has it is left alone.
function resolveDatabaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;
  const viaTransactionPooler = /:6543(\/|\?|$)/.test(raw);
  if (!viaTransactionPooler || /[?&]pgbouncer=/.test(raw)) return raw;
  const sep = raw.includes('?') ? '&' : '?';
  const limit = /[?&]connection_limit=/.test(raw) ? '' : '&connection_limit=1';
  return `${raw}${sep}pgbouncer=true${limit}`;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const databaseUrl = resolveDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['warn', 'error'],
    ...(databaseUrl ? { datasources: { db: { url: databaseUrl } } } : {}),
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
