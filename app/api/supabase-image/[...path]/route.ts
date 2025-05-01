// app/api/supabase-image/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  // Get the Supabase credentials from environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the path from params
    const path = params.path.join('/');
    console.log(`[API] Requested image path: ${path}`);

    // Create a signed URL with 1 year expiration
    const { data, error } = await supabase.storage
      .from('properties')
      .createSignedUrl(path, 31536000); // 1 year in seconds

    if (error) {
      console.error(`[API] Error creating signed URL: ${error.message}`);
      return NextResponse.redirect('/api/placeholder/800/600');
    }

    if (!data?.signedUrl) {
      console.error('[API] No signed URL received from Supabase');
      return NextResponse.redirect('/api/placeholder/800/600');
    }

    // Redirect to the signed URL
    return NextResponse.redirect(data.signedUrl);
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.redirect('/api/placeholder/800/600');
  }
}