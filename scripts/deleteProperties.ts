import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to delete properties by titles and locations
async function deletePropertiesByTitlesAndLocations(properties: { title: string; location: string }[]) {
  try {
    for (const property of properties) {
      await prisma.property.deleteMany({
        where: {
          title: property.title,
          location: property.location,
        },
      });
      console.log(`✅ Deleted property: ${property.title} at ${property.location}`);
    }
  } catch (error) {
    console.error(`❌ Error deleting properties:`, error);
    throw error;
  }
}

// Properties to delete
const propertiesToDelete = [
  { title: "Modern 4-Bedroom Duplex in Maryland", location: "Maryland Estate, Lagos" },
  { title: "Luxurious 5-Bedroom Detached House", location: "Lekki Phase 1, Lagos" },
  { title: "Luxurious 5-Bedroom Detached House", location: "GRA Ikeja, Lagos" },
  { title: "Contemporary 3-Bedroom Apartment", location: "Victoria Island, Lagos" },
  { title: "Affordable 3-Bedroom Terrace", location: "Mende Maryland, Lagos" },
  { title: "6-Bedroom Mansion with Swimming Pool", location: "Banana Island, Lagos" },
];

async function main() {
  try {
    await deletePropertiesByTitlesAndLocations(propertiesToDelete);
  } catch (error) {
    console.error('Error deleting properties:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
