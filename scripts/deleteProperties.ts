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
  { title: "Elegant 5-Bedroom Fully Detached Duplex with Swimming Pool in a Prime Location", location: "Maryland Estate, Lagos" },
  { title: "5-Bedroom Detached Home in Abuja", location: "Garki, Abuja" },
  { title: "Elegant 3-Bedroom Mansion", location: "New GRA, Port Harcourt" },
  { title: "Luxury 6-Bedroom Mansion in Ikoyi ", location: "Ikoyi, Lagos" },
  { title: "Affordable 4-Bedroom Terrace", location: "Maryland Estate, Lagos" },
  { title: "Newly Built 4-Bedroom", location: "Banana Island, Lagos" },
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
