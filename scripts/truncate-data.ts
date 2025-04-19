import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function truncateData() {
  try {
    await prisma.image.deleteMany({});
    await prisma.property.deleteMany({});
    console.log('Truncated property and image tables');
  } catch (error) {
    console.error('Error truncating data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

truncateData();