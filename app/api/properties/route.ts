import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: {
      id: 'asc',
      },
      include: {
      images: true, // Include related images
      },
    });

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
      { status: 500 },
    );
  }
}
