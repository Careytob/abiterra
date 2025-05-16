// app/api/properties/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as Sentry from '@sentry/nextjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'SALE';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const search = searchParams.get('search') || '';
  const bedrooms = searchParams.get('bedrooms') || '';
  const bathrooms = searchParams.get('bathrooms') || '';
  const priceMin = parseInt(searchParams.get('priceMin') || '0', 10);
  const priceMax = parseInt(searchParams.get('priceMax') || '0', 10);

  if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
    return NextResponse.json({ error: 'Invalid page or limit' }, { status: 400 });
  }

  try {
    console.log(`[PropertiesAPI] Fetching properties:`, { type, page, limit, search, bedrooms, bathrooms, priceMin, priceMax });

    let query = supabase
      .from('property')
      .select(
        'id, title, slug, price, type, location, bedrooms, bathrooms, area, city, state, status, toilets, latitude, longitude, createdat, updatedat, isfeatured, agentid',
        { count: 'exact' }
      )
      .eq('type', type)
      .order('createdat', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (search) {
      query = query.ilike('title', `%${search}%`).or(`location.ilike.%${search}%`);
    }
    if (bedrooms) {
      query = query.eq('bedrooms', parseInt(bedrooms, 10));
    }
    if (bathrooms) {
      query = query.eq('bathrooms', parseInt(bathrooms, 10));
    }
    if (priceMin) {
      query = query.gte('price', priceMin);
    }
    if (!isNaN(priceMax) && priceMax > 0) {
      query = query.lte('price', priceMax);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error(`[PropertiesAPI] Supabase error:`, {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      Sentry.captureException(error, {
        extra: { type, page, limit, search, bedrooms, bathrooms, priceMin, priceMax },
      });
      return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
    }

    if (!data) {
      console.warn(`[PropertiesAPI] No data returned from Supabase`);
      return NextResponse.json({ properties: [], total: 0, pagination: { pages: 0 } }, { status: 200 });
    }

    // Fetch images for each property
    const properties = await Promise.all(
      data.map(async (prop: any) => {
        let imageUrl = '/api/placeholder/800/600';
        let imagePath = '';

        // Fetch main image from image table
        const { data: images, error: imageError } = await supabase
          .from('image')
          .select('url, filepath')
          .eq('propertyid', prop.id)
          .eq('ismain', true)
          .single();

        if (imageError || !images?.url) {
          console.warn(`[PropertiesAPI] Failed to fetch image for property ${prop.id}:`, imageError?.message);
          Sentry.captureException(imageError, {
            extra: { propertyId: prop.id },
          });
        } else {
          imagePath = images.filepath || images.url;
          if (typeof imagePath !== 'string' || !imagePath.startsWith('images/') || imagePath.endsWith('/')) {
            console.warn(`[PropertiesAPI] Invalid image path for property ${prop.id}:`, imagePath);
            Sentry.captureMessage(`Invalid image path for property ${prop.id}`, {
              level: 'warning',
              extra: { propertyId: prop.id, imagePath },
            });
          } else {
            const { data: signedData, error: signedError } = await supabase.storage
              .from('properties')
              .createSignedUrl(imagePath, 60);
            if (signedError || !signedData?.signedUrl) {
              console.warn(`[PropertiesAPI] Failed to generate signed URL for property ${prop.id}:`, signedError?.message);
              Sentry.captureException(signedError, {
                extra: { propertyId: prop.id, imagePath },
              });
            } else {
              imageUrl = signedData.signedUrl;
            }
          }
        }

        return {
          ...prop,
          images: imagePath ? [{ id: `img-${prop.id}`, url: imageUrl }] : [],
        };
      })
    );

    const total = count || data.length;
    const pages = Math.ceil(total / limit);

    console.log(`[PropertiesAPI] Successfully fetched properties:`, { count: properties.length, total, pages });

    return NextResponse.json({
      properties,
      total,
      pagination: { pages },
    });
  } catch (err) {
    console.error(`[PropertiesAPI] Unexpected error:`, {
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
    });
Sentry.captureException(err, {
  extra: { type, page, limit, search, bedrooms, bathrooms, priceMin, priceMax },
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}