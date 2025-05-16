//lib/sua
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

export async function getWatermarkedImageUrl(bucket: string, filepath: string): Promise<string> {
  try {
    // Validate inputs
    if (!bucket || !filepath) {
      console.error(`[SupabaseUtil] Invalid bucket or filepath: bucket=${bucket}, filepath=${filepath}`);
      return '/images/fallback.jpg';
    }

    // Normalize filepath - remove any leading slashes that might cause issues
    const normalizedFilepath = filepath.startsWith('/') ? filepath.substring(1) : filepath;
    
    console.log(`[SupabaseUtil] Looking up image: bucket=${bucket}, filepath=${normalizedFilepath}`);
    
    // Get the directory part of the filepath for listing
    const pathParts = normalizedFilepath.split('/');
    const filename = pathParts.pop() || ''; // Extract the filename
    const directory = pathParts.join('/'); // The remaining path is the directory
    
    console.log(`[SupabaseUtil] Listing directory: bucket=${bucket}, directory=${directory}, looking for=${filename}`);

    // List objects in the bucket to verify the file exists
    const { data, error } = await supabaseServiceRole.storage
      .from(bucket)
      .list(directory, { 
        search: filename,
        limit: 100 // Increase limit if necessary
      });

    if (error) {
      console.error(`[SupabaseUtil] Storage error: bucket=${bucket}, directory=${directory}, filename=${filename}, error=${error.message}`);
      return '/images/fallback.jpg';
    }

    // Log the results of the list operation
    console.log(`[SupabaseUtil] Found ${data?.length || 0} files in directory: ${directory}`);
    if (data && data.length > 0) {
      console.log(`[SupabaseUtil] First few files: ${data.slice(0, 3).map(f => f.name).join(', ')}`);
    }

    // Check if the file exists in the directory
    const fileExists = data?.some(file => file.name === filename);
    
    if (!fileExists) {
      console.error(`[SupabaseUtil] Image not found: bucket=${bucket}, directory=${directory}, filename=${filename}`);
      console.log(`[SupabaseUtil] Available files in directory: ${data?.map(f => f.name).join(', ') || 'none'}`);
      return '/images/fallback.jpg';
    }

    // Return the watermarked URL
    const fullPath = directory ? `${directory}/${filename}` : filename;
    const apiUrl = `/api/watermark-image?bucket=${encodeURIComponent(bucket)}&path=${encodeURIComponent(fullPath)}`;
    
    console.log(`[SupabaseUtil] Generated watermarked URL: ${apiUrl}`);
    return apiUrl;
  } catch (error) {
    console.error('[SupabaseUtil] Error generating watermarked URL:', error);
    return '/images/fallback.jpg';
  }
}