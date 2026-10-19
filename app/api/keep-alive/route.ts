import { PrismaClient } from '@/prisma/generated/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Execute a single lightweight query to keep the connection alive
    await prisma.$queryRaw`SELECT 1 AS result`;
    return NextResponse.json({ status: 'success', message: 'Keep-alive ping successful' });
  } catch (error: any) {
    console.error('Keep-alive error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Keep-alive ping failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}