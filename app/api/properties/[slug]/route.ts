// app/api/properties/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import * as Sentry from '@sentry/nextjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log(`[PropertiesAPI] Fetching property for slug: ${params.slug}`);

    const property = await prisma.property.findUnique({
      where: { slug: params.slug },
      include: {
        image: { select: { id: true, url: true, filepath: true, imagetype: true } },
        feature: { select: { id: true, name: true } },
      },
    });

    if (!property) {
      console.warn(`[PropertiesAPI] Property not found for slug: ${params.slug}`);
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const processedImages = await Promise.all(
      (property.image || []).map(async (image) => {
        if (!image.filepath || typeof image.filepath !== 'string') {
          console.warn(`[PropertiesAPI] Invalid filepath for image:`, image);
          return {
            id: image.id,
            url: '/placeholder-property.jpg',
            filepath: image.filepath,
            imagetype: image.imagetype,
          };
        }

        try {
          const { data, error } = await supabase.storage
            .from('properties')
            .createSignedUrl(image.filepath, 3600); // Reduced to 1 hour
          if (error || !data?.signedUrl) {
            console.error(`[PropertiesAPI] Signed URL error for ${image.filepath}:`, error?.message);
            Sentry.captureException(error, { extra: { filepath: image.filepath, slug: params.slug } });
            return {
              id: image.id,
              url: '/placeholder-property.jpg',
              filepath: image.filepath,
              imagetype: image.imagetype,
            };
          }
          return {
            id: image.id,
            url: data.signedUrl,
            filepath: image.filepath,
            imagetype: image.imagetype,
          };
        } catch (err) {
          console.error(`[PropertiesAPI] Error generating signed URL for ${image.filepath}:`, err);
          Sentry.captureException(err, { extra: { filepath: image.filepath, slug: params.slug } });
          return {
            id: image.id,
            url: '/placeholder-property.jpg',
            filepath: image.filepath,
            imagetype: image.imagetype,
          };
        }
      })
    );

    const response = {
      id: property.id,
      slug: property.slug,
      title: property.title,
      description: property.description || '',
      price: property.price,
      location: property.location,
      latitude: property.latitude,
      longitude: property.longitude,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      toilets: property.toilets,
      bq: property.bq,
      area: property.area !== null ? `${property.area} sqft` : 'Not Available',
      images: processedImages,
      features: property.feature.map((f) => ({ id: f.id, name: f.name })),
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('[PropertiesAPI] Error:', error);
    Sentry.captureException(error, { extra: { slug: params.slug } });
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}