// app/api/supabase-image/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { siteConfig } from '@/lib/site-config';
import { createClient } from '@supabase/supabase-js';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  console.log('[API] Image route invoked (updated 2025-05-05)');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('[API] Missing Supabase credentials:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
    });
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    // Prepend 'images/' to the path
    const path = `images/${params.path.join('/')}`;
    console.log(`[API] Requested image path: ${path}`);

    // Test Supabase storage connection
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
      console.error('[API] Supabase storage connection failed:', listError.message);
      return NextResponse.redirect(new URL('/images/placeholder.jpg', siteConfig.url));
    }
    console.log('[API] Storage buckets:', buckets.map(b => b.name));

    // List files in 'images/' to debug
    const { data: files, error: filesError } = await supabase.storage
      .from('properties')
      .list('images', { limit: 10 });
    if (filesError) {
      console.error('[API] Error listing files in images/:', filesError.message);
    } else {
      console.log('[API] Files in images/:', files.map(f => f.name));
    }

    // Create signed URL
    const { data, error } = await supabase.storage
      .from('properties')
      .createSignedUrl(path, 31536000); // 1 year in seconds

    if (error) {
      console.error(`[API] Error creating signed URL: ${error.message}`, { path });
      return NextResponse.redirect(new URL('/images/placeholder.jpg', siteConfig.url));
    }

    if (!data?.signedUrl) {
      console.error('[API] No signed URL received from Supabase', { path });
      return NextResponse.redirect(new URL('/images/placeholder.jpg', siteConfig.url));
    }

    console.log('[API] Signed URL created:', data.signedUrl);
    return NextResponse.redirect(data.signedUrl);
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.redirect(new URL('/images/placeholder.jpg', siteConfig.url));
  }
}