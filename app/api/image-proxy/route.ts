import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  
  if (!path) {
    return NextResponse.json({ error: 'No path provided' }, { status: 400 });
  }
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    
    let cleanPath = path;
    if (cleanPath.includes('://')) {
      const urlObj = new URL(cleanPath);
      const pathParts = urlObj.pathname.split('/');
      const bucketIndex = pathParts.findIndex((p) => p === 'properties');
      if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
        cleanPath = pathParts.slice(bucketIndex + 1).join('/');
      } else {
        cleanPath = pathParts[pathParts.length - 1];
      }
    } else {
      cleanPath = cleanPath.replace(/^\//, '').split('?')[0];
      if (cleanPath.startsWith('properties/')) {
        cleanPath = cleanPath.substring('properties/'.length);
      }
    }
    
    const { data, error } = await supabase.storage
      .from('properties')
      .createSignedUrl(cleanPath, 86400); // 24 hour expiry
    
    if (error) {
      console.error(`[Image Proxy] Signed URL error:`, error.message);
      return NextResponse.redirect(new URL('/api/placeholder/800/600', request.url));
    }
    
    // Redirect to the signed URL
    return NextResponse.redirect(data.signedUrl);
  } catch (err) {
    console.error(`[Image Proxy] Error:`, err);
    return NextResponse.redirect(new URL('/api/placeholder/800/600', request.url));
  }
}