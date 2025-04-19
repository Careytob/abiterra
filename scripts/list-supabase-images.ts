// scripts/list-supabase-images.ts
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function listImages(path = '') {
  try {
    const { data, error } = await supabase.storage
      .from('properties')
      .list(path, { limit: 100, offset: 0, sortBy: { column: 'name', order: 'asc' } });
    if (error) {
      console.error(`Error listing images in ${path}:`, error);
      return;
    }
    for (const item of data) {
      const fullPath = path ? `${path}/${item.name}` : item.name;
      if (item.metadata && item.metadata.size) {
        // It's a file
        console.log(fullPath);
      } else {
        // It's a folder, recurse
        await listImages(fullPath);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

console.log('Images in Supabase properties bucket:');
listImages();