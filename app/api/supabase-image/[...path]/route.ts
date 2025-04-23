import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables are missing!');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const cacheControl = {
  'Cache-Control': 'public, max-age=300, stale-while-revalidate=600', // Cache for 5 minutes, revalidate for 10 minutes
  'CDN-Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
  'Vercel-CDN-Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  let fullPath = '';
  try {
    const resolvedParams = await params;
    fullPath = resolvedParams.path.join('/');

    const imagePath = fullPath;

    // Try public URL first
    const { data: publicData } = supabase.storage
      .from('properties')
      .getPublicUrl(imagePath);

    if (publicData?.publicUrl) {
      return NextResponse.redirect(new URL(publicData.publicUrl), {
        headers: cacheControl,
        status: 302,
      });
    }

    // Fallback to signed URL
    const { data, error } = await supabase.storage
      .from('properties')
      .createSignedUrl(imagePath, 3600); // 1-hour expiry

    if (error || !data?.signedUrl) {
      return NextResponse.redirect(new URL(`/api/placeholder/800/600`, request.url), {
        headers: {
          'Cache-Control': 'public, max-age=60', // Short cache for placeholders
        },
        status: 302,
      });
    }

    return NextResponse.redirect(new URL(data.signedUrl), {
      headers: cacheControl,
      status: 302,
    });
  } catch (err) {
    console.error(`Exception in supabase-image handler for ${fullPath}:`, err);
    return NextResponse.redirect(new URL(`/api/placeholder/800/600`, request.url), {
      headers: {
        'Cache-Control': 'public, max-age=60',
      },
      status: 302,
    });
  }
}