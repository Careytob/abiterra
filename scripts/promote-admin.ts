// scripts/promote-admin.ts
//
// One-time bootstrap: there's no UI for creating the first admin (a user
// has to exist before anyone can be promoted), so this script grants a
// role to an existing account by email.
//
// Usage:
//   npx tsx scripts/promote-admin.ts you@example.com          # defaults to ADMIN
//   npx tsx scripts/promote-admin.ts agent@example.com AGENT
//
// The user must already have an account (sign up at /signup or sign in
// with Google first), then run this once.
import { PrismaClient } from '@/prisma/generated/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const role = (process.argv[3] || 'ADMIN').toUpperCase();

  if (!email) {
    console.error('Usage: npx tsx scripts/promote-admin.ts <email> [ADMIN|AGENT]');
    process.exit(1);
  }
  if (!['ADMIN', 'AGENT', 'USER'].includes(role)) {
    console.error('Role must be one of: ADMIN, AGENT, USER');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No user found with email ${email}. Sign up first, then run this script.`);
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { email },
    data: { role: role as 'ADMIN' | 'AGENT' | 'USER' },
  });

  const dashboard = role === 'ADMIN' ? '/admin' : role === 'AGENT' ? '/agent' : '/';
  console.log(`✅ ${updated.email} is now ${role}. They can sign in and visit ${dashboard}.`);
}

main()
  .catch((err) => {
    console.error('Failed to promote user:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
