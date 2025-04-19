import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function uploadBlogImages() {
  const blogImages = [
    {
      localPath: 'http://localhost:3000/images/blog/nigeria-property-inspection.jpg',
      supabasePath: 'images/blog/nigeria-property-inspection.jpg',
    },
    {
      localPath: 'http://localhost:3000/images/blog/cost-buying-property.jpg',
      supabasePath: 'images/blog/cost-buying-property.jpg',
    },
    {
      localPath: 'http://localhost:3000/images/blog/lagos-property-guide.jpg',
      supabasePath: 'images/blog/lagos-property-guide.jpg',
    },
    {
      localPath: 'http://localhost:3000/images/blog/rental-yield-lagos.jpg',
      supabasePath: 'images/blog/rental-yield-lagos.jpg',
    },
  ];

  for (const image of blogImages) {
    try {
      const response = await fetch(image.localPath);
      if (!response.ok) throw new Error(`Failed to fetch ${image.localPath}`);
      const file = await response.blob();
      const { data, error } = await supabase.storage
        .from('properties')
        .upload(image.supabasePath, file, { upsert: true });
      if (error) {
        console.error(`Upload error for ${image.supabasePath}:`, error);
      } else {
        console.log(`Uploaded: ${image.supabasePath}`);
      }
    } catch (error) {
      console.error(`Error uploading ${image.supabasePath}:`, error);
    }
  }
}

uploadBlogImages();