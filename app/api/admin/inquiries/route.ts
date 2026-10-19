// app/api/admin/inquiries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import * as Sentry from '@sentry/nextjs';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdat: 'desc' },
      include: { property: { select: { id: true, title: true, slug: true } } },
    });
    return NextResponse.json({ inquiries });
  } catch (err) {
    console.error('[AdminInquiriesAPI] Failed to list inquiries:', err);
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Failed to load inquiries' }, { status: 500 });
  }
}

// For leads that came in by phone, WhatsApp, or in person — lets an admin
// log them against a property so they show up in the same place as
// website-submitted inquiries.
export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, phone, message, propertyId } = body;

    if (!name || !email || !phone || !message || !propertyId) {
      return NextResponse.json(
        { error: 'name, email, phone, message, and propertyId are all required' },
        { status: 400 }
      );
    }

    const property = await prisma.property.findUnique({ where: { id: propertyId }, select: { id: true } });
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        message,
        propertyid: propertyId,
        userid: null,
        status: 'PENDING',
        createdat: new Date(),
      },
      include: { property: { select: { id: true, title: true, slug: true } } },
    });

    return NextResponse.json({ inquiry }, { status: 201 });
  } catch (err) {
    console.error('[AdminInquiriesAPI] Failed to create inquiry:', err);
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Failed to create inquiry' }, { status: 500 });
  }
}
