// app/api/agent/inquiries/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import * as Sentry from '@sentry/nextjs';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !['AGENT', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const inquiries = await prisma.inquiry.findMany({
      where: { property: { listedby: session.user.id } },
      orderBy: { createdat: 'desc' },
      include: { property: { select: { id: true, title: true, slug: true } } },
    });
    return NextResponse.json({ inquiries });
  } catch (err) {
    console.error('[AgentInquiriesAPI] Failed to list inquiries:', err);
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Failed to load inquiries' }, { status: 500 });
  }
}
