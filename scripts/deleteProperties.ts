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
  { title: "Luxury 5-Bedroom Villa", location: "Lekki Phase 1, Lagos" },
  { title: "Luxury 5-Bedroom", location: "Lekki Phase 1, Lagos" },
  { title: "Luxury 5-Bedroom Villa", location: "GRA Ikeja, Lagos" },
  { title: "Luxury 5-Bedroom Villa", location: "Maryland Estate, Lagos" },
  { title: "Luxury 5-Bedroom", location: "Lekki Phase 1, Lagos" },
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
