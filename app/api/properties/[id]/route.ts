// app/api/properties/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: {
        id: parseInt(params.id)
      },
      include: {
        images: true,
        features: true
      }
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Debug log the raw property data
    console.log('Raw property from database:', {
      id: property.id,
      latitude: property.latitude,
      longitude: property.longitude
    });

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
      area: property.area,
      images: property.images,
      feature: property.features
    };

    // Debug log the response
    console.log('Response being sent:', {
      id: response.id,
      latitude: response.latitude,
      longitude: response.longitude
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}