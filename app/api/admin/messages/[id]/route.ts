// app/api/admin/messages/[id]/route.ts
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

    const message = await prisma.contact.update({
      where: { id: Number(params.id) },
      data: { status: status as 'PENDING' | 'REVIEWED' | 'CONTACTED' },
    });

    return NextResponse.json({ message });
  } catch (err) {
    console.error('[AdminMessagesAPI] Failed to update message:', err);
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.contact.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[AdminMessagesAPI] Failed to delete message:', err);
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
