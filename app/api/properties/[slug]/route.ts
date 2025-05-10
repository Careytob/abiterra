//app/api/properties/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getWatermarkedImageUrl } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        image: {
          select: { id: true, filepath: true, url: true, imagetype: true },
        },
        feature: true,
      },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const processedImages = await Promise.all(
      property.image.map(async (image) => {
        if (!image.filepath && !image.url) {
          console.warn(`[PropertiesAPI] No filepath or url for image ${image.id}`);
          return { ...image, url: '/images/fallback.jpg', type: image.imagetype };
        }

        const cleanPath = (image.filepath || image.url).startsWith('images/properties/')
          ? (image.filepath || image.url).substring('images/properties/'.length)
          : (image.filepath || image.url);

        const url = await getWatermarkedImageUrl('properties', cleanPath);
        return { ...image, url, type: image.imagetype };
      })
    );

    const response = {
      id: property.id,
      slug: property.slug,
      title: property.title,
      description: property.description,
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
      features: property.feature,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('[PropertiesAPI] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}