// app/api/image-proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create the Supabase client with service role key for better access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase environment variables are missing!");
}

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

export const dynamic = 'force-dynamic'; 
export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: NextRequest) {
  // Get the path parameter
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path');
  const bucket = searchParams.get('bucket') || 'properties';
  
  if (!path) {
    return new NextResponse('Path parameter is required', { status: 400 });
  }

  try {
    // First try to get a direct download
    const { data: fileData, error: fileError } = await supabase.storage
      .from(bucket)
      .download(path);
      
    if (!fileError && fileData) {
      // Return the file directly
      const headers = new Headers();
      headers.set('Content-Type', getMimeType(path));
      headers.set('Cache-Control', 'public, max-age=3600');
      
      return new NextResponse(fileData, {
        status: 200,
        headers,
      });
    }
    
    // If direct download fails, try to get a signed URL
    const { data: urlData, error: urlError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60 * 60 * 8); // 8 hours
      
    if (urlError || !urlData?.signedUrl) {
      // Try public URL as last resort
      const { data: publicData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);
        
      if (publicData?.publicUrl) {
        return NextResponse.redirect(publicData.publicUrl);
      }
      
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    
    // Redirect to the signed URL
    return NextResponse.redirect(urlData.signedUrl);
  } catch (error) {
    console.error('Error in image proxy:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
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
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}