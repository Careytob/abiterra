import { DEFAULT_COORDINATES } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { property, property_type, property_status, image, feature, User } from "@prisma/client";
import { NextResponse } from "next/server";

// Define interfaces for our data structures
interface PropertyWithRelations extends property {
  images: image[];
  features: feature[];
  agent: {
    name: string;
    email: string;
    phone: string | null;
  };
}

interface SearchResponse {
  properties: MappedProperty[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters: {
    type: property_type | null;
    search: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    minArea: number | null;
    maxArea: number | null;
    city: string | null;
    state: string | null;
    features: string[] | null;
  };
}

interface MappedProperty {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  type: property_type;
  status: property_status;
  images: string[];
  specs: {
    beds: number;
    baths: number;
    toilets: number;
    bq: number;
    area: string;
    size: number;
  };
  features: string[];
  agent: {
    name: string;
    email: string;
    phone: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    console.log('Search Parameters:', Object.fromEntries(searchParams));

    // Extract and type search parameters
    const type = searchParams.get('type') as property_type | null;
    const search = searchParams.get('search')?.toLowerCase().trim() || null;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : null;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : null;
    const bedrooms = searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!, 10) : null;
    const bathrooms = searchParams.get('bathrooms') ? parseInt(searchParams.get('bathrooms')!, 10) : null;
    const minArea = searchParams.get('minArea') ? parseFloat(searchParams.get('minArea')!) : null;
    const maxArea = searchParams.get('maxArea') ? parseFloat(searchParams.get('maxArea')!) : null;
    const city = searchParams.get('city')?.toLowerCase() || null;
    const state = searchParams.get('state')?.toLowerCase() || null;
    const features = searchParams.get('features')?.split(',').filter(Boolean) || null;

    // Build the where clause
    const whereClause: any = {
      type,
      status: 'AVAILABLE' as property_status,
      availability: true,
      ...(minPrice !== null && { price: { gte: minPrice } }),
      ...(maxPrice !== null && { price: { lte: maxPrice } }),
      ...(bedrooms !== null && { bedrooms }),
      ...(bathrooms !== null && { bathrooms }),
      ...(minArea !== null && { area: { gte: minArea } }),
      ...(maxArea !== null && { area: { lte: maxArea } }),
      // If there's a search query, use Prisma's raw query capabilities
      ...(search && {
        AND: [
          {
            OR: [
              { city: { contains: search, mode: 'insensitive' } },
              { state: { contains: search, mode: 'insensitive' } },
              { location: { contains: search, mode: 'insensitive' } }
            ]
          }
        ]
      })
    };
    
    // Get total count for pagination
    const totalItems = await prisma.property.count({
      where: whereClause,
    });
    
    // Fetch properties from database with pagination and relations
    const properties = await prisma.property.findMany({
      where: whereClause,
      include: {
        images: true,
        features: true,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
    });

   // console.log(properties); // Log the fetched properties for debugging

    // Map properties to include agent details and other custom attributes
    const mappedProperties: MappedProperty[] = properties.map((property) => ({
      id: property.id,
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location,
      city: property.city,
      state: property.state,
      latitude: property.latitude || DEFAULT_COORDINATES.latitude,
      longitude: property.longitude || DEFAULT_COORDINATES.longitude,
      type: property.type,
      status: property.status,
      images: property.images.map((img) => img.url),
      specs: {
        beds: property.bedrooms,
        baths: property.bathrooms,
        toilets: property.toilets,
        bq: property.bq,
        area: `${property.area}m²`,
        size: property.area,
      },
      features: property.features.map((f) => f.name),
      agent: {
        name: "Carey Tobore", // You might want to fetch agent details from the database
        email: "careytobore@gmail.com", 
        phone: "+2348060198071",
      },
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    }));

    // Build the response object
    const response: SearchResponse = {
      properties: mappedProperties,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page * limit < totalItems,
        hasPreviousPage: page > 1,
      },
      filters: {
        type: type || null,
        search: search || null,
        minPrice,
        maxPrice,
        bedrooms,
        bathrooms,
        minArea,
        maxArea,
        city,
        state,
        features,
      },
    };

    return NextResponse.json(response); // Send back the JSON response

  } catch (error) {
    if (error instanceof Error) {
      console.error('Detailed API Error:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        cause: error.cause,
      });
  
      return NextResponse.json(
        {
          error: 'Failed to fetch properties',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        {
          status: 500,
        }
      );
    }
  
    console.error('An unknown error occurred:', error);
  
    return NextResponse.json(
      {
        error: 'Failed to fetch properties',
      },
      {
        status: 500,
      }
    );
  }
}
