// app/api/admin/properties/route.ts
//
// Authenticated, ADMIN-only CRUD for properties. Access is enforced twice:
// `middleware.ts` blocks the request before it gets here, and we re-check
// the session below so this route is still safe if it's ever called from
// a context that bypasses middleware (e.g. server-to-server).
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import slugify from 'slugify';
import * as Sentry from '@sentry/nextjs';
import { propertyInputSchema } from './schema';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return null;
  }
  return session;
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base, { lower: true, strict: true });
  let candidate = root;
  let suffix = 1;
  // Small collision loop — property counts here are in the hundreds/low
  // thousands, so a linear findUnique check per attempt is fine.
  while (
    await prisma.property.findFirst({
      where: { slug: candidate, ...(ignoreId ? { NOT: { id: ignoreId } } : {}) },
      select: { id: true },
    })
  ) {
    suffix += 1;
    candidate = `${root}-${suffix}`;
  }
  return candidate;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdat: 'desc' },
      include: {
        image: { orderBy: { ismain: 'desc' } },
        feature: true,
        agent: { select: { id: true, name: true, email: true } },
      },
    });
    return NextResponse.json({ properties });
  } catch (err) {
    console.error('[AdminPropertiesAPI] Failed to list properties:', err);
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Failed to load properties' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
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
    const slug = data.slug ? await uniqueSlug(data.slug) : await uniqueSlug(data.title);

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
        isfeatured: data.isfeatured,
        agentid: data.agentid,
        publishstatus: 'PUBLISHED',
        image: {
          create: data.images.map((img) => ({
            url: img.url,
            filepath: img.filepath,
            imagetype: img.imagetype,
            ismain: img.ismain,
            createdat: new Date(),
          })),
        },
        feature: {
          create: data.features.map((name) => ({ name })),
        },
      },
      include: { image: true, feature: true },
    });

    return NextResponse.json({ property }, { status: 201 });
  } catch (err) {
    console.error('[AdminPropertiesAPI] Failed to create property:', err);
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
