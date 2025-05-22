// scripts/addNewProperties.ts
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type PropertyInput = {
  title: string;
  description: string;
  price: number;
  type: 'SALE' | 'RENT';
  bedrooms: number;
  bathrooms: number;
  bq: number;
  toilets: number;
  area: number | null;
  location: string;
  latitude?: number;
  longitude?: number;
  city: string;
  state: string;
  images: string[];
  features: string[];
  isFeatured?: boolean;
};

// =====================================
// CRITICAL: DO NOT MODIFY THIS SECTION
// =====================================
// List of featured property titles to preserve
// These are the properties that should remain on the homepage
const featuredPropertyTitles = [

];
// =====================================

// Add only new non-featured properties here
const newPropertiesToAdd: PropertyInput[] = [
 {
    title: " 3-Bedroom Duplex with Communal Swimming Pool",
    description: "Discover modern comfort and investment-ready real estate in this stunning collection of 4-bedroom terrace duplex located in a secure and well-planned estate in Ajah, Lekki. This home is designed with elegant finishes and built for convenience, making it ideal for personal living, shortlet, or long-term rental business.\n\nWhether you're looking to own your dream home or invest in high-yield real estate for rental income or short-term stays, this duplex offer unmatched value in one of Lekki's fast-rising residential hubs.",
    price: 90000000,
    type: "SALE",
    bedrooms: 3,
    bq: 0,
    bathrooms: 3,
    toilets: 4,
    area: null,
    location: " Ajah, Lekki,Lagos",
    latitude: 	6.469620,
    longitude: 3.562870,
    city: "Ajah,Lekki",
    state: "Lagos",
    isFeatured: false, 
    images: [
      "images/properties/sale/duchess-homes/house-18/front-1.jpeg",
      "images/properties/sale/duchess-homes/house-18/front-2.jpeg",
      "images/properties/sale/duchess-homes/house-18/living-1.jpeg",
      "images/properties/sale/duchess-homes/house-18/living-2.jpeg",
      "images/properties/sale/duchess-homes/house-18/living-3.jpeg",
      "images/properties/sale/duchess-homes/house-18/room-1.jpeg",
      "images/properties/sale/duchess-homes/house-18/room-2.jpeg",
      "images/properties/sale/duchess-homes/house-18/room-3.jpeg",
      "images/properties/sale/duchess-homes/house-18/room-4.jpeg",
      "images/properties/sale/duchess-homes/house-18/room-5.jpeg",
      "images/properties/sale/duchess-homes/house-18/wardrobe-1.jpeg",
      "images/properties/sale/duchess-homes/house-18/wardrobe-2.jpeg",
      "images/properties/sale/duchess-homes/house-18/kitchen-1.jpeg",
      "images/properties/sale/duchess-homes/house-18/corridor-1.jpeg",
      "images/properties/sale/duchess-homes/house-18/corridor-2.jpeg",
      "images/properties/sale/duchess-homes/house-18/bath-1.jpeg",
      "images/properties/sale/duchess-homes/house-18/bath-2.jpeg",
      "images/properties/sale/duchess-homes/house-18/bath-3.jpeg",
    ],
    features: ["Contemporary Architectural Design", "Spacious & Well-Lit Living Areas", "Private Balconies for Each Unit", "Fully Fitted Kitchen with Modern Appliances", "Beautifully Crafted Wardrobes in All Rooms", "Premium Luxury Sanitary Wares","Stylish & Gorgeous Lighting Fixtures","All Rooms En-suite","Communal Swimming Pool","24-Hour Electricity & Security","Located in a Secure Gated Estate","Strategically Located in a Prime Ajah Neighborhood"],
  },
  {
    title: "Exceptional Value! Modern 4-Bed Detached Duplex in Prime Ajah Location",
    description: "Experience a perfect blend of affordability and modern comfort in this 4-bedroom detached duplex situated in the peaceful and rapidly developing area of Ajah, Lekki. Thoughtfully designed for families or investors, this property delivers top-tier features and lifestyle essentials in a secure, upscale estate.\n\nWhether you're buying to live or invest, this home is a smart choice with excellent potential. Schedule a viewing today!",
    price: 120000000,
    type: "SALE",
    bedrooms: 4,
    bq: 0,
    bathrooms: 4,
    toilets: 5,
    area: null,
    location: " Ajah, Lekki,Lagos",
    latitude: 	6.469620,
    longitude: 3.562870,
    city: "Ajah,Lekki",
    state: "Lagos",
    isFeatured: false, 
    images: [
      "images/properties/sale/duchess-homes/house-21/front-1.jpeg",
      "images/properties/sale/duchess-homes/house-21/front-2.jpeg",
      "images/properties/sale/duchess-homes/house-21/living-1.jpeg",
      "images/properties/sale/duchess-homes/house-21/living-2.jpeg",
      "images/properties/sale/duchess-homes/house-21/living-3.jpeg",
      "images/properties/sale/duchess-homes/house-21/living-4.jpeg",
      "images/properties/sale/duchess-homes/house-21/lounge-1.jpeg",
      "images/properties/sale/duchess-homes/house-21/kitchen-1.jpeg",
      "images/properties/sale/duchess-homes/house-21/kitchen-2.jpeg",
      "images/properties/sale/duchess-homes/house-21/room-1.jpeg",
      "images/properties/sale/duchess-homes/house-21/room-2.jpeg",
      "images/properties/sale/duchess-homes/house-21/room-3.jpeg",
      "images/properties/sale/duchess-homes/house-21/room-4.jpeg",
      "images/properties/sale/duchess-homes/house-21/wardrobe-1.jpeg",
      "images/properties/sale/duchess-homes/house-21/bath-1.jpeg",
     
    ],
    features: ["Modern Architecture", "Spacious Living Area", "Family Lounge", "Balcony", "Fully Fitted Kitchen", "TV Consoles","Beautifully Fitted Wardrobes","Luxury Sanitary Wares","Gorgeous Lightings","Integrated Audio System","Motion Sensor Stairway Light","All Rooms En-suite","Secure Gated and Access Control Estate","Great Neighbourhood"],
  },
  {
    title: " Elegant Newly Built 4-Bedroom Detached Duplex with BQ in Orchid Lekki",
    description: "Discover this pristine fully detached 4-bedroom duplex, thoughtfully designed for modern family living in the prestigious Orchid Lekki neighborhood. This home boasts spacious living areas and a fully fitted kitchen perfect for daily family meals and entertaining guests.\n\nEnjoy privacy and convenience with all rooms en-suite, fitted wardrobes, and beautiful lighting that enhances the warm ambiance throughout. The property is self-serviced and located within a secure estate with 24-hour security, ensuring peace of mind for you and your loved ones.\n\nIdeal for those seeking comfort, security, and a great community atmosphere in one of Lekki’s most sought-after locations.",
    price: 250000000,
    type: "SALE",
    bedrooms: 4,
    bq: 1,
    bathrooms: 4,
    toilets: 5,
    area: null,
    location: " Orchid, Lekki,Lagos",
    latitude: 	6.4316,
    longitude: 3.5564,
    city: "Orchid,Lekki",
    state: "Lagos",
    isFeatured: false, 
    images: [
      "images/properties/sale/duchess-homes/house-22/front-1.webp",
      "images/properties/sale/duchess-homes/house-22/front-2.webp",
      "images/properties/sale/duchess-homes/house-22/living-1.webp",
      "images/properties/sale/duchess-homes/house-22/living-2.webp",
      "images/properties/sale/duchess-homes/house-22/living-3.webp",
      "images/properties/sale/duchess-homes/house-22/living-4.webp",
      "images/properties/sale/duchess-homes/house-22/living-5.webp",
      "images/properties/sale/duchess-homes/house-22/lounge-1.webp",
      "images/properties/sale/duchess-homes/house-22/lounge-2.webp",
      "images/properties/sale/duchess-homes/house-22/lounge-3.webp",
      "images/properties/sale/duchess-homes/house-22/kitchen-1.webp",
      "images/properties/sale/duchess-homes/house-22/kitchen-2.webp",
      "images/properties/sale/duchess-homes/house-22/kitchen-3.webp",
      "images/properties/sale/duchess-homes/house-22/kitchen-4.webp",
      "images/properties/sale/duchess-homes/house-22/room-1.webp",
      "images/properties/sale/duchess-homes/house-22/room-2.webp",
      "images/properties/sale/duchess-homes/house-22/wardrobe-1.webp",
      "images/properties/sale/duchess-homes/house-22/bath-1.webp",
      "images/properties/sale/duchess-homes/house-22/bath-2.webp",
     
    ],
    features: ["Living Area", "Self Serviced", "Fully Fitted Kitchen", "24 Hours Security", "Fitted Wardrobes", "Beautiful Lightings","All Rooms En-Suite","Secure Estate","Great Neighbourhood"],
  },
    {
        title: "Stunning 5-Bedroom Luxury Haven with Pool & Cinema in Orchid Lekki",
        description: "Step into elevated living with this exquisite 5-bedroom fully detached home located in the heart of Orchid, Lekki. Crafted with modern contemporary architecture and flawless detailing, this residence offers a perfect blend of comfort, luxury, and functionality.\n\nIndulge in serene indoor living with a private cinema room, a sparkling swimming pool for relaxation, and beautifully finished interiors that radiate sophistication. Whether you're hosting guests or enjoying family time, every inch of this home is designed to impress.\n\nPerfect for upscale family living in a safe and serene environment.",
        price: 750000000,
        type: "SALE",
        bedrooms: 5,
        bq: 1,
        bathrooms: 5,
        toilets: 6,
        area: null,
        location: " Orchid, Lekki,Lagos",
    latitude: 	6.4316,
    longitude: 3.5564,
        city: "Orchid, Lekki",
        state: "Lagos",
        isFeatured: false,
        images: [
        "images/properties/sale/duchess-homes/house-23/front-1.webp",
        "images/properties/sale/duchess-homes/house-23/living-1.webp",
        "images/properties/sale/duchess-homes/house-23/living-2.webp",
        "images/properties/sale/duchess-homes/house-23/living-3.webp",
        "images/properties/sale/duchess-homes/house-23/living-4.webp",
        "images/properties/sale/duchess-homes/house-23/kitchen-1.webp",
        "images/properties/sale/duchess-homes/house-23/kitchen-2.webp",
        "images/properties/sale/duchess-homes/house-23/lounge-2.webp",
        "images/properties/sale/duchess-homes/house-23/room-1.webp",
        "images/properties/sale/duchess-homes/house-23/room-2.webp",
        "images/properties/sale/duchess-homes/house-23/wardrobe-1.webp",
        "images/properties/sale/duchess-homes/house-23/wardrobe-2.webp",
        "images/properties/sale/duchess-homes/house-23/bath-1.webp",
        "images/properties/sale/duchess-homes/house-23/bath-2.webp",
        "images/properties/sale/duchess-homes/house-23/gallery-1.webp",
        "images/properties/sale/duchess-homes/house-23/balcony-1.webp",
        "images/properties/sale/duchess-homes/house-23/pool-1.webp",
       
        ],
        features: ["Modern Contemporary Architecture", "Spacious Living Area", "Dining", "Gorgeous Lightings", "Alluring Woodwork", "Beautiful Fitted Kitchen", "All Rooms En-Suite","Cinema Room","Swimming Pool","Boy’s Quarters","Secure Gated Estate","Great Neighbourhood" ],
    },
  {
    title: "Architectural Gem: 5-Bed Luxury Duplex with Pool & BQ in Ajah Lekki",
    description: "This masterfully crafted 5-bedroom duplex is a statement of sophistication and comfort. Nestled in a prime area of Ajah, Lekki, it boasts bold contemporary architecture and breathtaking attention to detail.\n\nFrom the lavish walk-in closet to the private swimming pool and the integrated smart home features, every inch of this home is designed for refined living. Whether you're entertaining guests or seeking tranquil family moments, this property delivers elegance, space, and serenity in one package.",
    price: 290000000,
    type: "SALE",
    bedrooms: 5,
    bq: 1,
    bathrooms: 5,
    toilets: 6,
    area: null,
    location: "Ajah, Lekki, Lagos",
    latitude: 	6.46962,
    longitude: 3.56287,
    city: "Ajah Lekki",
    state: "Lagos",
    isFeatured: false, 
    images: [
        "images/properties/sale/duchess-homes/house-24/front-1.webp",
        "images/properties/sale/duchess-homes/house-24/living-1.webp",
        "images/properties/sale/duchess-homes/house-24/living-2.webp",
        "images/properties/sale/duchess-homes/house-24/living-3.webp",
        "images/properties/sale/duchess-homes/house-24/kitchen-1.webp",
        "images/properties/sale/duchess-homes/house-24/kitchen-2.webp",
        "images/properties/sale/duchess-homes/house-24/lounge-1.webp",
        "images/properties/sale/duchess-homes/house-24/room-1.webp",
        "images/properties/sale/duchess-homes/house-24/room-2.webp",
        "images/properties/sale/duchess-homes/house-24/wardrobe-1.webp",
        "images/properties/sale/duchess-homes/house-24/wardrobe-2.webp",
        "images/properties/sale/duchess-homes/house-24/bath-1.webp",
        "images/properties/sale/duchess-homes/house-24/bath-2.webp",
         "images/properties/sale/duchess-homes/house-24/pool-1.webp",
       
    ],
    features: ["Contemporary Architecture", "Modern Luxury Appurtenances", "Ample Parking Space", "Spacious Living Areas", "Dining Area","Luxury Sanitary Wares","Family Lounge","Balcony","Integrated Audio System","Mind Blowing Lightings","TV Consoles","Kitchenette","Beautiful Carved Walk-in Closet","Stamped Concrete Floor","Swimming Pool","Well Equipped And Fully Fitted Kitchen","CCTV Surveillance System","Greenery","Boy’s Quarter","Access Controlled Gated Estate","Great Neighborhood"],
  },
  {
    title: "Exquisitely Crafted 5-Bedroom Luxury Duplex with Pool & BQ in Ajah, Lekki",
    description: "Step into this meticulously designed luxury duplex where elegance meets comfort. Located in a serene, gated estate in Ajah, Lekki, this home offers high-end features and a beautifully integrated living experience perfect for modern families.",
    price: 290000000,
    type: "SALE",
    bedrooms: 5,
    bq: 1,
    bathrooms: 5,
    toilets: 6,
    area: null,
    location: "Ajah, Lekki, Lagos",
    latitude: 	6.46962,
    longitude: 3.56287,
    city: "Ajah Lekki",
    state: "Lagos",
    isFeatured: false, 
    images: [
        "images/properties/sale/duchess-homes/house-25/front-1.webp",
        "images/properties/sale/duchess-homes/house-25/front-2.webp",
        "images/properties/sale/duchess-homes/house-25/front-3.webp",
        "images/properties/sale/duchess-homes/house-25/living-1.webp",
        "images/properties/sale/duchess-homes/house-25/living-2.webp",
        "images/properties/sale/duchess-homes/house-25/living-3.webp",
        "images/properties/sale/duchess-homes/house-25/kitchen-1.webp",
        "images/properties/sale/duchess-homes/house-25/lounge-1.webp",
        "images/properties/sale/duchess-homes/house-25/lounge-2.webp",
        "images/properties/sale/duchess-homes/house-25/lounge-3.webp",
        "images/properties/sale/duchess-homes/house-25/room-1.webp",
        "images/properties/sale/duchess-homes/house-25/room-2.webp",
        "images/properties/sale/duchess-homes/house-25/room-3.webp",
        "images/properties/sale/duchess-homes/house-25/room-4.webp",
        "images/properties/sale/duchess-homes/house-25/wardrobe-1.webp",
        "images/properties/sale/duchess-homes/house-25/bath-1.webp",
        "images/properties/sale/duchess-homes/house-25/bath-2.webp",
        "images/properties/sale/duchess-homes/house-25/bath-3.webp",
        "images/properties/sale/duchess-homes/house-25/pool-1.webp",
        "images/properties/sale/duchess-homes/house-25/pool-2.webp",
       
    ],
    features: ["Contemporary Architecture", "Modern Luxury Appurtenances", "Ample Parking Space", "Ample Parking Space", "Spacious Living Areas","Dining Area","Luxury Sanitary Wares","Family Lounge","Balcony","Integrated Audio System","Mind Blowing Lightings","TV Consoles","Kitchenette","Beautiful Carved Walk-in Closet","Stamped Concrete Floor","Swimming Pool","Well Equipped and Fully Fitted Kitchen","CCTV Surveillance","Greenery","Boy’s Quarter","Access Controlled Gated Estate","Great Neighborhood"],
  },
 
];

