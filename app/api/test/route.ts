// app/api/test/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const count = await prisma.property.count();
    return NextResponse.json({ message: 'Database connected', count });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Database connection failed' }, { status: 500 });
  }
}