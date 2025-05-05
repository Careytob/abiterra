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
  "Luxury 5 Bedroom Fully Detached Duplex",
  "Contemporary Neatly Furnished 5 bedroom with 2 service quarters",
  "Luxury 6 Bedroom Fully Detached Duplex with Swimming Pool",
  "Elegant 5-Bedroom Fully Detached Duplex with Swimming Pool in a Prime Location",
  "Modern 3-Bedroom Apartment in Lekki Phase 1 with Top-Class Amenities",
  "Massive 8-Bedroom Fully Detached Duplex on 2 Acres"
];
// =====================================

// Add only new non-featured properties here
const newPropertiesToAdd: PropertyInput[] = [
 {
    title: "Exquisite 4-Bedroom Fully Detached Smart Home with Gym & Swimming Pool in Lekki",
    description: "Step into modern elegance with this luxury 4-bedroom fully detached smart home, perfectly situated on Orchid Road, Lekki.\n\nDesigned for comfort, security, and high-end living, this stunning property blends state-of-the-art technology with refined style.\n\nIdeal for families or investors seeking upscale real estate in a prime location, this home offers the perfect balance of luxury and functionality.",
    price: 170000000,
    type: "SALE",
    bedrooms: 4,
    bq: 0,
    bathrooms: 4,
    toilets: 5,
    area: null,
    location: "Orchid Road, Lekki",
    latitude: 6.4316,
    longitude: 3.5564,
    city: "Lagos",
    state: "Lagos",
    isFeatured: false, // Explicitly set to false for buy page only
    images: [
      "images/properties/sale/lord-supreme/house-4.jpg",
     
    ],
    features: ["Spacious living room", "Ensuite rooms", "Chandelier", "Inbuilt speakers", "Fitted kitchen","Superb finishing", "Strong security door with password and face recognition", "Gym", "24 hours power supply", "24/7 security", "CCTV surveillance","Treated water","Playing ground","Top quality tiles","Ample parking space","Gatehouse","Good access roads","Flood free","Inside a secured estate"],    
  },
  {
    title: "Exquisite 5-Bedroom Fully Detached Duplex with BQ, Cinema & Pool in Omole Phase 1",
    description: "Step into unmatched sophistication with this astonishingly built 5-bedroom fully detached duplex, perfectly located in the prestigious Omole Phase 1, Lagos.\n\nThis luxury masterpiece combines elegance, comfort, and smart living — designed for discerning homeowners who appreciate style and substance.\n\nThis home is more than just a residence – it's a statement of lifestyle, offering premium amenities and exquisite details throughout.",
    price: 600000000,
    type: "SALE",
    bedrooms: 5,
    bq: 1,
    bathrooms: 5,
    toilets: 6,
    area: null,
    location: " Omole Phase 1,Lagos",
    latitude: 	6.583333,
    longitude: 3.333333,
    city: "Lagos",
    state: "Lagos",
    isFeatured: false, 
    images: [
      "images/properties/sale/lord-supreme/house-3.jpg",
     
    ],
    features: ["Modern Day POP Ceiling", "Detailed finishing", "Fitted Kitchen with accessories", "balcony", "Wardrobes", "Luxury Finishing","Jacuzzi","CCTV","Automated Light","Water heater","Heat extractor","Ample parking space","Cinema","Secured Estate","⁠Swimming pool"],
  },
  {
    title: "Perfectly Perched 5-Bedroom Luxury Smart Home with Pool & BQ in Lekki Phase 1",
    description: "Welcome to your future home – a masterpiece of luxury and innovation, ideally located in the heart of Lekki Phase 1.\n\nThis 5-bedroom smart home is thoughtfully designed with exquisite architectural details and premium finishes, offering a refined lifestyle in one of Lagos' most prestigious neighborhoods.\n\nThis home blends modern elegance with cutting-edge tech, making it ideal for families, executives, or luxury property investors.",
    price: 850000000,
    type: "SALE",
    bedrooms: 5,
    bq: 1,
    bathrooms: 5,
    toilets: 6,
    area: null,
    location: "Lekki Phase 1, Lagos",
    latitude: 	6.447809,
    longitude: 3.472350,
    city: "Lagos",
    state: "Lagos",
    isFeatured: false,
    images: [
      "images/properties/sale/lord-supreme/house-27.jpg",
      
    ],
    features: ["Bold A-Series architectural design", "Elegant ante room, spacious living & dining areas", "Private balcony and maid's quarter (BQ)", "Smart home features for lighting, security & control", "Fully fitted kitchen with modern appliances","Beautiful wardrobes and luxury sanitary fittings","Gorgeous light fixtures and smoke detectors","Swimming pool for leisure and entertainment","All rooms en-suite with detailed luxury finishes","Ample parking and underground water storage","Dedicated security guard house","24/7 surveillance in a secure gated estate"],
  },
    {
        title: "Brand New 4-Bedroom Semi-Detached Duplex in Ikota, Lekki – Luxury, Comfort & Style!",
        description: "Live in elegance and modern comfort in this brand new 4-bedroom semi-detached duplex, located in the highly sought-after Ikota, Lekki, Lagos. This home is thoughtfully designed with premium finishes and functional spaces, making it perfect for families or investors seeking a high-value property in a serene, secure neighborhood.\n\nThis home offers an unbeatable combination of luxury, convenience, and location — perfect for modern living in Lekki.",
        price: 115000000,
        type: "SALE",
        bedrooms: 4,
        bq: 0,
        bathrooms: 4,
        toilets: 5,
        area: null,
        location: "Ikota Lekki, Lagos",
        latitude: 	6.453056,
        longitude: 3.395833,
        city: "Lagos",
        state: "Lagos",
        isFeatured: false,
        images: [
        "images/properties/sale/lord-supreme/house-8.jpg",
        
        ],
        features: ["Fully fitted kitchen with accessories", "Stylish POP ceilings and detailed finishing", "Walk-in closet and walk-in shower", "Spacious balcony for relaxation", "Water heater and heat extractor", "All rooms ensuite with quality wardrobes", "24/7 security in a gated, peaceful environment", "Generous car parking space", ],
    },
  {
    title: "EXCLUSIVE WATERFRONT PROPERTY FOR SALE – 5-Bedroom Semi-Detached Duplex | Banana Island, Ikoyi",
    description: "Experience luxury at its finest with this stunning 5-bedroom semi-detached duplex, beautifully set on the waterfront in prestigious Banana Island. Designed for the elite, this home boasts breathtaking water views, modern elegance, and premium amenities for the ultimate high-end lifestyle.\n\nThis is not just a home — it’s a statement of class, privacy, and distinction.",
    price: 2000000000,
    type: "SALE",
    bedrooms: 5,
    bq: 1,
    bathrooms: 5,
    toilets: 6,
    area: null,
    location: "Banana Island, Lagos",
    latitude: 	6.4476,
    longitude: 3.4399,
    city: "Ikoyi",
    state: "Lagos",
    isFeatured: false, 
    images: [
      "images/properties/sale/lord-supreme/house-7.jpg",
     
    ],
    features: ["Uninterrupted waterfront view", "Spacious Rooms", "Good Road Network", "24/7 Security", "Ample Parking","Expansive open-air terrace – perfect for entertaining","Spacious living and dining areas","En-suite bedrooms with luxurious finishing","Prime Banana Island address – secure, serene, and ultra-exclusive"],
  },
  {
    title: "4-Bedroom Semi-Detached Duplex plus BQ",
    description: "An excellent opportunity to own a spacious 4-bedroom semi-detached duplex with a boys’ quarters.",
    price: 170000000,
    type: "SALE",
    bedrooms: 4,
    bq: 1,
    bathrooms: 4,
    toilets: 5,
    area: null,
    location: "Orchid Lekki, Lagos",
    latitude: 6.4316,
    longitude: 3.5564,
    city: "Lagos",
    state: "Lagos",
    isFeatured: false, 
    images: [
      "images/properties/sale/lord-supreme/house-9.jpg",
     
    ],
    features: ["Modern Design", "24/7 Security", "Modern Day POP Ceiling", "Detailed finishing", "Fitted Kitchen with accessories", "balcony", "Wardrobes", "Luxury Finishing"],
  },
  {
    title: "Contemporary 4-Bedroom Semi-Detached Duplex + BQ | Modern Luxury & Prime Location!",
    description: "Step into stylish living with this 4-bedroom contemporary semi-detached duplex, crafted with attention to detail and premium finishes. Located in a strategic, well-connected area, this home offers both comfort and class — perfect for modern families or investors seeking long-term value.\n\nThis home is a blend of architectural excellence and contemporary comfort — a rare find at great value!",
    price: 170000000,
    type: "SALE",
    bedrooms: 4,
    bq: 1,
    bathrooms: 4,
    toilets: 5,
    area: null,
    location: "Ikota Lekki, Lagos",
    latitude: 	6.453056,
    longitude: 3.395833,
    city: "Lagos",
    state: "Lagos",
    isFeatured: false,
    images: [
      "images/properties/sale/lord-supreme/house-18.jpg",
      
    ],
    features: ["2-car dedicated parking space", "Elegant stamped concrete flooring", "Fully self-serviced property", "Sophisticated luxury lighting fixtures", "Imported Spanish porcelain tiles", "Quality POP ceiling finishing", "Premium toilet fittings & Jacuzzi", "All rooms en-suite for privacy", "Fully fitted kitchen with modern appliances", "Water heaters installed", "Well-finished boys’ quarters (BQ)","Clean borehole water supply","High-level premium security","Located in a strategic, accessible location"],
  },
    {
        title: " Elegant 5-Bedroom Fully Detached Duplex with BQ & Swimming Pool | Ikota, Lekki",
        description: "Live in style and comfort with this luxuriously finished 5-bedroom fully detached duplex, nestled in the prime and secure environment of Ikota, Lekki, Lagos. This home is thoughtfully designed to offer modern elegance, functional spaces, and high-end amenities that elevate your lifestyle.\n\nWhether you're buying for personal use or investment, this home checks all the boxes for comfort, style, and long-term value.",
        price: 350000000,
        type: "SALE",
        bedrooms: 5,
        bq: 1,
        bathrooms: 5,
        toilets: 6,
        area: null,
        location: "Ikota Lekki, Lagos",
        latitude: 	6.453056,
        longitude: 3.395833,
        city: "Lagos",
        state: "Lagos",
        isFeatured: false,
        images: [
        "images/properties/sale/lord-supreme/house-23.jpg",
        
        ],
        features: ["Fully fitted kitchen with modern accessories", "Contemporary POP ceilings with sleek lighting", "High-quality detailed finishing throughout", "Premium wardrobes and luxury bathrooms", "Water heater & heat extractor included", "Spacious parking area", "Private boys' quarters (BQ)", "Refreshing swimming pool", "Tasteful luxury interior designs"],
    },
  {
    title: "Exquisite 4-Bedroom Fully Detached Duplex with BQ",
    description: "Step into refined elegance with this newly built 4-bedroom fully detached duplex, beautifully crafted with a flawless blend of sophistication, functionality, and style. Perfectly positioned in a private and secure estate in Ajah, Lagos, this home is designed to offer luxury living at its finest.\n\nThis home offers a perfect combination of comfort, elegance, and security — ideal for families or investors looking for prime Ajah real estate.",
    price: 180000000,
    type: "SALE",
    bedrooms: 4,
    bq: 1,
    bathrooms: 4,
    toilets: 5,
    area: null,
    location: "Ajah, Lagos",
    latitude: 	6.469620,
    longitude: 3.562870,
    city: "Lagos",
    state: "Lagos",
    isFeatured: false,
    images: [
      "images/properties/sale/lord-supreme/house-34.jpg",
      
    ],
    features: ["Spectacular architectural design with floating stairs", "All rooms en-suite with fitted wardrobes and luxury bathrooms", "Spacious living area and family lounge", "Gorgeous chandeliers & modern light fixtures", "Large balcony with serene water view sit-out","Fully equipped modern kitchen + pantry","BQ and generator house","Elegant television console and fitted storage","Spacious compound with ample parking","Premium uncompromised quality fittings","Treated water, interlocked street & gated estate"],
  },
    {
        title: " Majestic 6-Bedroom Smart Home",
        description: "Experience the pinnacle of luxury living with this 6-bedroom smart house in Ikoyi, offering a stunning fusion of modern elegance and functional sophistication. Sitting on a generous 1066 SQM, this architectural masterpiece delivers unmatched comfort, space, and privacy — designed for high-net-worth individuals who demand only the best.\n\nThis is Ikoyi living redefined — exclusive, secure, and intelligently built for timeless appeal.",
        price: 2400000000,
        type: "SALE",
        bedrooms: 6,
        bq: 1,
        bathrooms: 6,
        toilets: 7,
        area: 1066,
        location: "Ikoyi, Lagos",
        latitude: 	6.454812,
        longitude: 3.434691,
        city: "Lagos",
        state: "Lagos",
        isFeatured: false,
        images: [
        "images/properties/sale/lord-supreme/house-40.jpeg",
       
        ],
        features: ["6 expansive en-suite bedrooms", "Open-plan gourmet kitchen", "2-bedroom boys’ quarters (BQ)", "2 spacious sitting rooms & family lounge", "Games room & laundry room", "2 dedicated storage rooms", "Private swimming pool", "Massive parking area", "Security house with integrated infrastructure", "Sleek modern smart features throughout", "Optional furniture package","Repaint in your preferred palette","Upgrade air-conditioning to your specifications"],
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