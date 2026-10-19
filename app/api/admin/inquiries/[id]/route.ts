// app/api/admin/inquiries/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import * as Sentry from '@sentry/nextjs';

const VALID_STATUSES = ['PENDING', 'REVIEWED', 'CONTACTED'];

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') return null;
  return session;
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { status } = await request.json();
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.update({
      where: { id: params.id },
      data: { status },
      include: { property: { select: { id: true, title: true, slug: true } } },
    });

    return NextResponse.json({ inquiry });
  } catch (err) {
    console.error('[AdminInquiriesAPI] Failed to update inquiry:', err);
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.inquiry.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[AdminInquiriesAPI] Failed to delete inquiry:', err);
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
