// app/api/admin/properties/[id]/moderate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import * as Sentry from '@sentry/nextjs';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { action, rejectionreason } = await request.json();
    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: "action must be 'approve' or 'reject'" }, { status: 400 });
    }

    const property = await prisma.property.update({
      where: { id: params.id },
      data:
        action === 'approve'
          ? { publishstatus: 'PUBLISHED', rejectionreason: null }
          : { publishstatus: 'REJECTED', rejectionreason: rejectionreason || null },
    });

    return NextResponse.json({ property });
  } catch (err) {
    console.error('[AdminModerationAPI] Failed to moderate property:', err);
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}
