import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  console.log('API route invoked: Temporary Supabase bypass version (updated 2025-05-05)');

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
      },
    });

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      throw new Error('Supabase configuration error');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch images for properties
    const propertiesWithImages = await Promise.all(
      properties.map(async (property) => {
        // Fetch images from Supabase storage
        const { data: images, error } = await supabase.storage
          .from('properties')
          .list(`images/${property.id}`, { limit: 10 });

        if (error) {
          console.error(`Error fetching images for property ${property.id}:`, error.message);
          return { ...property, images: [{ id: 'placeholder', url: '/api/placeholder/800/600' }] };
        }

        const imageUrls = await Promise.all(
          (images || []).map(async (image) => {
            const { data: signedData, error: signError } = await supabase.storage
              .from('properties')
              .createSignedUrl(`images/${property.id}/${image.name}`, 31536000);
            return {
              id: image.name,
              url: signError || !signedData?.signedUrl ? '/api/placeholder/800/600' : signedData.signedUrl,
            };
          })
        );

        return { ...property, images: imageUrls.length ? imageUrls : [{ id: 'placeholder', url: '/api/placeholder/800/600' }] };
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