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
  const bedrooms = searchParams.get('bedrooms') || '';
  const bathrooms = searchParams.get('bathrooms') || '';
  const priceMin = searchParams.get('priceMin') || '';
  const priceMax = searchParams.get('priceMax') || '';

  console.log('API request:', { type, page, limit, search, bedrooms, bathrooms, priceMin, priceMax });

  // Validate inputs
  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: 'Invalid page number' }, { status: 400 });
  }
  if (isNaN(limit) || limit < 1) {
    return NextResponse.json({ error: 'Invalid limit' }, { status: 400 });
  }

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase environment variables are missing:', {
      supabaseUrl: !!supabaseUrl,
      supabaseKey: !!supabaseKey,
    });
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Test Supabase authentication
    const { error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('Supabase auth error:', authError.message);
      return NextResponse.json({ error: 'Unauthorized: Invalid Supabase credentials' }, { status: 401 });
    }

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
            where: {
              OR: [
                { ismain: true },
                { url: { contains: 'front-1', mode: 'insensitive' } },
              ],
            },
            orderBy: [
              { ismain: 'desc' },
              { url: 'desc' },
            ],
            select: {
              id: true,
              url: true,
            },
            take: 1,
          },
        },
        orderBy: {
          id: 'desc',
        },
      }),
      prisma.property.count({ where }),
    ]);

    console.log('Found properties:', properties.length, 'Total items:', totalItems);

    const formattedProperties = await Promise.all(
      properties.map(async (property) => {
        try {
          const formattedImages = await Promise.all(
            property.image.map(async (img) => {
              if (!img.url) {
                console.warn(`[API] No URL for image ID ${img.id} of property ${property.id}`);
                return { id: img.id, url: `/api/placeholder/800/600` };
              }

              try {
                let cleanPath = img.url;
                if (cleanPath.includes('://')) {
                  const urlObj = new URL(cleanPath);
                  const pathParts = urlObj.pathname.split('/');
                  const bucketIndex = pathParts.findIndex((p) => p === 'properties');
                  if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
                    cleanPath = pathParts.slice(bucketIndex + 1).join('/');
                  } else {
                    cleanPath = pathParts[pathParts.length - 1];
                  }
                } else {
                  cleanPath = cleanPath.replace(/^\//, '').split('?')[0];
                  if (cleanPath.startsWith('properties/')) {
                    cleanPath = cleanPath.substring('properties/'.length);
                  }
                }

                if (property.title.includes('Ikota')) {
                  console.log(`[Ikota Debug API] Property ID: ${property.id}, Clean Path: ${cleanPath}`);
                }

                const { data, error } = await supabase.storage
                  .from('properties')
                  .createSignedUrl(cleanPath, 31536000);

                if (error) {
                  console.error(`[API] Signed URL error for ${cleanPath} (property ${property.id}):`, error.message);
                  if (property.title.includes('Ikota')) {
                    console.log(`[Ikota Debug API] Signed URL Error: ${error.message}`);
                  }
                  return { id: img.id, url: `/api/placeholder/800/600` };
                }

                if (property.title.includes('Ikota')) {
                  console.log(`[Ikota Debug API] Signed URL: ${data.signedUrl}`);
                }
                return { id: img.id, url: data.signedUrl || `/api/placeholder/800/600` };
              } catch (err) {
                console.error(`[API] Error processing image ${img.url} for property ${property.id}:`, err);
                if (property.title.includes('Ikota')) {
                  console.log(`[Ikota Debug API] Processing Error:`, err);
                }
                return { id: img.id, url: `/api/placeholder/800/600` };
              }
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
            slug: property.slug,
            images: formattedImages,
            type: property.type === 'SALE' ? 'For Sale' : 'For Rent',
            specs: {
              area: property.area !== null ? `${property.area} sqft` : 'Not Available',
              beds: property.bedrooms || 0,
              baths: property.bathrooms || 0,
              size: property.area || 0,
            },
          };
        } catch (err) {
          console.error(`[API] Error formatting property ${property.id}:`, err);
          return null;
        }
      })
    );

    const validProperties = formattedProperties.filter((p) => p !== null);

    return NextResponse.json({
      properties: validProperties,
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