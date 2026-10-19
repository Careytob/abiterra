import { PrismaClient } from '@/prisma/generated/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function updateBlogImage() {
  const blogImages = [
    {
      oldPath: '/images/properties/sale/house-4/front.jpg',
      newPath: 'images/blog/nigeria-property-inspection.jpg',
    },
    {
      oldPath: '/images/properties/sale/house-5/front.jpg',
      newPath: 'images/blog/cost-buying-property.jpg',
    },
    {
      oldPath: '/images/properties/sale/house-2/front.jpg',
      newPath: 'images/blog/lagos-property-guide.jpg',
    },
    {
      oldPath: '/images/properties/sale/house-1/front.jpg', // Adjust if different
      newPath: 'images/blog/rental-yield-lagos.jpg',
    },
  ];

  try {
    for (const image of blogImages) {
      await prisma.image.updateMany({
        where: {
          url: image.oldPath,
        },
        data: {
          url: image.newPath,
        },
      });
      console.log(`Updated blog image URL: ${image.oldPath} -> ${image.newPath}`);
    }
  } catch (error) {
    console.error('Error updating image:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateBlogImage();