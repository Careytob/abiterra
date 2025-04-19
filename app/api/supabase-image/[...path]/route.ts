// app/api/supabase-image/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase environment variables are missing!');
  throw new Error('Supabase environment variables are missing!');
}

const supabase = createClient(supabaseUrl!, supabaseKey!);

// Cache response headers
const cacheControl = {
  'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
  'CDN-Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
  'Vercel-CDN-Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  let fullPath = '';
  try {
    // Await the params to resolve the dynamic route parameters
    const resolvedParams = await params;
    fullPath = resolvedParams.path.join('/');

    console.log(`Processing image request for: ${fullPath}`);

    // Use the full path as is (no cleaning needed)
    const imagePath = fullPath;

    // Try to get a public URL (bucket has public read access)
    const { data: publicData } = supabase.storage
      .from('properties')
      .getPublicUrl(imagePath);

    if (publicData?.publicUrl) {
      console.log(`Redirecting to public URL: ${publicData.publicUrl}`);
      return NextResponse.redirect(new URL(publicData.publicUrl), {
        headers: cacheControl,
        status: 302,
      });
    } else {
      console.error(`No public URL available for ${imagePath}`);
    }

    // Fallback to signed URL if public URL fails
    const { data, error } = await supabase.storage
      .from('properties')
      .createSignedUrl(imagePath, 7200);

    if (error || !data?.signedUrl) {
      console.error(`Signed URL error for ${imagePath}:`, error?.message || 'No signed URL returned');
      console.log(`Redirecting to placeholder for ${imagePath}`);
      return NextResponse.redirect(new URL(`/api/placeholder/800/600`, request.url), {
        headers: {
          'Cache-Control': 'public, max-age=60',
        },
        status: 302,
      });
    }

    console.log(`Redirecting to signed URL: ${data.signedUrl}`);
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