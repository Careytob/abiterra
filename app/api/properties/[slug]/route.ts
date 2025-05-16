//app/api/properties/[slug]/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
        image: true,
        feature: true,
      },
    });

    if (!property) {
      return Response.json({ error: 'Property not found' }, { status: 404 });
    }

    const processedImages = await Promise.all(
      property.image.map(async (image) => {
        if (!image.filepath) return { ...image, url: '/placeholder-property.jpg', type: image.imagetype };
        const { data, error } = await supabase.storage
          .from('properties')
          .createSignedUrl(image.filepath, 31536000);
        if (error || !data?.signedUrl) {
          console.error(`[PropertiesAPI] Signed URL error for ${image.filepath}:`, error?.message);
          return { ...image, url: '/placeholder-property.jpg', type: image.imagetype };
        }
        return { ...image, url: data.signedUrl, type: image.imagetype };
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

    return Response.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('[PropertiesAPI] Error:', error);
    return Response.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}