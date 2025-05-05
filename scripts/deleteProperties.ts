// scripts/deleteProperties.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to delete properties by titles and locations
async function deletePropertiesByTitlesAndLocations(properties: { title: string; location: string }[]) {
  let deletedCount = 0;
  let notFoundCount = 0;
  
  try {
    console.log(`Attempting to delete ${properties.length} properties...`);
    
    for (const property of properties) {
      // First find the property to confirm it exists
      const existingProperty = await prisma.property.findFirst({
        where: {
          title: property.title,
          location: property.location,
        },
      });

      if (existingProperty) {
        // Delete related images first (to prevent foreign key constraint errors)
        await prisma.image.deleteMany({
          where: {
            propertyid: existingProperty.id,
          },
        });
        
        // Delete related features
        await prisma.feature.deleteMany({
          where: {
            propertyid: existingProperty.id,
          },
        });
        
        // Now delete the property
        await prisma.property.delete({
          where: {
            id: existingProperty.id,
          },
        });
        
        console.log(`✅ Deleted property: "${property.title}" at ${property.location}`);
        deletedCount++;
      } else {
        console.log(`⚠️ Property not found: "${property.title}" at ${property.location}`);
        notFoundCount++;
      }
    }
    
    console.log('\nDeletion Summary:');
    console.log(`✅ Successfully deleted: ${deletedCount} properties`);
    console.log(`⚠️ Not found: ${notFoundCount} properties`);
    
  } catch (error) {
    console.error(`❌ Error deleting properties:`, error);
    throw error;
  }
}

// Properties to delete - exactly matching the ones from addNewProperties.ts
const propertiesToDelete = [
  {
    title: "Exquisite 4-Bedroom Fully Detached Smart Home with Gym & Swimming Pool in Lekki",
    location: "Orchid Road, Lekki",
  },
  {
    title: "Exquisite 5-Bedroom Fully Detached Duplex with BQ, Cinema & Pool in Omole Phase 1",
    location: " Omole Phase 1,Lagos",
  },
  {
    title: "Perfectly Perched 5-Bedroom Luxury Smart Home with Pool & BQ in Lekki Phase 1",
    location: "Lekki Phase 1, Lagos",
  },
  {
    title: "Brand New 4-Bedroom Semi-Detached Duplex in Ikota, Lekki – Luxury, Comfort & Style!",
    location: "Ikota Lekki, Lagos",
  },
  {
    title: "EXCLUSIVE WATERFRONT PROPERTY FOR SALE – 5-Bedroom Semi-Detached Duplex | Banana Island, Ikoyi",
    location: "Banana Island, Lagos",
  },
  {
    title: "4-Bedroom Semi-Detached Duplex plus BQ",
    location: "Orchid Lekki, Lagos",
  },
  {
    title: "Contemporary 4-Bedroom Semi-Detached Duplex + BQ | Modern Luxury & Prime Location!",
    location: "Ikota Lekki, Lagos",
  },
  {
    title: " Elegant 5-Bedroom Fully Detached Duplex with BQ & Swimming Pool | Ikota, Lekki",
    location: "Ikota Lekki, Lagos",
  },
  {
    title: "Exquisite 4-Bedroom Fully Detached Duplex with BQ",
    location: "Ajah, Lagos",
  },
  {
    title: " Majestic 6-Bedroom Smart Home",
    location: "Ikoyi, Lagos",
  },
];

async function main() {
  try {
    await deletePropertiesByTitlesAndLocations(propertiesToDelete);
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();