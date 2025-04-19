
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
};

export const propertiesToAdd: PropertyInput[] = [
  {
    title: "Luxury 5 Bedroom Fully Detached Duplex.",
    description: "This stunning property offers a unique blend of luxury, comfort, and modernity. With its prime location, top-notch amenities, and beautiful design, this duplex is the perfect choice for those seeking an upscale living experience.",
    price: 695000000,
    type: "SALE",
    bedrooms: 5,
    bq: 1,
    bathrooms: 5,
    toilets: 6,
    area: null,
    location: "Chevron, Lagos",
    city: "Lagos",
    state: "Lagos",
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
    features: ["Modern Contemporary Architecture", "Swimming Pool", "Car Park", "Top Notch Modern Appurtenances", "Fully Fitted Kitchen", "Stamp Concrete Floor", "Integrated Audio System", "Family Lounge", "TV Console", "Luxury Sanitary Wares", "Stairway Lights", "Green Area", "Gorgeous Lightings", "Boy's Quarters", "Great Neighbourhood", "Gym", "Cinema"],
  },
  {
    title: "Contemporary Neatly Furnished 5 bedroom with 2 service quarters.",
    description: "Experience modern luxury in this beautifully furnished 5-bedroom home located in the serene neighborhood of Osapa, Lagos. This contemporary masterpiece features full smart home automation, exquisite chandeliers, royal curtains, inverter ACs, and a well-fitted kitchen with top-tier Bosch appliances. Enjoy spacious interiors with premium floor-to-ceiling tile finishes, an automated walk-in closet, snooker table, stylish TV consoles, study area, and elegant artworks throughout.",
    price: 400000000,
    type: "SALE",
    bedrooms: 5,
    bq: 2,
    bathrooms: 5,
    toilets: 6,
    area: null,
    location: "Osapa Lekki, Lagos",
    city: "Lagos",
    state: "Lagos",
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
      "images/properties/sale/house-2/bath-1-1.jpg",
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
      "images/properties/sale/house-2/wardrop-1.jpg",
    ],
    features: ["Master Piece Chandeliers", "Water Heaters", "Full home Smart automation with expandable features", "Large section wall and floor tiles finishing", "Royal curtains", "Well fitted Automated walk in closet.", "Well fitted kitchen with Bosch appliances", "TV Consoles", "Flower pots", "Study/shelf", "Inverter", "Snoker table", "Washing machine", "Dinning set", "Bath Tub", "Wall frames and Art works", "Security Entrance and Kitchen exit doors", "kids room", "4 parking lots", "Bed frames & Mattress", "Inverter ACs", "Estate serviced water supply", "Excellent tarred road and drainage network", "Tranquil Environment", "24hrs security"],
  },
  {
    title: "Luxury 6 Bedroom Fully Detached Duplex with Swimming Pool.",
    description: "Welcome to this exquisite 6-bedroom fully detached duplex nestled in the heart of Osapa London. Designed with modern contemporary architecture, this stunning home boasts a private swimming pool, rooftop terrace, cinema, and a spacious layout ideal for premium living.Step inside to experience top-notch finishes including a fully fitted kitchen, integrated audio system, family lounge, luxury sanitary wares, stairway lighting, and astonishing woodwork. The exterior features a green area, stamped concrete floors, ample parking space, and a separate boy’s quarters — all set within a serene and upscale neighborhood.This home is the perfect blend of elegance, comfort, and functionality — ideal for discerning homeowners seeking luxury in every detail.",
    price: 1200000000,
    type: "SALE",
    bedrooms: 6,
    bq: 1,
    bathrooms: 6,
    toilets: 7,
    area: null,
    location: "Osapa London, Lagos",
    city: "Lagos",
    state: "Lagos",
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
    description: "Discover luxury living in this beautifully designed 5-bedroom fully detached duplex featuring a private swimming pool and modern contemporary architecture. Located in a serene and well-developed neighborhood, this home offers a perfect mix of comfort, functionality, and style.Highlights include a fully fitted kitchen, integrated audio system, spacious family lounge, stylish TV console, luxury sanitary wares, stairway lighting, and stamped concrete flooring. The property also features a green area, ample parking, boy’s quarters, and stunning lighting details throughout.This is more than a home — it’s a lifestyle upgrade.",
    price: 350000000,
    type: "SALE",
    bedrooms: 5,
    bq: 1,
    bathrooms: 5,
    toilets: 6,
    area: null,
    location: "Ikota, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
      "images/properties/sale/house-3/front-1.jpg",
      "images/properties/sale/house-3/living-1.jpg",
      "images/properties/sale/house-3/living-2.jpg",
      "images/properties/sale/house-3/living-3.jpg",
      "images/properties/sale/house-3/living-4.jpg",
      "images/properties/sale/house-3/room-1.jpg",
      "images/properties/sale/house-3/room-2.jpg",
      "images/properties/sale/house-3/room-3.jpg",
      "images/properties/sale/house-3/bath-1-1.jpg",
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
    title: "Affordable 4-Bedroom Semi-Detached Duplex in Ikota.",
    description: "Enjoy spacious, modern, and secure living in this well-designed 4-bedroom semi-detached home with its own compound, located in a serene and secured estate in Ikota.All rooms are ensuite and complemented by a spacious living room, a family lounge, and a fully equipped kitchen with modern accessories including a heat extractor. The home also features fitted bathrooms, water heaters, and ample parking space.Perfect for families or individuals seeking comfort, privacy, and great value in a prime location.",
    price: 100000000,
    type: "SALE",
    bedrooms: 4,
    bq: 1,
    bathrooms: 4,
    toilets: 5,
    area: null,
    location: "Ikota, Lagos",
    city: "Lagos",
    state: "Lagos",
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
    title: "Modern 3-Bedroom Apartment in Lekki Phase 1 with Top-Class Amenities.",
    description: "Step into comfort and style with this stunning 3-bedroom apartment located in the heart of Lekki Phase 1. Designed with outstanding modern architecture, this home is perfect for both residential living and shortlet investment.It features an open-plan, fully fitted kitchen, luxury fittings, gorgeous lighting, and spacious living areas. The property is housed in a secure development with a dedicated security house, elevator, swimming pool, and gym — all set in a prime and vibrant neighborhood.Enjoy the perfect blend of luxury, convenience, and lifestyle in one of Lagos’ most sought-after locations.",
    price: 368000000,
    type: "SALE",
    bedrooms: 3,
    bq: 0,
    bathrooms: 3,
    toilets: 4,
    area: null,
    location: "Lekki Phase 1, Lagos",
    city: "Lagos",
    state: "Lagos",
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
    title: "Massive 8-Bedroom Fully Detached Duplex on 2 Acres.",
    description: "Experience true coastal luxury with this expansive 8-bedroom fully detached duplex situated on 2 acres of prime waterfront land in Imobido Village, just after the Free Trade Zone 2nd Gate.This rare gem features breathtaking views, a private swimming pool, multiple boys’ quarters (BQs), and unmatched space for both residential or investment purposes. With close proximity to the beach and excellent development potential, this property is ideal for a private estate, resort, or exclusive retreat.Don't miss this opportunity to own a piece of paradise in one of the fastest-growing areas in the Lekki axis.",
    price: 750000000,
    type: "SALE",
    bedrooms: 8,
    bq: 1,
    bathrooms: 8,
    toilets: 9,
    area: 8094,
    location: "Lekki Phase 1, Lagos",
    city: "Lagos",
    state: "Lagos",
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

async function createProperty(propertyData: PropertyInput) {
  try {
    const areaValue = propertyData.area;
    if (areaValue !== null && typeof areaValue !== 'number') {
      throw new Error(`Invalid area value for property "${propertyData.title}": ${areaValue}`);
    }
    const property = await prisma.property.create({
      data: {
        title: propertyData.title,
        description: propertyData.description,
        price: propertyData.price,
        type: propertyData.type,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        bq: propertyData.bq,
        toilets: propertyData.toilets,
        area: areaValue,
        location: propertyData.location,
        city: propertyData.city,
        state: propertyData.state,
        images: {
          create: propertyData.images.map(url => ({
            url
          }))
        },
        features: {
          create: propertyData.features.map(name => ({
            name
          }))
        },
        status: 'AVAILABLE',
        agentId: 'abiterra-admin'
      }
    });
    return property;
  } catch (error) {
    console.error(`Error creating property "${propertyData.title}":`, error);
    throw error;
  }
}

async function createProperties(properties: PropertyInput[]) {
  console.log(`Starting to create ${properties.length} properties...`);
  
  const results = {
    successful: 0,
    failed: 0,
    failures: [] as string[]
  };

  for (const property of properties) {
    try {
      await createProperty(property);
      results.successful++;
      console.log(`✅ Successfully created: ${property.title}`);
    } catch (error) {
      results.failed++;
      results.failures.push(property.title);
      console.error(`❌ Failed to create: ${property.title}`);
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
      results.failures.forEach(title => console.log(`- ${title}`));
    }
  } catch (error) {
    console.error('Batch creation failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
