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
  city: string;
  state: string;
  images: string[];
  features: string[];
}

// Array of properties to add
const propertiesToAdd: PropertyInput[] = [
  {
    title: "Cozy 2-Bedroom Apartment in the Heart of the City",
    description: "This charming 2-bedroom apartment offers modern amenities and a prime location. Enjoy a spacious living area, a fully equipped kitchen, and quick access to shopping, dining, and entertainment.",
    price: 3500000,
    type: "RENT",
    bedrooms: 3,
    bq: 0,
    bathrooms: 3,
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
    features: ["Fully equipped kitchen", "High-speed internet", "Secure parking space","Proximity to public transport","Security","24/7 Power Supply","Air conditioning"]
  },
  {
    title: "Modern Studio Apartment with Stunning Views",
    description: "A sleek and stylish studio apartment featuring floor-to-ceiling windows, breathtaking city views, and contemporary finishes. Perfect for professionals or students.",
    price: 2500000,
    type: "RENT",
    bedrooms: 2,
    bq: 0,
    bathrooms: 2,
    toilets: 2,
    area: 200,
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
    features: ["Large private balcony", "En-suite bathrooms in both bedrooms", "Modern kitchen with high-end finishes","24-hour concierge service","Security","24/7 Power Supply","Fitness center and pool access"]
  },
  {
    title: "Family-Friendly 3-Bedroom Home in a Quiet Neighborhood",
    description: "This family-friendly home offers a large living room, spacious bedrooms, and a fenced yard. Situated in a quiet neighborhood close to schools and parks.",
    price: 5000000,
    type: "RENT",
    bedrooms: 3,
    bq: 1,
    bathrooms: 3,
    toilets: 4,
    area: 200,
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
    features: ["Fenced yard for kids and pets", "Proximity to schools and parks", "Modern kitchen with pantry","Covered parking","Energy-efficient lighting","24/7 Power Supply","Parking Space"]
  },
  {
    title: "Spacious 3-Bedroom Flat in a Secure Estate",
    description: "This spacious 3-bedroom flat boasts an open-plan living area, a fully fitted kitchen, and a private balcony. Located in a gated estate with 24/7 security.",
    price: 5000000,
    type: "RENT",
    bedrooms: 5,
    bq: 1,
    bathrooms: 3,
    toilets: 3,
    area: 200,
    location: "GRA Ikeja, Lagos",
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
    title: "Affordable 1-Bedroom Flat Near Public Transport",
    description: "Conveniently located near public transport, this affordable 1-bedroom flat is ideal for singles or couples. Includes a cozy living area and ample storage.",
    price: 1500000,
    type: "SALE",
    bedrooms: 1,
    bq: 0,
    bathrooms: 1,
    toilets: 2,
    area: 200,
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
    title: "Elegant 2-Bedroom Condo with Balcony",
    description: "This elegant 2-bedroom condo features a large balcony, modern kitchen, and en-suite bathrooms. Located in a vibrant community with easy access to amenities.",
    price: 2500000,
    type: "RENT",
    bedrooms: 2,
    bq: 0,
    bathrooms: 2,
    toilets: 2,
    area: 200,
    location: "Maryland Estate, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
      "/images/properties/rent/apartment-6/front.jpg",
      "/images/properties/rent/apartment-6/living.jpg",
      "/images/properties/rent/apartment-6/kitchen.jpg",
      "/images/properties/rent/apartment-6/bedroom.jpg",
      "/images/properties/rent/apartment-6/bathroom.jpg"
    ],
    features: ["Large private balcony", "En-suite bathrooms in both bedrooms", "Modern kitchen with high-end finishes","24-hour concierge service","Security","24/7 Power Supply","Fitness center and pool access"]
  },
  {
    title: "Upscale 2-Bedroom Loft in Downtown Area",
    description: "An upscale 2-bedroom loft featuring high ceilings, exposed brick walls, and a modern kitchen. Walking distance to restaurants, shops, and nightlife.",
    price: 2000000,
    type: "RENT",
    bedrooms: 2,
    bq: 0,
    bathrooms: 2,
    toilets: 2,
    area: 200,
    location: "Lekki Phase-1, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
      "/images/properties/rent/apartment-7/front.jpg",
      "/images/properties/rent/apartment-7/living.jpg",
      "/images/properties/rent/apartment-7/kitchen.jpg",
      "/images/properties/rent/apartment-7/bedroom.jpg",
      "/images/properties/rent/apartment-7/bathroom.jpg"
    ],
    features: ["High ceilings with exposed beams", "Modern kitchen with granite countertops", "In-unit washer and dryer","Gym","Proximity to nightlife and dining","24/7 Power Supply","Secure access building"]
  },
  {
    title: "Luxury Penthouse with Panoramic Skyline Views",
    description: "Experience the height of luxury in this exclusive penthouse. Features include a private terrace, high-end appliances, and stunning skyline views.",
    price: 7000000,
    type: "RENT",
    bedrooms: 3,
    bq: 1,
    bathrooms: 3,
    toilets: 4,
    area: 200,
    location: "Ikoyi, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
      "/images/properties/rent/apartment-8/front.jpg",
      "/images/properties/rent/apartment-8/living.jpg",
      "/images/properties/rent/apartment-8/kitchen.jpg",
      "/images/properties/rent/apartment-8/bedroom.jpg",
      "/images/properties/rent/apartment-8/bathroom.jpg"
    ],
    features: ["High-end kitchen appliances", "Private terrace", "Jacuzzi and spa bath","Concierge service","Security","24/7 Power Supply","Underground parking"]
  },
  {
    title: "Fully Furnished 4-Bedroom",
    description: "A fully furnished 4-bedroom villa perfect for families. Includes a private swimming pool, lush garden, and spacious living areas for comfortable living.",
    price: 7000000,
    type: "RENT",
    bedrooms: 4,
    bq: 1,
    bathrooms: 4,
    toilets: 5,
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
    features: ["Fully Fitted Kitchen", "Swimming Pool", "Hardwood Floors","Gym","Security","24/7 Power Supply","Parking Space"]
  },
  {
    title: "Beautiful Beachfront Flat for Rent",
    description: "Relax in this stunning beachfront flat. Enjoy ocean views, direct beach access, and a serene atmosphere. Perfect for vacation or long-term stays.",
    price: 5000000,
    type: "RENT",
    bedrooms: 3,
    bq: 0,
    bathrooms: 3,
    toilets: 3,
    area: 200,
    location: "Victoria Island, Lagos",
    city: "Lagos",
    state: "Lagos",
    images: [
      "/images/properties/rent/apartment-10/front.jpg",
      "/images/properties/rent/apartment-10/living.jpg",
      "/images/properties/rent/apartment-10/kitchen.jpg",
      "/images/properties/rent/apartment-10/bedroom.jpg",
      "/images/properties/rent/apartment-10/bathroom.jpg"
    ],
    features: ["Oceanfront location with private beach access", "Wrap-around porch with outdoor seating", "Open-plan kitchen and living area","Solar-powered energy system","Fully furnished and move-in ready","24/7 Power Supply","Parking Space"]
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