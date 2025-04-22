
// app/api/blog-images/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Supabase configuration is incomplete. Please check environment variables.');
}

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json({ error: 'Image path is required' }, { status: 400 });
    }

    // Use the blog-images bucket instead of properties
    const { data } = await supabase.storage.from('blog-images').getPublicUrl(path);

    if (data?.publicUrl) {
      return NextResponse.json({ url: data.publicUrl });
    } else {
      return NextResponse.json({ url: '/images/blog/default-cover.jpg' }, { status: 200 });
    }
  } catch (error: any) {
    console.error('Error generating URL:', error);
    return NextResponse.json({ url: '/images/blog/default-cover.jpg' }, { status: 200 });
  }
}