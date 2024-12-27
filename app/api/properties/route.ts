import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // Get 'type' parameter (e.g., 'SALE' or 'RENT')

    // Validate and map the 'type' to the Prisma enum
    const typeFilter = type === 'SALE' || type === 'RENT' ? type : undefined;

    // Fetch properties from the database
    const properties = await prisma.property.findMany({
      where: typeFilter ? { type: typeFilter } : {}, // Use filter only if valid type is provided
      orderBy: {
        id: 'asc',
      },
      include: {
        images: true, // Include related images
      },
    });

    // Transform properties for the response
    const transformedProperties = properties.map((property) => ({
      id: property.id,
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location,
      type: property.type,
      // Use the first image as the main display image
      image: property.images.length > 0 ? property.images[0].url : null,
      specs: {
        beds: property.bedrooms,
        baths: property.bathrooms,
        area: `${property.area}m²`,
      },
    }));

    return NextResponse.json(transformedProperties);
  } catch (error) {
    console.error('Error in GET /api/properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
