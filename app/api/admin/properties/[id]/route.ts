// app/api/admin/properties/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { supabaseServiceRole } from '@/lib/supabase';
import slugify from 'slugify';
import * as Sentry from '@sentry/nextjs';
import { propertyInputSchema } from '../schema';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return null;
  }
  return session;
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: { image: true, feature: true },
  });

  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  return NextResponse.json({ property });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existing = await prisma.property.findUnique({
    where: { id: params.id },
    include: { image: true },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
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

    // Only re-slugify if the title actually changed, so existing shared
    // links to this property keep working.
    let slug = existing.slug;
    if (slugify(data.title, { lower: true, strict: true }) !== slugify(existing.title, { lower: true, strict: true })) {
      const root = slugify(data.slug || data.title, { lower: true, strict: true });
      let candidate = root;
      let suffix = 1;
      while (
        await prisma.property.findFirst({
          where: { slug: candidate, NOT: { id: params.id } },
          select: { id: true },
        })
      ) {
        suffix += 1;
        candidate = `${root}-${suffix}`;
      }
      slug = candidate;
    }

    const submittedWithId = data.images.filter((img): img is typeof img & { id: string } => Boolean(img.id));
    const submittedIds = new Set(submittedWithId.map((img) => img.id));
    const imagesToRemove = existing.image.filter((img) => !submittedIds.has(img.id));
    const imagesToCreate = data.images.filter((img) => !img.id);
    const imagesToUpdate = submittedWithId;

    const property = await prisma.$transaction(async (tx) => {
      await tx.property.update({
        where: { id: params.id },
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
          updatedat: new Date(),
        },
      });

      await tx.feature.deleteMany({ where: { propertyid: params.id } });
      if (data.features.length > 0) {
        await tx.feature.createMany({
          data: data.features.map((name) => ({ name, propertyid: params.id })),
        });
      }

      if (imagesToRemove.length > 0) {
        await tx.image.deleteMany({ where: { id: { in: imagesToRemove.map((i) => i.id) } } });
      }
      for (const img of imagesToUpdate) {
        await tx.image.update({
          where: { id: img.id },
          data: { ismain: img.ismain },
        });
      }
      if (imagesToCreate.length > 0) {
        await tx.image.createMany({
          data: imagesToCreate.map((img) => ({
            url: img.url,
            filepath: img.filepath,
            imagetype: img.imagetype,
            ismain: img.ismain,
            propertyid: params.id,
            createdat: new Date(),
          })),
        });
      }

      return tx.property.findUnique({
        where: { id: params.id },
        include: { image: true, feature: true },
      });
    });

    // Best-effort cleanup of removed images from storage — never block the
    // response on this, a stray orphaned file isn't worth failing the save.
    if (imagesToRemove.length > 0) {
      const paths = imagesToRemove.map((i) => i.filepath).filter((p): p is string => Boolean(p));
      if (paths.length > 0) {
        supabaseServiceRole.storage.from('properties').remove(paths).catch((err) => {
          console.warn('[AdminPropertiesAPI] Failed to remove storage files:', err);
        });
      }
    }

    return NextResponse.json({ property });
  } catch (err) {
    console.error('[AdminPropertiesAPI] Failed to update property:', err);
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existing = await prisma.property.findUnique({
    where: { id: params.id },
    include: { image: true, inquiry: { select: { id: true }, take: 1 } },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  if (existing.inquiry.length > 0) {
    return NextResponse.json(
      {
        error:
          'This property has buyer inquiries attached to it and cannot be deleted. Mark it as SOLD or RENTED instead, or remove its inquiries first.',
      },
      { status: 409 }
    );
  }

  try {
    await prisma.property.delete({ where: { id: params.id } });

    const paths = existing.image.map((i) => i.filepath).filter((p): p is string => Boolean(p));
    if (paths.length > 0) {
      supabaseServiceRole.storage.from('properties').remove(paths).catch((err) => {
        console.warn('[AdminPropertiesAPI] Failed to remove storage files:', err);
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[AdminPropertiesAPI] Failed to delete property:', err);
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
