import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const type = searchParams.get('type') || 'SALE';
  const search = searchParams.get('search') || '';
  const bedrooms = searchParams.get('bedrooms') || '';
  const bathrooms = searchParams.get('bathrooms') || '';
  const priceMin = parseInt(searchParams.get('priceMin') || '0', 10);
  const priceMax = parseInt(searchParams.get('priceMax') || '0', 10);
  const retries = 3;
  const backoffFactor = 1000;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Check if property table exists
      interface TableCheck {
        exists: boolean;
      }
      const tableCheck = await prisma.$queryRaw<TableCheck[]>`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'property'
        );
      `;
      if (!tableCheck[0].exists) {
        throw new Error('property table does not exist');
      }

      let whereClause = `WHERE p.type = $1`;
      const params: any[] = [type];

      if (search) {
        whereClause += ` AND (p.title ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1} OR p.location ILIKE $${params.length + 1})`;
        params.push(`%${search}%`);
      }
      if (bedrooms) {
        whereClause += ` AND p.bedrooms = $${params.length + 1}`;
        params.push(parseInt(bedrooms, 10));
      }
      if (bathrooms) {
        whereClause += ` AND p.bathrooms = $${params.length + 1}`;
        params.push(parseInt(bathrooms, 10));
      }
      if (priceMin > 0) {
        whereClause += ` AND p.price >= $${params.length + 1}`;
        params.push(priceMin);
      }
      if (priceMax > 0) {
        whereClause += ` AND p.price <= $${params.length + 1}`;
        params.push(priceMax);
      }

      interface CountResult {
        count: string | number;
      }
      const countQuery = `SELECT COUNT(*) FROM "property" p ${whereClause}`;
      const countResult = await prisma.$queryRawUnsafe<CountResult[]>(countQuery, ...params);
      const totalItems = Number(countResult[0].count);
      const totalPages = Math.ceil(totalItems / limit);

      const selectQuery = `
        SELECT 
          p.id, p.title, p.slug, p.description, p.location, p.price, p.type, 
          p.availability, p.area, p.bathrooms, p.bedrooms, p.bq, p.city, 
          p.state, p.status, p.toilets, p.latitude, p.longitude, p.createdat, 
          p.updatedat, p.isfeatured, p.agentid,
          i.url AS image_url, i.id AS image_id
        FROM "property" p
        LEFT JOIN "image" i ON p.id = i.propertyid AND i.ismain = true
        ${whereClause}
        ORDER BY p.createdat DESC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `;
      params.push(limit, (page - 1) * limit);
      interface Property {
        id: string;
        title: string;
        image_url: string | null;
        [key: string]: any;
      }

      const properties = await prisma.$queryRawUnsafe<Property[]>(selectQuery, ...params);

      // Log image data for debugging
      console.log(`[${new Date().toISOString()}] Properties fetched:`, {
        count: properties.length,
        withImages: properties.filter((p: any) => p.image_url).length,
        sampleImageUrls: properties.slice(0, 3).map((p: any) => p.image_url),
      });

      return NextResponse.json({
        properties,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      });
    } catch (error: any) {
      console.error(`Attempt ${attempt}/${retries} failed:`, error);
      if (
        attempt === retries ||
        (!error.message.includes('prepared statement') && 
         !error.message.includes('property table does not exist') && 
         !error.message.includes('tsvector'))
      ) {
        console.error('API error:', error);
        return NextResponse.json(
          { error: error.message.includes('property table does not exist') 
              ? 'Database schema error: property table missing' 
              : error.message.includes('tsvector') 
              ? 'Database schema error: unsupported column type'
              : 'Failed to fetch properties' },
          { status: 500 }
        );
      }
      const backoffTime = attempt * backoffFactor;
      console.log(`Retrying in ${backoffTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    } finally {
      await prisma.$disconnect();
    }
  }

  return NextResponse.json({ error: 'Failed to fetch properties after retries' }, { status: 500 });
}