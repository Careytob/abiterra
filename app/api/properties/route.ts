import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PropertyType } from '@prisma/client';

export async function GET(request: Request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    
    // Validate pagination parameters
    const validPage = page > 0 ? page : 1;
    const validLimit = limit > 0 && limit <= 50 ? limit : 12;
    const skip = (validPage - 1) * validLimit;

    // Validate and map the 'type' to the Prisma enum
    const typeFilter = type === 'SALE' || type === 'RENT' 
      ? type as PropertyType 
      : undefined;

    // Create where clause with proper typing
    const whereClause = typeFilter ? {
      type: typeFilter
    } : {};

    // Get total count for pagination
    const totalItems = await prisma.property.count({
      where: whereClause,
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / validLimit);

    // Fetch paginated properties
    const properties = await prisma.property.findMany({
      where: whereClause,
      orderBy: {
        id: 'asc',
      },
      include: {
        images: true,
      },
      skip,
      take: validLimit,
    });

    // Transform properties
    const transformedProperties = properties.map((property) => ({
      id: property.id,
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location,
      type: property.type,
      image: property.images.length > 0 ? property.images[0].url : null,
      specs: {
        beds: property.bedrooms,
        baths: property.bathrooms,
        area: `${property.area}m²`,
      },
    }));

    // Return paginated response
    return NextResponse.json({
      properties: transformedProperties,
      pagination: {
        currentPage: validPage,
        totalPages,
        totalItems,
        itemsPerPage: validLimit,
        hasNextPage: validPage < totalPages,
        hasPreviousPage: validPage > 1,
      },
    });

  } catch (error) {
    console.error('Error in GET /api/properties:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch properties',
        details: process.env.NODE_ENV === 'development' ? error : undefined 
      },
      { status: 500 }
    );
  }
}