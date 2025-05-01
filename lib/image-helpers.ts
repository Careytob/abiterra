// lib/image-helpers.ts
import { createClient } from '@supabase/supabase-js';

// Get Supabase client with proper error handling
export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }

  return createClient(supabaseUrl, supabaseKey);
}

// Clean image path removing leading slashes and query parameters
export function cleanImagePath(url: string): string {
  if (!url) return '';
  // Remove leading slash if present and remove any query parameters
  return url.replace(/^\//, '').split('?')[0];
}

// Generate signed URL with 1 year expiration
export async function getSignedImageUrl(imagePath: string, expirationInSeconds = 31536000) {
  try {
    if (!imagePath) {
      return null;
    }

    const cleanPath = cleanImagePath(imagePath);
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.storage
      .from('properties')
      .createSignedUrl(cleanPath, expirationInSeconds);

    if (error) {
      console.error(`Error creating signed URL for ${cleanPath}:`, error.message);
      return null;
    }

    return data?.signedUrl || null;
  } catch (error) {
    console.error('Unexpected error in getSignedImageUrl:', error);
    return null;
  }
}