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
      let whereClause = `WHERE type = $1`;
      const params: any[] = [type];

      if (search) {
        whereClause += ` AND (title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1} OR location ILIKE $${params.length + 1})`;
        params.push(`%${search}%`);
      }
      if (bedrooms) {
        whereClause += ` AND bedrooms = $${params.length + 1}`;
        params.push(parseInt(bedrooms, 10));
      }
      if (bathrooms) {
        whereClause += ` AND bathrooms = $${params.length + 1}`;
        params.push(parseInt(bathrooms, 10));
      }
      if (priceMin > 0) {
        whereClause += ` AND price >= $${params.length + 1}`;
        params.push(priceMin);
      }
      if (priceMax > 0) {
        whereClause += ` AND price <= $${params.length + 1}`;
        params.push(priceMax);
      }

      const countQuery = `SELECT COUNT(*) FROM "Property" ${whereClause}`;
      const countResult = await prisma.$queryRawUnsafe<{ count: string }[]>(countQuery, ...params);
      const totalItems = Number(countResult[0].count);
      const totalPages = Math.ceil(totalItems / limit);

      const selectQuery = `
        SELECT * FROM "Property" ${whereClause}
        ORDER BY "createdAt" DESC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `;
      params.push(limit, (page - 1) * limit);
      const properties = await prisma.$queryRawUnsafe(selectQuery, ...params);

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
      if (attempt === retries || !error.message.includes('prepared statement')) {
        console.error('API error:', error);
        return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
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