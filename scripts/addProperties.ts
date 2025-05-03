
// scripts/addProperties.ts
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

const propertiesToAdd: PropertyInput[] = [
  {
    title: "Luxury 5 Bedroom Fully Detached Duplex",
    description: "This stunning property offers a unique blend of luxury, comfort, and modernity. With its prime location, top-notch amenities, and beautiful design, this duplex is the perfect choice for those seeking an upscale living experience.",
    price: 695000000,
    type: "SALE",
    bedrooms: 5,
    bq: 1,
    bathrooms: 5,
    toilets: 6,
    area: null,
    location: "Chevron, Lagos",
    latitude: 6.4498,
    longitude: 3.4729,
    city: "Lagos",
    state: "Lagos",
    isFeatured: true,
    images: [
      "images/properties/sale/house-1/front-1.jpg",
      "images/properties/sale/house-1/front-2.jpg",
      "images/properties/sale/house-1/living-1.jpg",
      "images/properties/sale/house-1/living-2.jpg",
      "images/properties/sale/house-1/living-3.jpg",
      "images/properties/sale/house-1/room-1.jpg",
      "images/properties/sale/house-1/room-2.jpg",
      "images/properties/sale/house-1/room-3.jpg",
      "images/properties/sale/house-1/room-4.jpg",
      "images/properties/sale/house-1/bath-1.jpg",
      "images/properties/sale/house-1/bath-2.jpg",
      "images/properties/sale/house-1/bath-3.jpg",
      "images/properties/sale/house-1/bath-4.jpg",
      "images/properties/sale/house-1/bath-5.jpg",
      "images/properties/sale/house-1/kitchen-1.jpg",
      "images/properties/sale/house-1/corridor-1.jpg",
      "images/properties/sale/house-1/corridor-2.jpg",
      "images/properties/sale/house-1/corridor-3.jpg",
      "images/properties/sale/house-1/corridor-4.jpg",
      "images/properties/sale/house-1/wardrop-1.jpg",
      "images/properties/sale/house-1/balcony-1.jpg",
      "images/properties/sale/house-1/gim-1.jpg",
      "images/properties/sale/house-1/outdoor-1.jpg",
      "images/properties/sale/house-1/pool-1.jpg",
      "images/properties/sale/house-1/pool-2.jpg",
      "images/properties/sale/house-1/cinema-1.jpg",
    ],
    features: [
      "Modern Contemporary Architecture",
      "Swimming Pool",
      "Car Park",
      "Top Notch Modern Appurtenances",
      "Fully Fitted Kitchen",
      "Stamp Concrete Floor",
      "Integrated Audio System",
      "Family Lounge",
      "TV Console",
      "Luxury Sanitary Wares",
      "Stairway Lights",
      "Green Area",
      "Gorgeous Lightings",
      "Boy's Quarters",
      "Great Neighbourhood",
      "Gym",
      "Cinema",
    ],
  },
  {
    title: "Contemporary Neatly Furnished 5 bedroom with 2 service quarters",
    description: "Experience modern luxury in this beautifully furnished 5-bedroom home located in the serene neighborhood of Osapa, Lagos. This contemporary masterpiece features full smart home automation, exquisite chandeliers, royal curtains, inverter ACs, and a well-fitted kitchen with top-tier Bosch appliances.",
    price: 400000000,
    type: "SALE",
    bedrooms: 5,
    bq: 2,
    bathrooms: 5,
    toilets: 6,
    area: null,
    location: "Osapa Lekki, Lagos",
    latitude: 6.4491,
    longitude: 3.5067,
    city: "Lagos",
    state: "Lagos",
    isFeatured: true,
    images: [
     "images/properties/sale/house-2/front-1.jpg",
      "images/properties/sale/house-2/front-2.jpg",
      "images/properties/sale/house-2/living-1.jpg",
      "images/properties/sale/house-2/living-2.jpg",
      "images/properties/sale/house-2/living-3.jpg",
      "images/properties/sale/house-2/living-4.jpg",
      "images/properties/sale/house-2/living-5.jpg",
      "images/properties/sale/house-2/living-6.jpg",
      "images/properties/sale/house-2/living-7.jpg",
      "images/properties/sale/house-2/living-8.jpg",
      "images/properties/sale/house-2/room-1.jpg",
      "images/properties/sale/house-2/room-2.jpg",
      "images/properties/sale/house-2/room-3.jpg",
      "images/properties/sale/house-2/room-4.jpg",
      "images/properties/sale/house-2/room-5.jpg",
      "images/properties/sale/house-2/bath-1.jpg",
      "images/properties/sale/house-2/bath-2.jpg",
      "images/properties/sale/house-2/kitchen-1.jpg",
      "images/properties/sale/house-2/kitchen-2.jpg",
      "images/properties/sale/house-2/kitchen-3.jpg",
      "images/properties/sale/house-2/leisure-1.jpg",
      "images/properties/sale/house-2/center-palor-1.jpg",
      "images/properties/sale/house-2/game-room.jpg",
      "images/properties/sale/house-2/stirecase-1.jpg",
      "images/properties/sale/house-2/stirecase-2.jpg",
      "images/properties/sale/house-2/store-1.jpg",
      "images/properties/sale/house-2/wardrop-1.jpg"
    ],
    features: ["Master Piece Chandeliers", "Water Heaters", "Full home Smart automation with expandable features", "Large section wall and floor tiles finishing", "Royal curtains", "Well fitted Automated walk in closet.", "Well fitted kitchen with Bosch appliances", "TV Consoles", "Flower pots", "Study/shelf", "Inverter", "Snoker table", "Washing machine", "Dinning set", "Bath Tub", "Wall frames and Art works", "Security Entrance and Kitchen exit doors", "kids room", "4 parking lots", "Bed frames & Mattress", "Inverter ACs", "Estate serviced water supply", "Excellent tarred road and drainage network", "Tranquil Environment", "24hrs security"],
  },
  {
    title: "Luxury 6 Bedroom Fully Detached Duplex with Swimming Pool",
    description: "Welcome to this exquisite 6-bedroom fully detached duplex nestled in the heart of Osapa London. Designed with modern contemporary architecture, this stunning home boasts a private swimming pool, rooftop terrace, cinema, and a spacious layout ideal for premium living.",
    price: 1200000000,
    type: "SALE",
    bedrooms: 6,
    bq: 1,
    bathrooms: 6,
    toilets: 7,
    area: null,
    location: "Osapa London, Lagos",
    latitude: 6.4495,
    longitude: 3.5060,
    city: "Lagos",
    state: "Lagos",
    isFeatured: true,
    images: [
      "images/properties/sale/house-6/front-1.jpg",
      "images/properties/sale/house-6/front-2.jpg",
      "images/properties/sale/house-6/front-3.jpg",
      "images/properties/sale/house-6/front-4.jpg",
      "images/properties/sale/house-6/living-1.jpg",
      "images/properties/sale/house-6/living-2.jpg",
      "images/properties/sale/house-6/living-3.jpg",
      "images/properties/sale/house-6/living-4.jpg",
      "images/properties/sale/house-6/room-1.jpg",
      "images/properties/sale/house-6/room-2.jpg",
      "images/properties/sale/house-6/room-3.jpg",
      "images/properties/sale/house-6/room-4.jpg",
      "images/properties/sale/house-6/room-5.jpg",
      "images/properties/sale/house-6/bath-1.jpg",
      "images/properties/sale/house-6/bath-2.jpg",
      "images/properties/sale/house-6/bath-3.jpg",
      "images/properties/sale/house-6/bath-4.jpg",
      "images/properties/sale/house-6/kitchen-1.jpg",
      "images/properties/sale/house-6/mid-living-1.jpg",
      "images/properties/sale/house-6/mid-living-2.jpg",
      "images/properties/sale/house-6/mid-living-3.jpg",
      "images/properties/sale/house-6/gallery.jpg",
    ],
    features: ["Modern Contemporary Architecture", "Swimming Pool", "Ample Car Park", "Top Notch Modern Appurtenances", "Fully Fitted Kitchen", "Stamp Concrete Floor", "Integrated Audio System", "Family Lounge", "Astonishing Woodwork", "Luxury Sanitary Wares", "Stairway Lights", "Green Area", "Gorgeous Lightings", "Boy’s Quarters", "Great Neighbourhood", "Rooftop Terrace", "Cinema"],
  },
  {
    title: "Elegant 5-Bedroom Fully Detached Duplex with Swimming Pool in a Prime Location",
    description: "Discover luxury living in this beautifully designed 5-bedroom fully detached duplex featuring a private swimming pool and modern contemporary architecture.",
    price: 350000000,
    type: "SALE",
    bedrooms: 5,
    bq: 1,
    bathrooms: 5,
    toilets: 6,
    area: null,
    location: "Ikota, Lagos",
    latitude: 6.4402,
    longitude: 3.5319,
    city: "Lagos",
    state: "Lagos",
    isFeatured: true,
    images: [
      "images/properties/sale/house-3/front-1.jpg",
      "images/properties/sale/house-3/living-1.jpg",
      "images/properties/sale/house-3/living-2.jpg",
      "images/properties/sale/house-3/living-3.jpg",
      "images/properties/sale/house-3/living-4.jpg",
      "images/properties/sale/house-3/room-1.jpg",
      "images/properties/sale/house-3/room-2.jpg",
      "images/properties/sale/house-3/room-3.jpg",
      "images/properties/sale/house-3/bath-1.jpg",
      "images/properties/sale/house-3/bath-2.jpg",
      "images/properties/sale/house-3/kitchen-1.jpg",
      "images/properties/sale/house-3/kitchen-2.jpg",
      "images/properties/sale/house-3/corridor-1.jpg",
      "images/properties/sale/house-3/corridor-2.jpg",
      "images/properties/sale/house-3/pool.jpg",
      "images/properties/sale/house-3/stirecase-1.jpg",
      "images/properties/sale/house-3/stirecase-2.jpg",
    ],
    features: ["Modern Contemporary Architecture", "Swimming Pool", "Car Park", "Top Notch Modern Appurtenances", "Fully Fitted Kitchen", "Stamp Concrete Floor", "Integrated Audio System", "TV Consoles", "Family Lounge", "Luxury Sanitary Wares", "Stairway Lights", "Green Area", "Gorgeous Lightings", "Boy’s Quarters", "Great Neighbourhood"],
  },
  {
    title: "Affordable 4-Bedroom Semi-Detached Duplex in Ikota",
    description: "Enjoy spacious, modern, and secure living in this well-designed 4-bedroom semi-detached home with its own compound, located in a serene and secured estate in Ikota.",
    price: 100000000,
    type: "SALE",
    bedrooms: 4,
    bq: 1,
    bathrooms: 4,
    toilets: 5,
    area: null,
    location: "Ikota, Lagos",
    latitude: 6.4402,
    longitude: 3.5319,
    city: "Lagos",
    state: "Lagos",
    isFeatured: false,
    images: [
      "images/properties/sale/house-4/front.jpg",
      "images/properties/sale/house-4/living.jpg",
      "images/properties/sale/house-4/room-1.jpg",
      "images/properties/sale/house-4/room-2.jpg",
      "images/properties/sale/house-4/room-3.jpg",
      "images/properties/sale/house-4/bath.jpg",
      "images/properties/sale/house-4/kitchen.jpg",
    ],
    features: ["All Rooms Ensuite", "Kitchen with Modern Accessories", "Fitted Bathrooms", "Ample Parking Space", "Spacious living room", "Family lounge", "Water Heater", "Heat extractor", "Secured Estate"],
  },
  {
    title: "Modern 3-Bedroom Apartment in Lekki Phase 1 with Top-Class Amenities",
    description: "Step into comfort and style with this stunning 3-bedroom apartment located in the heart of Lekki Phase 1. Designed with outstanding modern architecture, this home is perfect for both residential living and shortlet investment.",
    price: 368000000,
    type: "SALE",
    bedrooms: 3,
    bq: 0,
    bathrooms: 3,
    toilets: 4,
    area: null,
    location: "Lekki Phase 1, Lagos",
    latitude: 6.4329,
    longitude: 3.4608,
    city: "Lagos",
    state: "Lagos",
    isFeatured: true,
    images: [
      "images/properties/sale/house-5/front-1.jpg",
      "images/properties/sale/house-5/front-2.jpg",
      "images/properties/sale/house-5/living-1.jpg",
      "images/properties/sale/house-5/living-2.jpg",
      "images/properties/sale/house-5/living-3.jpg",
      "images/properties/sale/house-5/room-1.jpg",
      "images/properties/sale/house-5/room-2.jpg",
      "images/properties/sale/house-5/room-3.jpg",
      "images/properties/sale/house-5/room-4.jpg",
      "images/properties/sale/house-5/bath-1.jpg",
      "images/properties/sale/house-5/bath-2.jpg",
      "images/properties/sale/house-5/kitchen.jpg",
      "images/properties/sale/house-5/toilet.jpg",
    ],
    features: ["Outstanding Modern Architecture", "Security house", "Astonishing Fully Fitted Kitchen", "Luxury Modern Appurtenances", "Open kitchen", "Gorgeous Lightings", "Great Neighbourhood", "Good for Shorlet", "Elevator", "swimming pool", "Gym"],
  },
  {
    title: "Massive 8-Bedroom Fully Detached Duplex on 2 Acres",
    description: "Experience true coastal luxury with this expansive 8-bedroom fully detached duplex situated on 2 acres of prime waterfront land in Imobido Village.",
    price: 750000000,
    type: "SALE",
    bedrooms: 8,
    bq: 1,
    bathrooms: 8,
    toilets: 9,
    area: 8094,
    location: "Lekki Phase 1, Lagos",
    latitude: 6.4329,
    longitude: 3.4608,
    city: "Lagos",
    state: "Lagos",
    isFeatured: true,
    images: [
      "images/properties/sale/house-7/front-1.jpg",
      "images/properties/sale/house-7/front-2.jpg",
      "images/properties/sale/house-7/outdoor-1.jpg",
      "images/properties/sale/house-7/outdoor-2.jpg",
      "images/properties/sale/house-7/outdoor-3.jpg",
      "images/properties/sale/house-7/outdoor-4.jpg",
      "images/properties/sale/house-7/field-1.jpg",
      "images/properties/sale/house-7/field-2.jpg",
      "images/properties/sale/house-7/field-3.jpg",
      "images/properties/sale/house-7/field-4.jpg",
      "images/properties/sale/house-7/drive-1.jpg",
      "images/properties/sale/house-7/drive-2.jpg",
      "images/properties/sale/house-7/drive-3.jpg",
      "images/properties/sale/house-7/drive-4.jpg",
      "images/properties/sale/house-7/gate-1.jpg",
    ],
    features: ["Outstanding Modern Architecture", "Security house", "Astonishing Fully Fitted Kitchen", "Luxury Modern Appurtenances", "Open kitchen", "Gorgeous Lightings", "Great Neighbourhood", "Good for Shorlet", "Elevator", "swimming pool", "Gym"],
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

async function createProperty(propertyData: PropertyInput) {
  try {
    const areaValue = propertyData.area;
    if (areaValue !== null && typeof areaValue !== 'number') {
      throw new Error(`Invalid area value for "${propertyData.title}": ${areaValue}`);
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
        isfeatured: propertyData.isFeatured ?? false,
        agentid: 'abiterra-admin', // Changed from agentId to agentid
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

    console.log(`✅ Created property: ${property.title} (ID: ${property.id}, Slug: ${property.slug})`);
    return property;
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
  console.log(`Starting to create ${properties.length} properties...`);

  const results = {
    successful: 0,
    failed: 0,
    failures: [] as string[],
  };

  for (const property of properties) {
    try {
      await createProperty(property);
      results.successful++;
    } catch (error) {
      results.failed++;
      results.failures.push(property.title);
    }
  }

  return results;
}

async function main() {
  try {
    const results = await createProperties(propertiesToAdd);

    console.log('\nBatch Creation Summary:');
    console.log(`✅ Successfully created: ${results.successful} properties`);
    console.log(`❌ Failed to create: ${results.failed} properties`);

    if (results.failures.length > 0) {
      console.log('\nFailed properties:');
      results.failures.forEach((title) => console.log(`- ${title}`));
    }
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