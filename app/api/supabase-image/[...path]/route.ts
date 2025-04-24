import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables are missing!');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const cacheControl = {
  'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200', // Cache for 1 hour, revalidate for 2 hours
  'CDN-Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200',
  'Vercel-CDN-Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  let fullPath = '';
  try {
    const resolvedParams = await params;
    fullPath = resolvedParams.path.join('/');
    console.log(`[SupabaseImage] Request for image path: ${fullPath}`);

    const imagePath = fullPath;

    // Generate signed URL (properties bucket is private, so skip public URL)
    const { data, error } = await supabase.storage
      .from('properties')
      .createSignedUrl(imagePath, 31536000); // 1-year expiry
    console.log(`[SupabaseImage] Signed URL result for ${imagePath}:`, {
      signedUrl: data?.signedUrl,
      error: error?.message,
    });

    if (error || !data?.signedUrl) {
      console.error(`[SupabaseImage] Signed URL error for ${imagePath}:`, error?.message);
      return NextResponse.redirect(new URL(`/api/placeholder/800/600`, request.url), {
        headers: {
          'Cache-Control': 'public, max-age=60', // Short cache for placeholders
        },
        status: 302,
      });
    }

    console.log(`[SupabaseImage] Redirecting to signed URL: ${data.signedUrl}`);
    return NextResponse.redirect(new URL(data.signedUrl), {
      headers: cacheControl,
      status: 302,
    });
  } catch (err) {
    console.error(`[SupabaseImage] Exception for ${fullPath}:`, err);
    return NextResponse.redirect(new URL(`/api/placeholder/800/600`, request.url), {
      headers: {
        'Cache-Control': 'public, max-age=60',
      },
      status: 302,
    });
  }
}