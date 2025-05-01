import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  console.log('API route invoked: Temporary Supabase bypass version (deployed 2025-05-01)');

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'SALE';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const search = searchParams.get('search') || '';
  const bedrooms = searchParams.get('bedrooms') || '';
  const bathrooms = searchParams.get('bathrooms') || '';
  const priceMin = searchParams.get('priceMin') || '';
  const priceMax = searchParams.get('priceMax') || '';

  console.log('API request received:', { 
    type, page, limit, search, 
    bedrooms, bathrooms, priceMin, priceMax 
  });

  // Validate inputs
  if (isNaN(page) || page < 1) {
    console.error('Invalid page number:', page);
    return NextResponse.json({ error: 'Invalid page number' }, { status: 400 });
  }
  if (isNaN(limit) || limit < 1) {
    console.error('Invalid limit:', limit);
    return NextResponse.json({ error: 'Invalid limit' }, { status: 400 });
  }

  try {
    // Check database connection
    console.log('Checking database connection');
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection successful');

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

    if (bedrooms) {
      where.bedrooms = parseInt(bedrooms) <= 4 ? parseInt(bedrooms) : { gte: 4 };
    }

    if (bathrooms) {
      where.bathrooms = parseInt(bathrooms) <= 4 ? parseInt(bathrooms) : { gte: 4 };
    }

    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price.gte = parseFloat(priceMin);
      if (priceMax) where.price.lte = parseFloat(priceMax);
    }

    console.log('Executing database queries with where:', where);

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
          slug: true,
          image: {
            take: 1,
            select: {
              id: true,
              url: true,
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
      }),
      prisma.property.count({ where }),
    ]);

    console.log(`Database returned ${properties.length} properties`);

    const formattedProperties = properties.map(property => {
      const imageUrl = '/api/placeholder/800/600';
      return {
        id: property.id,
        title: property.title,
        description: property.description,
        price: property.price,
        location: property.location,
        latitude: property.latitude,
        longitude: property.longitude,
        slug: property.slug,
        images: [{ id: property.image[0]?.id || 'placeholder', url: imageUrl }],
        type: property.type === 'SALE' ? 'For Sale' : 'For Rent',
        specs: {
          area: property.area !== null ? `${property.area} sqft` : 'Not Available',
          beds: property.bedrooms || 0,
          baths: property.bathrooms || 0,
          size: property.area || 0,
        },
      };
    });

    console.log('API processing complete, returning response');

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
    console.error('[API] Error fetching properties:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch properties', details: errorMessage },
      { status: 500 }
    );
  }
}