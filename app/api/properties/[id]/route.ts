// app/api/properties/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { params } = context;
    const propertyId = parseInt(params.id, 10);

    if (isNaN(propertyId)) {
      return NextResponse.json({ error: 'Invalid property ID' }, { status: 400 });
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
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const processedImages = await Promise.all(
      property.images.map(async (image) => {
        if (!image.url) return { ...image, url: `/api/placeholder/800/600` };
        const { data, error } = await supabase.storage
          .from('properties')
          .createSignedUrl(image.url, 7200);
        if (error || !data?.signedUrl) {
          console.error(`Signed URL error for ${image.url}:`, error?.message);
          return { ...image, url: `/api/placeholder/800/600` };
        }
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

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}