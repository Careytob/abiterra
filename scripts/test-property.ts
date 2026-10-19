
// scripts/test-property.ts
import { PrismaClient } from '@/prisma/generated/client';

const prisma = new PrismaClient();

async function test() {
  try {
    // Ensure agent
    await prisma.user.upsert({
      where: { id: 'abiterra-admin' },
      update: {},
      create: {
        id: 'abiterra-admin',
        name: 'Abiterra Admin',
        email: 'admin@abiterra.com',
        createdAt: new Date(),
      },
    });

    // Minimal property
    const property = await prisma.property.create({
      data: {
        id: 'test-uuid',
        slug: 'test-property',
        title: 'Test Property',
        description: 'Test description',
        price: 1000000,
        type: 'SALE',
        bedrooms: 3,
        bathrooms: 2,
        bq: 0,
        toilets: 3,
        area: null,
        location: 'Test Location',
        latitude: 6.0,
        longitude: 3.0,
        city: 'Lagos',
        state: 'Lagos',
        availability: true,
        status: 'AVAILABLE',
        isFeatured: false,
        agentId: 'abiterra-admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Created:', property);
  } catch (error: any) {
    console.error('Error creating test property:');
    console.error('Message:', error.message || 'No message');
    console.error('Meta:', JSON.stringify(error.meta, null, 2) || 'No meta');
    console.error('Cause:', JSON.stringify(error.cause, null, 2) || 'No cause');
    console.error('Stack:', error.stack || 'No stack');
  } finally {
    await prisma.$disconnect();
  }
}

test();
