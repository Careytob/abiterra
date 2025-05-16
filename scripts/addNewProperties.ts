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
    title: "Perfectly Carved 4-Bed Terrace Duplex With BQ – Ikota, Lekki",
    description: "Experience refined elegance in this beautifully designed 4-bedroom terrace duplex located in the prestigious Ikota axis of Lekki. Crafted with modern architecture and attention to detail, this home is ideal for family living or investment, boasting premium features and located in a serene, gated estate.\n\nThis duplex offers not only luxury and space, but also peace of mind with valid documentation and structural approvals. Ideal for families or savvy investors seeking short-let or rental potential in the ever-growing Lekki property market.",
    price: 115000000,
    type: "SALE",
    bedrooms: 4,
    bq: 1,
    bathrooms: 4,
    toilets: 5,
    area: null,
    location: "Ikota, Lekki, Lagos",
    latitude: 	6.453056,
    longitude: 3.395833,
    city: "Ikota Lekki",
    state: "Lagos",
    isFeatured: false, // Explicitly set to false for buy page only
    images: [
      "images/properties/sale/duchess-homes/house-16/front-1.jpeg",
      "images/properties/sale/duchess-homes/house-16/living-1.jpeg",
      "images/properties/sale/duchess-homes/house-16/living-2.jpeg",
      "images/properties/sale/duchess-homes/house-16/living-3.jpeg",
      "images/properties/sale/duchess-homes/house-16/room-1.jpeg",
      "images/properties/sale/duchess-homes/house-16/room-2.jpeg",
      "images/properties/sale/duchess-homes/house-16/room-3.jpeg",
      "images/properties/sale/duchess-homes/house-16/room-4.jpeg",
      "images/properties/sale/duchess-homes/house-16/room-5.jpeg",
      "images/properties/sale/duchess-homes/house-16/room-6.jpeg",
      "images/properties/sale/duchess-homes/house-16/room-7.jpeg",
      "images/properties/sale/duchess-homes/house-16/kitchen-1.jpeg",
      "images/properties/sale/duchess-homes/house-16/bath-1.jpeg",
      "images/properties/sale/duchess-homes/house-16/bath-2.jpeg",
      "images/properties/sale/duchess-homes/house-16/toilet-1.jpeg",
      "images/properties/sale/duchess-homes/house-16/wardrobe-1.jpeg",
      "images/properties/sale/duchess-homes/house-16/corridor-1.jpeg",
      "images/properties/sale/duchess-homes/house-16/corridor-2.jpeg",
      
     
    ],
    features: ["Expansive Living Area perfect for relaxation and entertaining", "Upstairs Family Lounge for privacy and comfort", "Dedicated Dining Area", "Fully Fitted Kitchen with modern cabinetry and appliances", "Walk-in Closet in the primary suite – exquisitely crafted","Motion Sensor Stairway Lights adding elegance and safety", "All Rooms En-Suite with top-quality luxury sanitary fittings", "Stylish Lighting Fixtures throughout the home", "Private Boy’s Quarter for additional accommodation or use", "Located in a Secure, Gated Estate with 24/7 security","Sited in a Prime Neighborhood with easy access to major roads and amenities"],    
  },
  {
    title: " 4-Bedroom Duplex with Communal Swimming Pool",
    description: "Discover modern comfort and investment-ready real estate in this stunning collection of 4-bedroom terrace duplex located in a secure and well-planned estate in Ajah, Lekki. This home is designed with elegant finishes and built for convenience, making it ideal for personal living, shortlet, or long-term rental business.\n\nWhether you're looking to own your dream home or invest in high-yield real estate for rental income or short-term stays, this duplex offer unmatched value in one of Lekki’s fast-rising residential hubs.",
    price: 95000000,
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
      "images/properties/sale/duchess-homes/house-17/front-1.jpeg",
      "images/properties/sale/duchess-homes/house-17/front-3.jpeg",
      "images/properties/sale/duchess-homes/house-17/living-1.jpeg",
      "images/properties/sale/duchess-homes/house-17/living-2.jpeg",
      "images/properties/sale/duchess-homes/house-17/living-3.jpeg",
      "images/properties/sale/duchess-homes/house-17/room-1.jpeg",
      "images/properties/sale/duchess-homes/house-17/room-2.jpeg",
      "images/properties/sale/duchess-homes/house-17/room-3.jpeg",
      "images/properties/sale/duchess-homes/house-17/room-4.jpeg",
      "images/properties/sale/duchess-homes/house-17/room-5.jpeg",
      "images/properties/sale/duchess-homes/house-17/wardrobe-1.jpeg",
      "images/properties/sale/duchess-homes/house-17/wardrobe-2.jpeg",
      "images/properties/sale/duchess-homes/house-17/kitchen-1.jpeg",
      "images/properties/sale/duchess-homes/house-17/corridor-1.jpeg",
      "images/properties/sale/duchess-homes/house-17/corridor-2.jpeg",
      "images/properties/sale/duchess-homes/house-17/bath-1.jpeg",
      "images/properties/sale/duchess-homes/house-17/bath-2.jpeg",
      "images/properties/sale/duchess-homes/house-17/bath-3.jpeg",
      
      
     
    ],
    features: ["Contemporary Architectural Design", "Spacious & Well-Lit Living Areas", "Private Balconies for Each Unit", "Fully Fitted Kitchen with Modern Appliances", "Beautifully Crafted Wardrobes in All Rooms", "Premium Luxury Sanitary Wares","Stylish & Gorgeous Lighting Fixtures","All Rooms En-suite","Communal Swimming Pool","24-Hour Electricity & Security","Located in a Secure Gated Estate","Strategically Located in a Prime Ajah Neighborhood"],
  },
  {
    title: " 4-Bedroom Duplex with Communal Swimming Pool",
    description: "Discover modern comfort and investment-ready real estate in this stunning collection of 4-bedroom terrace duplex located in a secure and well-planned estate in Ajah, Lekki. This home is designed with elegant finishes and built for convenience, making it ideal for personal living, shortlet, or long-term rental business.\n\nWhether you're looking to own your dream home or invest in high-yield real estate for rental income or short-term stays, this duplex offer unmatched value in one of Lekki’s fast-rising residential hubs.",
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
        title: "Exquisite 5-Bedroom Fully Detached Dduplex With Swimming Pool & BQ",
        description: "Experience refined living in this beautifully crafted 5-bedroom fully detached duplex, nestled in the prestigious Lekki County Estate. This stunning home offers the perfect blend of luxury, comfort, and functionality — ideal for a modern family or high-end rental investment.\n\nThis home is not just built — it’s crafted for those who appreciate quality, space, and exclusivity. Whether for residential comfort or investment potential, this is a rare opportunity to own luxury in one of Lekki’s most sought-after estates.",
        price: 380000000,
        type: "SALE",
        bedrooms: 5,
        bq: 1,
        bathrooms: 5,
        toilets: 6,
        area: null,
        location: "Lekki County, Lagos",
        latitude: 	6.458985,
        longitude: 3.601521,
        city: "Lekki",
        state: "Lagos",
        isFeatured: false,
        images: [
        "images/properties/sale/duchess-homes/house-19/front-1.jpeg",
        "images/properties/sale/duchess-homes/house-19/front-2.jpeg",
        "images/properties/sale/duchess-homes/house-19/living-1.jpeg",
        "images/properties/sale/duchess-homes/house-19/living-2.jpeg",
        "images/properties/sale/duchess-homes/house-19/lounge-1.jpeg",
        "images/properties/sale/duchess-homes/house-19/lounge-1.jpeg",
        "images/properties/sale/duchess-homes/house-19/room-1.jpeg",
        "images/properties/sale/duchess-homes/house-19/room-2.jpeg",
        "images/properties/sale/duchess-homes/house-19/room-3.jpeg",
        "images/properties/sale/duchess-homes/house-19/room-4.jpeg",
        "images/properties/sale/duchess-homes/house-19/room-5.jpeg",
        "images/properties/sale/duchess-homes/house-19/wardrobe-1-1.jpeg",
        "images/properties/sale/duchess-homes/house-19/wardrobe-2.jpeg",
        "images/properties/sale/duchess-homes/house-19/kitchen-1.jpeg",
        "images/properties/sale/duchess-homes/house-19/kitchen-2.jpeg",
        "images/properties/sale/duchess-homes/house-19/kitchen-3.jpeg",
        "images/properties/sale/duchess-homes/house-19/bath-1.jpeg",
        "images/properties/sale/duchess-homes/house-19/bath-2.jpeg",
        "images/properties/sale/duchess-homes/house-19/bath-3.jpeg",
        "images/properties/sale/duchess-homes/house-19/bath-4.jpeg",
        "images/properties/sale/duchess-homes/house-19/wardrobe-3.jpeg",
        "images/properties/sale/duchess-homes/house-19/pool-1.jpeg",
        "images/properties/sale/duchess-homes/house-19/pool-2.jpeg",
        
        ],
        features: ["Contemporary Modern Architecture", "Impeccable Finishing with High Attention to Detail", "Spacious Living Room with Ample Natural Light", "Private Family Lounge", "Dedicated Dining Area", "Fully Fitted Kitchen with Premium Appliances", "Beautifully Carved Walk-in Closet in Master Suite","Motion Sensor Stairway Lighting","All Rooms En-Suite with Luxury Sanitary Wares","Gorgeous Designer Lightings & Finishes","Integrated Sound System","Private Swimming Pool","Boy’s Quarters (BQ)","Located in a Secure Gated Estate with Access Control","Serene and Well-Planned Neighborhood" ],
    },
  {
    title: "Newly Built 4-Bedroom Semi-Detached Duplex With BQ",
    description: "Step into comfort and elegance with this newly built 4-bedroom semi-detached duplex located in the serene and secure neighborhood of Ikota Lekki. Designed with modern families in mind, this home offers ample space, top-notch finishing, and a well-thought-out layout perfect for residential living or rental investment.\n\nThis property is ideal for homeowners seeking convenience and investors looking for strong rental returns in a high-demand area.",
    price: 160000000,
    type: "SALE",
    bedrooms: 4,
    bq: 1,
    bathrooms: 4,
    toilets: 5,
    area: null,
    location: "Ikota, Lekki, Lagos",
    latitude: 	6.453056,
    longitude: 3.395833,
    city: "Ikota Lekki",
    state: "Lagos",
    isFeatured: false, 
    images: [
        "images/properties/sale/duchess-homes/house-20/front-1.jpeg",
        "images/properties/sale/duchess-homes/house-20/front-2.jpeg",
        "images/properties/sale/duchess-homes/house-20/living-1.jpeg",
        "images/properties/sale/duchess-homes/house-20/living-2.jpeg",
        "images/properties/sale/duchess-homes/house-20/lounge-1.jpeg",
        "images/properties/sale/duchess-homes/house-20/kitchen-1.jpeg",
        "images/properties/sale/duchess-homes/house-20/kitchen-2.jpeg",
        "images/properties/sale/duchess-homes/house-20/corridor-1.jpeg",
        "images/properties/sale/duchess-homes/house-20/room-1.jpeg",
        "images/properties/sale/duchess-homes/house-20/room-2.jpeg",
        "images/properties/sale/duchess-homes/house-20/room-3.jpeg",
        "images/properties/sale/duchess-homes/house-20/room-4.jpeg",
        "images/properties/sale/duchess-homes/house-20/room-5.jpeg",
        "images/properties/sale/duchess-homes/house-20/wardrobe-1-1.jpeg",
        "images/properties/sale/duchess-homes/house-20/bath-1-1.jpeg",
        "images/properties/sale/duchess-homes/house-20/bath-2.jpeg",
        "images/properties/sale/duchess-homes/house-20/bath-3.jpeg",
        "images/properties/sale/duchess-homes/house-20/toilet-1.jpeg",
       
     
    ],
    features: ["Spacious Living Area with Excellent Ventilation", "Fully Fitted Kitchen with Modern Appliances", "All Rooms En-Suite with Contemporary Finishing", "Self-Serviced (independent utilities)", "BQ (Boy’s Quarter) for added convenience","Elegant Fitted Wardrobes","Beautiful Lightings and Ceiling Designs","24 Hours Manned Security","Located in a Secure Estate","Peaceful, Well-Developed Neighborhood"],
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

    // Check if a property with the same title and location already exists
    const existingProperty = await prisma.property.findFirst({
      where: {
        title: propertyData.title,
        location: propertyData.location
      }
    });

    // If property already exists, skip it
    if (existingProperty) {
      console.log(`⏭️ Property already exists: ${propertyData.title} at ${propertyData.location}. Skipping.`);
      return { created: false, property: existingProperty };
    }

    let slug = slugify(`${propertyData.title} ${propertyData.location} ${propertyData.city}`, {
      lower: true,
      strict: true,
    });
    const existing = await prisma.property.findFirst({ where: { slug } });
    if (existing) {
      slug = `${slug}-${uuidv4().slice(0, 8)}`;
    }

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
    return { created: true, property };
  } catch (error: any) {
    console.error(`Error creating property "${propertyData.title}":`);
    console.error('Message:', error.message || 'No message');
    console.error('Meta:', JSON.stringify(error.meta, null, 2) || 'No meta');
    console.error('Cause:', JSON.stringify(error.cause, null, 2) || 'No cause');
    console.error('Stack:', error.stack || 'No stack');
    throw error;
  }
}

async function createProperties(properties: PropertyInput[]) {
  console.log(`Starting to create ${properties.length} new properties...`);

  const results = {
    successful: 0,
    failed: 0,
    skipped: 0,
    failures: [] as string[],
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
      if (result.created) {
        results.successful++;
      } else {
        results.skipped++;
      }
    } catch (error) {
      results.failed++;
      results.failures.push(property.title);
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

    console.log('\nNew Properties Creation Summary:');
    console.log(`✅ Successfully created: ${results.successful} properties`);
    console.log(`⏭️ Skipped existing: ${results.skipped} properties`);
    console.log(`❌ Failed to create: ${results.failed} properties`);

    if (results.failures.length > 0) {
      console.log('\nFailed properties:');
      results.failures.forEach((title) => console.log(`- ${title}`));
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