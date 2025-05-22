import { createClient } from '@supabase/supabase-js';

// Your Supabase credentials
const supabaseUrl = 'https://szeqlqhzewvrdeerdamx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6ZXFscWh6ZXd2cmRlZXJkYW14Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjMyOTUzNywiZXhwIjoyMDUxOTA1NTM3fQ.cVNvSIU_VZocWyk-clEnZdyReevOJmUxlJLi2ijh5lw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateFileExtensionsToWebp() {
  try {
    console.log('🔄 Starting file extension conversion to WebP...');

    // First, let's see the table structure
    const { data: sampleImages, error: sampleError } = await supabase
      .from('image')
      .select('*')
      .ilike('filepath', '%duchess-homes%')
      .limit(2);

    if (sampleError) {
      console.error('❌ Error fetching sample images:', sampleError);
      return;
    }

    if (!sampleImages || sampleImages.length === 0) {
      console.log('ℹ️ No duchess-homes images found in database');
      return;
    }

    console.log('📋 Sample record structure:');
    console.log('Columns:', Object.keys(sampleImages[0]));
    console.log('Sample record:', sampleImages[0]);
    console.log('');

    // Fetch all duchess-homes records that need updating (only .jpeg, .jpg, .png)
    const { data: images, error: fetchError } = await supabase
      .from('image')
      .select('*')
      .ilike('filepath', '%duchess-homes%')
      .or('filepath.ilike.%.jpeg,filepath.ilike.%.jpg,filepath.ilike.%.png');

    if (fetchError) {
      console.error('❌ Error fetching images to update:', fetchError);
      return;
    }

    console.log(`📊 Found ${images.length} images with non-webp extensions`);

    if (images.length === 0) {
      console.log('✅ All images already have .webp extensions!');
      return;
    }

    console.log('📋 Sample conversions:');
    images.slice(0, 5).forEach(image => {
      const newFilepath = image.filepath.replace(/\.(jpg|jpeg|png|gif|bmp|tiff)$/i, '.webp');
      console.log(`   ${image.filepath}`);
      console.log(`   → ${newFilepath}`);
      console.log('');
    });

    console.log(`📝 Ready to update ${images.length} file extensions to .webp...`);
    console.log('⚠️  This will update your database URLs. Press Ctrl+C to cancel, or wait 5 seconds to continue...');
    
    // Wait 5 seconds for user to cancel if needed
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('🚀 Starting update...');

    // Update records one by one to avoid upsert issues
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const newFilepath = image.filepath.replace(/\.(jpg|jpeg|png|gif|bmp|tiff)$/i, '.webp');
      
      const { error: updateError } = await supabase
        .from('image')
        .update({ filepath: newFilepath })
        .eq('id', image.id);

      if (updateError) {
        console.error(`❌ Error updating record ${i + 1}:`, updateError);
        errorCount++;
      } else {
        successCount++;
        if (successCount % 50 === 0) {
          console.log(`✅ Updated ${successCount}/${images.length} records...`);
        }
      }
    }

    console.log(`\n🎉 Update Summary:`);
    console.log(`   ✅ Successfully updated: ${successCount} URLs`);
    if (errorCount > 0) {
      console.log(`   ❌ Failed to update: ${errorCount} URLs`);
    }

    // Show final verification
    console.log('\n📋 Final verification:');
    const { data: remainingJpeg } = await supabase
      .from('image')
      .select('filepath')
      .ilike('filepath', '%duchess-homes%')
      .or('filepath.ilike.%.jpeg,filepath.ilike.%.jpg,filepath.ilike.%.png')
      .limit(5);
      
    if (remainingJpeg && remainingJpeg.length > 0) {
      console.log(`   ⚠️  Still ${remainingJpeg.length} non-webp files remaining:`);
      remainingJpeg.forEach(img => console.log(`      ${img.filepath}`));
    } else {
      console.log('   🎉 All duchess-homes images now have .webp extensions!');
    }

  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

// Run the update
updateFileExtensionsToWebp();