async function ensureAgentExists(agentId: string, name: string, email: string) {
  try {
    const agent = await prisma.user.upsert({
      where: { id: agentId },
      update: {},
      create: {
        id: agentId,
        name,
        email,
        createdAt: new Date(),
      },
    });
    console.log(`✅ Ensured agent exists: ${agent.name} (ID: ${agent.id})`);
    return agent;
  } catch (error) {
    console.error(`Failed to ensure agent ${agentId}:`, error);
    throw error;
  }
}

async function uploadImageToSupabase(filePath: string): Promise<{ url: string; filePath: string; imageType: string }> {
  const imageType = filePath.split('/')[4]?.split('-')[0]?.toLowerCase() || 'other';
  const supabasePath = filePath;

  try {
    // Check if image exists in Supabase
    const folderPath = filePath.split('/').slice(0, -1).join('/');
    const fileName = filePath.split('/').pop();
    const { data: listData, error: listError } = await supabase.storage
      .from('properties')
      .list(folderPath);
    if (listError || !listData.some((item) => item.name === fileName)) {
      console.error(`Image not found in Supabase: ${filePath}`);
      return { url: '/placeholder-property.jpg', filePath: supabasePath, imageType };
    }

    const { data, error } = await supabase.storage
      .from('properties')
      .createSignedUrl(supabasePath, 31536000);
    if (error || !data?.signedUrl) {
      console.error(`Failed to create signed URL for ${supabasePath}:`, error?.message);
      return { url: '/placeholder-property.jpg', filePath: supabasePath, imageType };
    }
    return { url: data.signedUrl, filePath: supabasePath, imageType };
  } catch (error) {
    console.error(`Error processing image ${filePath}:`, error);
    return { url: '/placeholder-property.jpg', filePath: supabasePath, imageType };
  }
}

