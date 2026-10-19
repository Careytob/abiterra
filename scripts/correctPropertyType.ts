
import { PrismaClient } from '@/prisma/generated/client';


const prisma = new PrismaClient();

async function correctPropertyType() {
  try {
    // Update the property type where it was mistakenly set to 'SALE'
    const updatedProperty = await prisma.property.updateMany({
      where: {
        title: "Affordable 1-Bedroom Flat Near Public Transport", // Use a unique identifier (e.g., title)
        type: "SALE" // Current incorrect type
      },
      data: {
        type: "RENT" // Correct type
      }
    });

    console.log(
      `✅ Successfully updated ${updatedProperty.count} property(ies) to the correct type.`
    );
  } catch (error) {
    console.error("❌ Error correcting property type:", error);
  } finally {
    await prisma.$disconnect();
  }
}

correctPropertyType();
