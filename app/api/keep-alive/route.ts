import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'Database active' });
  } catch (error) {
    console.error('Keep-alive error:', error);
    return NextResponse.json({ error: 'Failed to ping database' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}