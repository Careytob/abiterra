const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function uploadLocalImages() {
  const publicDir = path.join(process.cwd(), 'public');
  const propertiesDir = path.join(publicDir, 'images', 'properties');

  async function processDirectory(dir: string) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        await processDirectory(fullPath);
      } else {
        // Get relative path from public directory
        const relativePath = path.relative(publicDir, fullPath);
        const fileBuffer = fs.readFileSync(fullPath);
        const fileBlob = new Blob([fileBuffer]);

        try {
          const { data, error } = await supabase.storage
            .from('properties')
            .upload(relativePath, fileBlob, {
              contentType: 'image/jpeg',
              upsert: true
            });

          if (error) {
            console.error(`Error uploading ${relativePath}:`, error);
          } else {
            console.log(`Successfully uploaded: ${relativePath}`);
          }
        } catch (error) {
          console.error(`Failed to upload ${relativePath}:`, error);
        }
      }
    }
  }

  await processDirectory(propertiesDir);
}

uploadLocalImages()
  .then(() => console.log('Upload complete'))
  .catch(console.error);