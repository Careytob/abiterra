import { createClient } from '@supabase/supabase-js';
import { Database } from '@/app/types/supabase'; 

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
}

export const supabaseServiceRole = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false },
  }
);

export async function getWatermarkedImageUrl(bucket: string, path: string): Promise<string> {
  try {
    // Validate inputs
    if (!bucket || !path) {
      console.error(`[SupabaseUtil] Invalid bucket or path: bucket=${bucket}, path=${path}`);
      return '/images/fallback.jpg';
    }

    // List objects in the bucket to verify the file exists
    const { data, error } = await supabaseServiceRole.storage
      .from(bucket)
      .list('', { search: path });

    if (error) {
      console.error(`[SupabaseUtil] Storage error: bucket=${bucket}, path=${path}, error=${error.message}`);
      return '/images/fallback.jpg';
    }

    if (!data?.find(file => file.name === path)) {
      console.error(`[SupabaseUtil] Image not found: bucket=${bucket}, path=${path}`);
      return '/images/fallback.jpg';
    }

    // Return the watermarked URL
    return `/api/watermark-image?bucket=${encodeURIComponent(bucket)}&path=${encodeURIComponent(path)}`;
  } catch (error) {
    console.error('[SupabaseUtil] Error generating watermarked URL:', error);
    return '/images/fallback.jpg';
  }
}