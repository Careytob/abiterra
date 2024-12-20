const { PrismaClient } = require('@prisma/client');

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
  city: string;
  state: string;
  images: string[];
  features: string[];
}

// Array of properties to add
const propertiesToAdd: PropertyInput[] = [
  {
    title: "Luxury 5-Bedroom Villa",
    description: "Magnificent 5-bedroom luxury villa in the heart of Lekki Phase 1",
    price: 250000000,
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
      "/images/house1-front.jpg",
      "/images/house1-living.jpg",
      "/images/house1-kitchen.jpg",
      "/images/house1-bedroom.jpg",
      "/images/house1-toilet.jpg"
    ],
    features: ["City View", "Modern Kitchen", "Hardwood Floors"]
  },
  {
    title: "Luxury 5-Bedroom",
    description: "Magnificent 5-bedroom luxury villa in the heart of Lekki Phase 1",
    price: 260000000,
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
      "/images/house2-front.jpg",
      "/images/house2-living.jpg",
      "/images/house2-kitchen.jpg",
      "/images/house2-bedroom.jpg",
      "/images/house2-toilet.jpg"
    ],
    features: ["City View", "Modern Kitchen", "Hardwood Floors"]
  },
  {
    title: "Luxury 5-Bedroom Villa",
    description: "Magnificent 5-bedroom luxury villa in the heart of Lekki Phase 1",
    price: 290000000,
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
      "/images/house3-front.jpg",
      "/images/house3-living.jpg",
      "/images/house3-kitchen.jpg",
      "/images/house3-bedroom.jpg",
      "/images/house3-toilet.jpg"
    ],
    features: ["City View", "Modern Kitchen", "Hardwood Floors"]
  },
  {
    title: "Luxury 5-Bedroom Villa",
    description: "Magnificent 5-bedroom luxury in GRA Ikeja, Lagos",
    price: 250000000,
    type: "SALE",
    bedrooms: 5,
    bq: 1,
    bathrooms: 5,
    toilets: 6,
    area: 500,
    location: "GRA Ikeja, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
      "/images/house4-front.jpg",
      "/images/house4-living.jpg",
      "/images/house4-kitchen.jpg",
      "/images/house4-bedroom.jpg",
      "/images/house4-toilet.jpg"
    ],
    features: ["City View", "Modern Kitchen", "Hardwood Floors"]
  },
  {
    title: "Luxury 5-Bedroom",
    description: "Magnificent 5-bedroom luxury villa in the heart of Lekki Phase 1",
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
      "/images/house5-front.jpg",
      "/images/house5-living.jpg",
      "/images/house5-kitchen.jpg",
      "/images/house5-bedroom.jpg",
      "/images/house5-toilet.jpg"
    ],
    features: ["City View", "Modern Kitchen", "Hardwood Floors"]
  },
  {
    title: "Luxury 5-Bedroom Villa",
    description: "Magnificent 5-bedroom luxury villa in the heart of Lekki Phase 1",
    price: 280000000,
    type: "SALE",
    bedrooms: 5,
    bq: 1,
    bathrooms: 5,
    toilets: 6,
    area: 500,
    location: "Maryland Estate, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
      "/images/house6-front.jpg",
      "/images/house6-living.jpg",
      "/images/house6-kitchen.jpg",
      "/images/house6-bedroom.jpg",
      "/images/house6-toilet.jpg"
    ],
    features: ["City View", "Modern Kitchen", "Hardwood Floors"]
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