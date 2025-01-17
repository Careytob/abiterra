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
    title: "Modern 2-Bedroom Apartment in Downtown",
    description: "A spacious 2-bedroom apartment with an open living area and large windows. Close to shops, restaurants, and parks.",
    price: 3000000,
    type: "RENT",
    bedrooms: 2,
    bq: 0,
    bathrooms: 2,
    toilets: 3,
    area: 200,
    location: "Maryland Estate, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
      "/images/properties/rent/apartment-1/front.jpg",
      "/images/properties/rent/apartment-1/living.jpg",
      "/images/properties/rent/apartment-1/kitchen.jpg",
      "/images/properties/rent/apartment-1/bedroom.jpg",
      "/images/properties/rent/apartment-1/bathroom.jpg"
    ],
    features: ["Fully equipped kitchen", "Balcony", "Secure parking space","Proximity to public transport","Security","24/7 Power Supply","Air conditioning"]
  },
  {
    title: "Cozy 1-Bedroom Loft in the City Center",
    description: "A charming loft with a contemporary design and high ceilings, perfect for single professionals or couples.",
    price: 1500000,
    type: "RENT",
    bedrooms: 1,
    bq: 0,
    bathrooms: 1,
    toilets: 1,
    area: 150,
    location: "Lekki Phase 1, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
      "/images/properties/rent/apartment-2/front.jpg",
      "/images/properties/rent/apartment-2/living.jpg",
      "/images/properties/rent/apartment-2/kitchen.jpg",
      "/images/properties/rent/apartment-2/bedroom.jpg",
      "/images/properties/rent/apartment-2/bathroom.jpg"
    ],
    features: ["Fitted kitchen with modern appliances", "Private parking for 2 cars", "Washer/dryer in building","24-hour concierge service","Security","24/7 Power Supply","Proximity to schools and shopping malls"]
  },
  {
    title: "Luxury 3-Bedroom Apartment with City Views",
    description: "A luxurious 3-bedroom apartment located on the 10th floor with panoramic city views. Perfect for families or professionals",
    price: 6000000,
    type: "RENT",
    bedrooms: 3,
    bq: 1,
    bathrooms: 3,
    toilets: 4,
    area: 600,
    location: "GRA Ikeja, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
      "/images/properties/rent/apartment-3/front.jpg",
      "/images/properties/rent/apartment-3/living.jpg",
      "/images/properties/rent/apartment-3/kitchen.jpg",
      "/images/properties/rent/apartment-3/bedroom.jpg",
      "/images/properties/rent/apartment-3/bathroom.jpg"
    ],
    features: ["Elevator", "Proximity to schools and parks", "Modern kitchen with pantry","Covered parking","Energy-efficient lighting","24/7 Power Supply","Parking Space"]
  },
  {
    title: "Contemporary 3-Bedroom Apartment",
    description: " A beautifully designed 3-bedroom apartment with modern finishes, located in the heart of the city.",
    price: 7000000,
    type: "RENT",
    bedrooms: 3,
    bq: 1,
    bathrooms: 3,
    toilets: 4,
    area: 200,
    location: "Victoria Island, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
     "/images/properties/rent/apartment-4/front.jpg",
      "/images/properties/rent/apartment-4/living.jpg",
      "/images/properties/rent/apartment-4/kitchen.jpg",
      "/images/properties/rent/apartment-4/bedroom.jpg",
      "/images/properties/rent/apartment-4/bathroom.jpg"
    ],
    features: ["Fully Fitted Kitchen", "En-suite master bedroom", "Gated community with 24/7 security","Private balcony","Dedicated children’s play area","24/7 Power Supply","Parking Space"]
  },
  {
    title: "Affordable 1-Bedroom Near University Campus",
    description: "A budget-friendly 1-bedroom apartment located just a few blocks from the university. Ideal for students or young professionals.",
    price: 1000000,
    type: "RENT",
    bedrooms: 1,
    bq: 0,
    bathrooms: 1,
    toilets: 2,
    area: 150,
    location: "Mende Maryland, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
     "/images/properties/rent/apartment-5/front.jpg",
      "/images/properties/rent/apartment-5/living.jpg",
      "/images/properties/rent/apartment-5/kitchen.jpg",
      "/images/properties/rent/apartment-5/bedroom.jpg",
      "/images/properties/rent/apartment-5/bathroom.jpg"
    ],
    features: ["Proximity to public transport", "Secure entry system", "Open-plan living and dining area","Built-in wardrobes","24/7 Power Supply","Parking Space"]
  },
  {
    title: "3-Bedroom FLAT",
    description: "A luxurious 3-bedroom FLAT with world-class amenities, including a swimming pool and a waterfront view.",
    price: 7000000,
    type: "RENT",
    bedrooms: 3,
    bq: 1,
    bathrooms: 3,
    toilets: 4,
    area: 200,
    location: "Banana Island, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
      "/images/properties/rent/apartment-6/front.jpg",
      "/images/properties/rent/partment-6/living.jpg",
      "/images/properties/rent/apartment-6/kitchen.jpg",
      "/images/properties/rent/apartment-6/bedroom.jpg",
      "/images/properties/rent/apartment-6/bathroom.jpg"
    ],
    features: ["Waterfront view", "Modern kitchen with high-end finishes","Automated lighting and sound systems","Security","24/7 Power Supply","Fitness center and pool access"]
  },
  {
    title: "Newly Renovated 2-Bedroom Apartment in Suburbs",
    description: "A stylish studio apartment in one of the city's most sought-after neighborhoods. Ideal for city lovers who want easy access to cafes and nightlife.",
    price: 5000000,
    type: "RENT",
    bedrooms: 3,
    bq: 1,
    bathrooms: 3,
    toilets: 4,
    area: 200,
    location: "maryland Estate, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
      "/images/properties/rent/apartment-7/front.jpg",
      "/images/properties/rent/apartment-7/living.jpg",
      "/images/properties/rent/apartment-7/kitchen.jpg",
      "/images/properties/rent/apartment-7/bedroom.jpg",
      "/images/properties/rent/apartment-7/bathroom.jpg"
    ],
    features: [ "Modern kitchen with high-end finishes","Automated lighting and sound systems","Security","24/7 Power Supply","Fitness center and pool access"]
  },
  {
    title: "2-Bedroom in Quiet Residential Area",
    description: " A 2-bedroom apartment with a cozy living room and balcony. Close to parks and family-friendly activities",
    price: 5000000,
    type: "RENT",
    bedrooms: 3,
    bq: 1,
    bathrooms: 3,
    toilets: 4,
    area: 200,
    location: "Lekki Phase-1, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
      "/images/properties/rent/apartment-8/front.jpg",
      "/images/properties/rent/apartment-8/living.jpg",
      "/images/properties/rent/apartment-8/kitchen.jpg",
      "/images/properties/rent/apartment-8/bedroom.jpg",
      "/images/properties/rent/apartment-8/bathroom.jpg"
    ],
    features: ["Modern kitchen with high-end finishes","Automated lighting and sound systems","Security","24/7 Power Supply","Fitness center and pool access"]
  },
  {
    title: " Spacious 3-Bedroom Apartment",
    description: "This spacious 3-bedroom apartment is perfect for a large family. Includes two balconies and modern amenities.",
    price: 4000000,
    type: "RENT",
    bedrooms: 3,
    bq: 1,
    bathrooms: 3,
    toilets: 4,
    area: 200,
    location: "Maryland Estate, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
      "/images/properties/rent/apartment-9/front.jpg",
      "/images/properties/rent/apartment-9/living.jpg",
      "/images/properties/rent/apartment-9/kitchen.jpg",
      "/images/properties/rent/apartment-9/bedroom.jpg",
      "/images/properties/rent/apartment-9/bathroom.jpg"
    ],
    features: ["Modern kitchen with high-end finishes","Automated lighting and sound systems","Security","24/7 Power Supply","Fitness center and pool access"]
  },
  {
    title: "1-Bedroom Loft in the City Center",
    description: "A stylish studio apartment in one of the city's most sought-after neighborhoods. Ideal for city lovers who want easy access to cafes and nightlife.",
    price: 1500000,
    type: "RENT",
    bedrooms: 1,
    bq: 0,
    bathrooms: 1,
    toilets: 2,
    area: 150,
    location: "GRA Ikeja, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
      "/images/properties/rent/apartment-10/front.jpg",
      "/images/properties/rent/apartment-10/living.jpg",
      "/images/properties/rent/apartment-10/kitchen.jpg",
      "/images/properties/rent/apartment-10/bedroom.jpg",
      "/images/properties/rent/apartment-10/bathroom.jpg"
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