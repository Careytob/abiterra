// app/api/blog-images/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      console.error('Image path missing in request');
      return NextResponse.json(
        { error: 'Image path is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .storage
      .from('properties')
      .createSignedUrl(path, 7200);

    if (error) {
      console.error(`Supabase signed URL error for path ${path}:`, error.message);
      if (error.message.includes('Object not found')) {
        return NextResponse.json(
          { url: '/images/blog/default-cover.jpg' },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to generate signed URL', details: error.message },
        { status: 500 }
      );
    }

    if (!data?.signedUrl) {
      console.error(`No signed URL returned for path ${path}`);
      return NextResponse.json(
        { url: '/images/blog/default-cover.jpg' },
        { status: 200 }
      );
    }

    return NextResponse.json({ url: data.signedUrl });
  } catch (error: any) {
    console.error('Error generating signed URL:', error.message);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}