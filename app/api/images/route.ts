// app/api/images/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  
  if (!path) {
    return new NextResponse('Path parameter is required', { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return new NextResponse('Server configuration error', { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Use bucket name from your Supabase project
    const bucket = 'properties'; // Replace with your actual bucket name
    
    // First try to get the image directly
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);
      
    if (error) {
      console.error('Error downloading from Supabase:', error);
      
      // If direct download fails, try to get a signed URL
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 60 * 60); // 1 hour expiry
        
      if (signedUrlError) {
        console.error('Error generating signed URL:', signedUrlError);
        return new NextResponse('File not found', { status: 404 });
      }
      
      // Redirect to the signed URL
      return NextResponse.redirect(signedUrlData.signedUrl);
    }
    
    // If we got the data directly, return it with appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', getMimeType(path));
    headers.set('Cache-Control', 'public, max-age=3600');
    
    return new NextResponse(data, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Server error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Helper to determine content type
function getMimeType(path: string): string {
  const extension = path.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
}