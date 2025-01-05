import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PropertyType } from '@prisma/client';
import { DEFAULT_COORDINATES } from '@/lib/constants';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    console.log('Query params:', { type, search, page, limit });

    const properties = await prisma.property.findMany({
      where: {
        type: type as PropertyType,
        ...(search ? {
          OR: [
            { location: { contains: search } },
            { title: { contains: search } }
          ]
        } : {})
      },
      take: limit,
      skip: (page - 1) * limit,
      include: { images: true }
    });

    const totalItems = await prisma.property.count();

    // Map properties with validated coordinates
    const mappedProperties = properties.map(p => {
      const latitude = p.latitude ? Number(p.latitude) : DEFAULT_COORDINATES.latitude;
      const longitude = p.longitude ? Number(p.longitude) : DEFAULT_COORDINATES.longitude;

      console.log(`Property ${p.id} coordinates:`, { latitude, longitude });

      return {
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        location: p.location,
        latitude,
        longitude,
        type: p.type,
        image: p.images[0]?.url || null,
        specs: {
          beds: p.bedrooms,
          baths: p.bathrooms,
          area: `${p.area}m²`
        }
      };
    });

    return NextResponse.json({
      properties: mappedProperties,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page * limit < totalItems,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}