// app/api/properties/[id]/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = parseInt(params.id, 10);

    if (isNaN(propertyId)) {
      return Response.json({ error: 'Invalid property ID' }, { status: 400 });
    }

    const property = await prisma.property.findUnique({
      where: {
        id: propertyId,
      },
      include: {
        images: true,
        features: true,
      },
    });

    if (!property) {
      return Response.json({ error: 'Property not found' }, { status: 404 });
    }

    const processedImages = await Promise.all(
      property.images.map(async (image) => {
        if (!image.url) return { ...image, url: '/placeholder-property.jpg' };
        const cleanPath = image.url.startsWith('/') ? image.url.substring(1) : image.url;
        const { data, error } = await supabase.storage
          .from('properties')
          .createSignedUrl(cleanPath, 31536000); // Removed transform
        if (error || !data?.signedUrl) {
          console.error(`[PropertiesAPI] Signed URL error for ${cleanPath}:`, error?.message);
          return { ...image, url: '/placeholder-property.jpg' };
        }
        console.log(`[PropertiesAPI] Generated signed URL for image ${image.id}: ${data.signedUrl}`);
        return { ...image, url: data.signedUrl };
      })
    );

    const response = {
      id: property.id,
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
      features: property.features,
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