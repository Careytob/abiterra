// app/properties/[id]/page.tsx
import { Suspense } from 'react';
import ViewPropertyDetails from '@/app/components/ViewPropertyDetails';

async function getProperty(id: string) {
  try {
    const res = await fetch(`/api/properties/${id}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error('Failed to fetch property');
    }

    const data = await res.json();
    
    // Debug log the received data
    console.log('Property data received from API:', {
      id: data.id,
      latitude: data.latitude,
      longitude: data.longitude,
      hasLatitude: !!data.latitude,
      hasLongitude: !!data.longitude,
      latitudeType: typeof data.latitude,
      longitudeType: typeof data.longitude
    });

    return data;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
}

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id);
  
  // Debug log before passing to component
  console.log('Property data being passed to ViewPropertyDetails:', {
    id: property.id,
    latitude: property.latitude,
    longitude: property.longitude,
    hasLatitude: !!property.latitude,
    hasLongitude: !!property.longitude
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewPropertyDetails property={property} />
    </Suspense>
  );
}