import { PrismaClient } from '@/prisma/generated/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

const featuredProperties = [
  { title: 'Luxury 5 Bedroom Fully Detached Duplex' },
  // Add other property titles that should have isFeatured: true
];

function generateSlug(property: { title: string; location: string; city: string; id: string }) {
  const rawSlug = `${property.location}-${property.city}-${property.title}`.toLowerCase();
  return `${slugify(rawSlug, { remove: /[*+~.()'"!:@]/g })}-${property.id.split('-')[0]}`;
}

async function cleanSlugs() {
  try {
    const properties = await prisma.property.findMany();
    console.log(`Found ${properties.length} properties to process.`);

    for (const property of properties) {
      const slug = generateSlug({
        title: property.title,
        location: property.location,
        city: property.city,
        id: property.id, // id is a string (UUID)
      });
      const isFeatured = featuredProperties.some((p) => p.title === property.title);

      await prisma.property.update({
        where: { id: property.id },
        data: {
          slug: slug,
          isFeatured: isFeatured,
        },
      });
      console.log(`Updated property: ${property.title} with slug: ${slug}, isFeatured: ${isFeatured}`);
    }
    console.log('Slug cleaning completed successfully.');
  } catch (error) {
    console.error('Error cleaning slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanSlugs();