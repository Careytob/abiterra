// app/api/agent/inquiries/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import * as Sentry from '@sentry/nextjs';

const VALID_STATUSES = ['PENDING', 'REVIEWED', 'CONTACTED'];

// Agents can update the status of enquiries on THEIR OWN listings (admins: any).
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !['AGENT', 'ADMIN'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const status = body?.status;
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const existing = await prisma.inquiry.findUnique({
      where: { id },
      select: { property: { select: { listedby: true } } },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    if (session.user.role !== 'ADMIN' && existing.property?.listedby !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { status },
      include: { property: { select: { id: true, title: true, slug: true } } },
    });
    return NextResponse.json({ inquiry });
  } catch (err) {
    console.error('[AgentInquiriesAPI] Failed to update inquiry:', err);
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}
