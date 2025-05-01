const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkIkotaProperty() {
  // Find the property
  const property = await prisma.property.findFirst({
    where: {
      title: { contains: 'Affordable 4-Bedroom Semi-Detached Duplex in Ikota' },
    },
    include: {
      image: {
        select: {
          id: true,
          url: true,
          isPrimary: true,
          propertyId: true,
        },
      },
    },
  });

  console.log('Property:', property);

  // Check all images for this property
  const allImages = await prisma.image.findMany({
    where: { propertyId: 'bb4d0a84-b44b-4def-93c0-50792d836551' },
  });
  console.log('All Images for Property:', allImages);
}

checkIkotaProperty()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
  });