// app/api/properties/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'SALE';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const search = searchParams.get('search') || '';

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase environment variables are missing:', {
        supabaseUrl: !!supabaseUrl,
        supabaseKey: !!supabaseKey,
      });
      throw new Error('Supabase configuration is incomplete');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const skip = (page - 1) * limit;

    const where: any = {
      type: type.toUpperCase(),
      availability: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [properties, totalItems] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          location: true,
          latitude: true,
          longitude: true,
          type: true,
          bedrooms: true,
          bathrooms: true,
          area: true,
          images: {
            select: {
              id: true,
              url: true,
            },
            take: 1,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.property.count({ where }),
    ]);

    const formattedProperties = await Promise.all(
      properties.map(async (property) => {
        const formattedImages = await Promise.all(
          property.images.map(async (img) => {
            if (!img.url) return { id: img.id, url: `/api/placeholder/800/600` };

            const { data, error } = await supabase.storage
              .from('properties')
              .createSignedUrl(img.url, 7200);

            if (error || !data?.signedUrl) {
              console.error(`Signed URL error for ${img.url}:`, error?.message);
              return { id: img.id, url: `/api/placeholder/800/600` };
            }

            console.log(`Generated signed URL for ${img.url}: ${data.signedUrl}`);
            return { id: img.id, url: data.signedUrl };
          })
        );

        return {
          id: property.id,
          title: property.title,
          description: property.description,
          price: property.price,
          location: property.location,
          latitude: property.latitude,
          longitude: property.longitude,
          images: formattedImages,
          type: property.type === 'SALE' ? 'For Sale' : 'For Rent',
          specs: {
            area: property.area !== null ? `${property.area} sqft` : 'Not Available',
            beds: property.bedrooms || 0,
            baths: property.bathrooms || 0,
            size: property.area || 0,
          },
        };
      })
    );

    return NextResponse.json({
      properties: formattedProperties,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(totalItems / limit),
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}