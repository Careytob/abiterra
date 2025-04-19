import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateImageUrls() {
  try {
    const images = await prisma.image.findMany({
      where: {
        url: { startsWith: '/images/properties/' },
      },
    });

    for (const img of images) {
      const supabasePath = img.url.replace(/^\//, '');
      await prisma.image.update({
        where: { id: img.id },
        data: { url: supabasePath },
      });
      console.log(`Updated image ${img.id}: ${img.url} -> ${supabasePath}`);
    }
  } catch (error) {
    console.error('Error updating image URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateImageUrls();