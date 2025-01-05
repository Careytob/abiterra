import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const areaCoordinates: Record<string, { lat: number; lng: number }> = {
  // Lagos Areas
  'Lekki': { lat: 6.4698, lng: 3.5852 },
  'Ikeja': { lat: 6.6018, lng: 3.3515 },
  'Victoria Island': { lat: 6.4281, lng: 3.4219 },
  'Ajah': { lat: 6.4698, lng: 3.5652 },
  'Ikoyi': { lat: 6.4500, lng: 3.4333 },
  'Surulere': { lat: 6.4904, lng: 3.3457 },
  'Yaba': { lat: 6.5163, lng: 3.3853 },
  'Gbagada': { lat: 6.5608, lng: 3.3897 },
  'Maryland': { lat: 6.5761, lng: 3.3661 },
  'Magodo': { lat: 6.6179, lng: 3.3773 },
  
  // Abuja Areas
  'Maitama': { lat: 9.0833, lng: 7.5000 },
  'Asokoro': { lat: 9.0437, lng: 7.5048 },
  'Wuse': { lat: 9.0765, lng: 7.4799 },
  'Garki': { lat: 9.0333, lng: 7.4833 },
  
  // Port Harcourt Areas
  'Old GRA': { lat: 4.8156, lng: 7.0498 },
  'New GRA': { lat: 4.8244, lng: 7.0336 },
  'Peter Odili Road': { lat: 4.7933, lng: 7.0323 }
};

async function updatePropertyCoordinates() {
  try {
    // Get all properties that don't have coordinates
    const properties = await prisma.property.findMany({
      where: {
        OR: [
            { latitude: { equals: null } },
            { longitude: { equals: null } }
        ]   
      }
    });
    
    console.log(`Found ${properties.length} properties without coordinates`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const property of properties) {
      console.log(`Processing property: ${property.id} - Location: ${property.location}`);
      
      // Find matching area in the location string
      const matchingArea = Object.keys(areaCoordinates).find(
        area => property.location.toLowerCase().includes(area.toLowerCase())
      );
      
      if (matchingArea) {
        const coordinates = areaCoordinates[matchingArea];
        
        // Add some random variation (±0.01 degree, roughly ±1km)
        const lat = coordinates.lat + (Math.random() - 0.5) * 0.01;
        const lng = coordinates.lng + (Math.random() - 0.5) * 0.01;
        
        await prisma.property.update({
          where: { id: property.id },
          data: {
            latitude: lat,
            longitude: lng,
          },
        });
        
        console.log(`✅ Updated coordinates for property ${property.id} in ${matchingArea}`);
        updatedCount++;
      } else {
        console.log(`❌ No matching area found for property ${property.id}: ${property.location}`);
        skippedCount++;
      }
    }

    console.log('\nUpdate Summary:');
    console.log(`Total properties processed: ${properties.length}`);
    console.log(`Successfully updated: ${updatedCount}`);
    console.log(`Skipped (no matching area): ${skippedCount}`);

  } catch (error) {
    console.error('Error updating properties:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updatePropertyCoordinates()
  .then(() => console.log('Script completed'))
  .catch(console.error);