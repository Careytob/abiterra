// app/api/agent/properties/route.ts
//
// Self-service listings for AGENT (and ADMIN) accounts, scoped to
// properties they personally submitted (`listedby`). New submissions
// always start as PENDING — only the admin moderation endpoints can
// publish or reject a listing.
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import slugify from 'slugify';
import * as Sentry from '@sentry/nextjs';
import { propertyInputSchema } from '@/app/api/admin/properties/schema';

async function requireAgent() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !['AGENT', 'ADMIN'].includes(session.user.role)) {
    return null;
  }
  return session;
}

async function uniqueSlug(base: string): Promise<string> {
  const root = slugify(base, { lower: true, strict: true });
  let candidate = root;
  let suffix = 1;
  while (await prisma.property.findFirst({ where: { slug: candidate }, select: { id: true } })) {
    suffix += 1;
    candidate = `${root}-${suffix}`;
  }
  return candidate;
}

export async function GET() {
  const session = await requireAgent();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const properties = await prisma.property.findMany({
      where: { listedby: session.user.id },
      orderBy: { createdat: 'desc' },
      include: { image: { orderBy: { ismain: 'desc' } }, feature: true },
    });
    return NextResponse.json({ properties });
  } catch (err) {
    console.error('[AgentPropertiesAPI] Failed to list properties:', err);
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Failed to load properties' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAgent();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = propertyInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid property data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;
    const slug = await uniqueSlug(data.slug || data.title);

    const property = await prisma.property.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        location: data.location,
        price: data.price,
        type: data.type,
        status: data.status,
        availability: data.availability,
        area: data.area ?? null,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        bq: data.bq,
        toilets: data.toilets,
        city: data.city,
        state: data.state,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        isfeatured: false, // only an admin can feature a listing on the homepage
        agentid: session.user.name || session.user.email || 'agent',
        listedby: session.user.id,
        publishstatus: 'PENDING',
        image: { create: data.images.map((img) => ({ ...img, createdat: new Date() })) },
        feature: { create: data.features.map((name) => ({ name })) },
      },
      include: { image: true, feature: true },
    });

    return NextResponse.json({ property }, { status: 201 });
  } catch (err) {
    console.error('[AgentPropertiesAPI] Failed to create property:', err);
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
