//app/api/properties/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  console.log('API route invoked: Supabase image integration with Prisma (updated 2025-05-09)');

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'SALE';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const search = searchParams.get('search') || '';
  const bedrooms = searchParams.get('bedrooms') || '';
  const bathrooms = searchParams.get('bathrooms') || '';
  const priceMin = searchParams.get('priceMin') || '';
  const priceMax = searchParams.get('priceMax') || '';

  console.log('API request received:', { type, page, limit, search, bedrooms, bathrooms, priceMin, priceMax });

  try {
    console.log('Checking database connection');
    await prisma.$connect();
    console.log('Database connection successful');

    const where: any = { type, availability: true };
    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (bedrooms) where.bedrooms = { equals: parseInt(bedrooms) };
    if (bathrooms) where.bathrooms = { equals: parseInt(bathrooms) };
    if (priceMin) where.price = { gte: parseInt(priceMin) };
    if (priceMax) where.price = { lte: parseInt(priceMax) };

    console.log('Executing database queries with where:', where);

    const total = await prisma.property.count({ where });
    const properties = await prisma.property.findMany({
      where,
      orderBy: { id: 'desc' },
      skip: (page - 1) * limit,
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
        slug: true,
        image: {
          select: {
            id: true,
            filepath: true,
            ismain: true,
          },
          orderBy: { ismain: 'desc' }, // Prioritize main image
        },
      },
    });

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return NextResponse.json({ error: 'Supabase configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate signed URLs for images
    const propertiesWithImages = await Promise.all(
      properties.map(async (property) => {
        if (!property.image.length) {
          console.log(`No images found for property ${property.id}`);
          return { ...property, images: [{ id: 'placeholder', url: '/api/placeholder/800/600' }] };
        }

        const imageUrls = await Promise.all(
          property.image.map(async (image) => {
            if (!image.filepath || image.filepath.includes('/api/placeholder')) {
              console.warn(`Invalid filepath for image ${image.id} of property ${property.id}`, { filepath: image.filepath });
              return { id: image.id, url: '/api/placeholder/800/600' };
            }

            // Use filepath as-is (e.g., images/properties/sale/house-1/front-1.jpg)
            const { data: signedData, error: signError } = await supabase.storage
              .from('properties')
              .createSignedUrl(image.filepath, 31536000); // 1 year

            if (signError || !signedData?.signedUrl) {
              console.error(`Error signing URL for image ${image.id}:`, signError?.message || 'No signed URL', { filepath: image.filepath });
              return { id: image.id, url: '/api/placeholder/800/600' };
            }

            return { id: image.id, url: signedData.signedUrl };
          })
        );

        console.log(`Images for property ${property.id}:`, imageUrls);
        return {
          ...property,
          images: imageUrls.length ? imageUrls : [{ id: 'placeholder', url: '/api/placeholder/800/600' }],
        };
      })
    );

    console.log('Database returned', properties.length, 'properties');
    console.log('API processing complete, returning response');

    return NextResponse.json({
      properties: propertiesWithImages,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}