async function preserveFeaturedProperties() {
  console.log("Preserving existing featured properties...");
  try {
    // First, reset all properties to non-featured
    await prisma.property.updateMany({
      where: { isfeatured: true },
      data: { isfeatured: false }
    });
    
    // Then set the specified properties back to featured
    for (const title of featuredPropertyTitles) {
      const property = await prisma.property.findFirst({
        where: { title: { contains: title } }
      });
      
      if (property) {
        await prisma.property.update({
          where: { id: property.id },
          data: { isfeatured: true }
        });
        console.log(`✅ Preserved featured status for: ${property.title}`);
      } else {
        console.log(`⚠️ Could not find featured property: ${title}`);
      }
    }
    
    console.log("Featured properties preservation complete!");
  } catch (error: any) {
    console.error("Error preserving featured properties:", error.message);
  }
}

async function createProperty(propertyData: PropertyInput) {
  try {
    const areaValue = propertyData.area;
    if (areaValue !== null && typeof areaValue !== 'number') {
      throw new Error(`Invalid area value for "${propertyData.title}": ${areaValue}`);
    }

    // Generate a unique slug by adding a timestamp
    let baseSlug = slugify(`${propertyData.title} ${propertyData.location} ${propertyData.city}`, {
      lower: true,
      strict: true,
    });
    
    // Always add a unique identifier to ensure uniqueness
    const timestamp = new Date().getTime();
    const uniqueId = uuidv4().slice(0, 8);
    const slug = `${baseSlug}-${timestamp}-${uniqueId}`;

    // Ensure agent exists
    await ensureAgentExists('abiterra-admin', 'Abiterra Admin', 'admin@abiterra.com');

    const uploadedImages = await Promise.all(
      propertyData.images.map(async (filePath, index) => {
        const { url, filePath: supabasePath, imageType } = await uploadImageToSupabase(filePath);
        return {
          url,
          filepath: supabasePath,
          imagetype: imageType,
          ismain: index === 0,
          createdat: new Date(),
        };
      })
    );

    // IMPORTANT: Check if this is one of our featured properties
    const shouldBeFeautured = featuredPropertyTitles.some(title => 
      propertyData.title.includes(title)
    );
    
    // Always respect the featured status
    const isFeatured = shouldBeFeautured ? true : false;

    const property = await prisma.property.create({
      data: {
        id: uuidv4(),
        slug,
        title: propertyData.title,
        description: propertyData.description,
        price: propertyData.price,
        type: propertyData.type as 'SALE' | 'RENT',
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        bq: propertyData.bq,
        toilets: propertyData.toilets,
        area: areaValue,
        location: propertyData.location,
        latitude: propertyData.latitude ?? null,
        longitude: propertyData.longitude ?? null,
        city: propertyData.city,
        state: propertyData.state,
        availability: true,
        status: 'AVAILABLE' as 'AVAILABLE' | 'PENDING' | 'SOLD' | 'RENTED',
        isfeatured: isFeatured, // Properly set the featured flag
        agentid: 'lord-supreme',
        createdat: new Date(),
        updatedat: new Date(),
        image: {
          create: uploadedImages,
        },
        feature: {
          create: propertyData.features.map((name) => ({ name })),
        },
      },
    });

    console.log(`✅ Created property: ${property.title} (ID: ${property.id}, Slug: ${property.slug}, Featured: ${isFeatured})`);
    return { success: true, property };
  } catch (error: any) {
    console.error(`Error creating property "${propertyData.title}":`);
    console.error('Message:', error.message || 'No message');
    console.error('Meta:', JSON.stringify(error.meta, null, 2) || 'No meta');
    console.error('Cause:', JSON.stringify(error.cause, null, 2) || 'No cause');
    console.error('Stack:', error.stack || 'No stack');
    return { 
      success: false, 
      property: null, 
      error: {
        title: propertyData.title,
        message: error.message || 'Unknown error',
        details: error.meta || {}
      }
    };
  }
}

