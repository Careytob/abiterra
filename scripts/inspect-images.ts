import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function inspectImages() {
  try {
    const images = await prisma.image.findMany({
      select: {
        id: true,
        url: true,
        propertyId: true,
      },
    });
    console.log('Images in database:');
    images.forEach((img) => {
      console.log(`ID: ${img.id}, Property ID: ${img.propertyId}, URL: ${img.url}`);
    });
  } catch (error) {
    console.error('Error inspecting images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

inspectImages();