import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define the property data structure
type PropertyInput = {
  title: string;
  description: string;
  price: number;
  type: 'SALE' | 'RENT';
  bedrooms: number;
  bathrooms: number;
  bq: number;
  toilets: number;
  area: number;
  location: string;
  latitude?: number;
  longitude?: number;
  city: string;
  state: string;
  images: string[];
  features: string[];
}

// Array of properties to add
export const propertiesToAdd: PropertyInput[] = [
  {
    title: "Modern 4-Bedroom Duplex in Maryland",
    description: "A spacious and contemporary 4-bedroom duplex located in a serene neighborhood. Features en-suite bedrooms, a fully fitted kitchen, and ample parking space.",
    price: 250000000,
    type: "SALE",
    bedrooms: 4,
    bq: 1,
    bathrooms: 4,
    toilets: 5,
    area: 500,
    location: "Maryland Estate, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
      "/images/properties/rent/house-1/front.jpg",
      "/images/properties/rent/house-1/living.jpg",
      "/images/properties/rent/house-1/kitchen.jpg",
      "/images/properties/rent/house-1/bedroom.jpg",
      "/images/properties/rent/house-1/bathroom.jpg"
    ],
    features: ["Fully equipped kitchen", "High-speed internet", "Secure parking space","Proximity to public transport","Security","24/7 Power Supply","Air conditioning"]
  },
  {
    title: "Luxurious 5-Bedroom Detached House in Leki",
    description: "A stunning 5-bedroom detached house with a swimming pool, home office, and a private gym. Perfect for a family home.",
    price: 300000000,
    type: "SALE",
    bedrooms: 5,
    bq: 1,
    bathrooms: 5,
    toilets: 6,
    area: 500,
    location: "Lekki Phase 1, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
      "/images/properties/rent/house-2/front.jpg",
      "/images/properties/rent/house-2/living.jpg",
      "/images/properties/rent/house-2/kitchen.jpg",
      "/images/properties/rent/house-2/bedroom.jpg",
      "/images/properties/rent/house-2/bathroom.jpg"
    ],
    features: ["Fitted kitchen with modern appliances", "Private parking for 2 cars", "En-suite bathrooms","24-hour concierge service","Security","24/7 Power Supply","Proximity to schools and shopping malls"]
  },
  {
    title: "Luxurious 5-Bedroom Detached House in GRA Ikeja",
    description: "A stunning 5-bedroom detached house with a swimming pool, home office, and a private gym. Perfect for a family home.",
    price: 300000000,
    type: "SALE",
    bedrooms: 5,
    bq: 1,
    bathrooms: 5,
    toilets: 6,
    area: 600,
    location: "GRA Ikeja, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
      "/images/properties/rent/house-3/front.jpg",
      "/images/properties/rent/house-3/living.jpg",
      "/images/properties/rent/house-3/kitchen.jpg",
      "/images/properties/rent/house-3/bedroom.jpg",
      "/images/properties/rent/house-3/bathroom.jpg"
    ],
    features: ["Fenced yard for kids and pets", "Proximity to schools and parks", "Modern kitchen with pantry","Covered parking","Energy-efficient lighting","24/7 Power Supply","Parking Space"]
  },
  {
    title: "Contemporary 3-Bedroom Apartment in Victoria Island",
    description: " A beautifully designed 2-bedroom apartment with modern finishes, located in the heart of the city.",
    price: 280000000,
    type: "SALE",
    bedrooms: 3,
    bq: 1,
    bathrooms: 3,
    toilets: 4,
    area: 200,
    location: "Victoria Island, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
     "/images/properties/rent/house-4/front.jpg",
      "/images/properties/rent/house-4/living.jpg",
      "/images/properties/rent/house-4/kitchen.jpg",
      "/images/properties/rent/house-4/bedroom.jpg",
      "/images/properties/rent/house-4/bathroom.jpg"
    ],
    features: ["Fully Fitted Kitchen", "En-suite master bedroom", "Gated community with 24/7 security","Private balcony","Dedicated children’s play area","24/7 Power Supply","Parking Space"]
  },
  {
    title: "Affordable 3-Bedroom Terrace",
    description: "A well-built 3-bedroom terrace located in a gated community, with easy access to schools and shopping centers.",
    price: 250000000,
    type: "SALE",
    bedrooms: 3,
    bq: 1,
    bathrooms: 3,
    toilets: 4,
    area: 200,
    location: "Mende Maryland, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
     "/images/properties/rent/house-5/front.jpg",
      "/images/properties/rent/house-5/living.jpg",
      "/images/properties/rent/house-5/kitchen.jpg",
      "/images/properties/rent/house-5/bedroom.jpg",
      "/images/properties/rent/house-5/bathroom.jpg"
    ],
    features: ["Proximity to public transport", "Secure entry system", "Open-plan living and dining area","Built-in wardrobes","24/7 Power Supply","Parking Space"]
  },
  {
    title: "6-Bedroom Mansion with Swimming Pool in Banana Island",
    description: "A luxurious 6-bedroom mansion with world-class amenities, including a swimming pool, cinema room, and a waterfront view.",
    price: 500000000,
    type: "SALE",
    bedrooms: 6,
    bq: 1,
    bathrooms: 6,
    toilets: 7,
    area: 800,
    location: "Banana Island, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
      "/images/properties/rent/house-6/front.jpg",
      "/images/properties/rent/house-6/living.jpg",
      "/images/properties/rent/house-6/kitchen.jpg",
      "/images/properties/rent/house-6/bedroom.jpg",
      "/images/properties/rent/house-6/bathroom.jpg"
    ],
    features: ["Waterfront view", "Cinema room", "Modern kitchen with high-end finishes","Automated lighting and sound systems","Security","24/7 Power Supply","Fitness center and pool access"]
  }
]

async function createProperty(propertyData: PropertyInput) {
    try {
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
          area: propertyData.area,
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
      })
      return property
    } catch (error) {
      console.error(`Error creating property "${propertyData.title}":`, error)
      throw error
    }
  }
async function createProperties(properties: PropertyInput[]) {
  console.log(`Starting to create ${properties.length} properties...`)
  
  const results = {
    successful: 0,
    failed: 0,
    failures: [] as string[]
  }

  for (const property of properties) {
    try {
      await createProperty(property)
      results.successful++
      console.log(`✅ Successfully created: ${property.title}`)
    } catch (error) {
      results.failed++
      results.failures.push(property.title)
      console.error(`❌ Failed to create: ${property.title}`)
    }
  }

  return results
}

async function main() {
  try {
    const results = await createProperties(propertiesToAdd)
    
    console.log('\nBatch Creation Summary:')
    console.log(`✅ Successfully created: ${results.successful} properties`)
    console.log(`❌ Failed to create: ${results.failed} properties`)
    
    if (results.failures.length > 0) {
      console.log('\nFailed properties:')
      results.failures.forEach(title => console.log(`- ${title}`))
    }
  } catch (error) {
    console.error('Batch creation failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()