async function createProperties(properties: PropertyInput[]) {
  console.log(`Starting to create ${properties.length} properties...`);

  const results = {
    successful: [] as { title: string, id: string, slug: string }[],
    failed: [] as { title: string, error: string }[],
  };

  for (const property of properties) {
    try {
      // Check if this is a featured property
      const shouldBeFeautured = featuredPropertyTitles.some(title => 
        property.title.includes(title)
      );
      
      // Set the featured flag properly
      property.isFeatured = shouldBeFeautured;
      
      const result = await createProperty(property);
      if (result.success && result.property) {
        results.successful.push({
          title: result.property.title,
          id: result.property.id,
          slug: result.property.slug
        });
      } else {
        results.failed.push({
          title: property.title,
          error: result.error ? result.error.message : 'Unknown error'
        });
      }
    } catch (error: any) {
      results.failed.push({
        title: property.title,
        error: error.message || 'Unexpected error'
      });
    }
  }

  return results;
}

async function main() {
  try {
    // First, ensure our featured properties remain featured
    await preserveFeaturedProperties();
    
    // Then add the new properties
    const results = await createProperties(newPropertiesToAdd);

    console.log('\n======== Properties Creation Summary ========');
    console.log(`✅ Successfully created: ${results.successful.length} properties`);
    console.log(`❌ Failed to create: ${results.failed.length} properties`);

    if (results.successful.length > 0) {
      console.log('\n✅ Successfully created properties:');
      results.successful.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title}`);
        console.log(`   ID: ${item.id}`);
        console.log(`   Slug: ${item.slug}`);
        console.log('   ----------------');
      });
    }
    
    if (results.failed.length > 0) {
      console.log('\n❌ Failed properties:');
      results.failed.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title}`);
        console.log(`   Error: ${item.error}`);
        console.log('   ----------------');
      });
    }
    
    // Final verification of featured properties
    await preserveFeaturedProperties();
  } catch (error: any) {
    console.error('Batch creation failed:');
    console.error('Message:', error.message || 'No message');
    console.error('Meta:', JSON.stringify(error.meta, null, 2) || 'No meta');
    console.error('Cause:', JSON.stringify(error.cause, null, 2) || 'No cause');
    console.error('Stack:', error.stack || 'No stack');
  } finally {
    await prisma.$disconnect();
  }
}

main();