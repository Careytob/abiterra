'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

interface ViewPropertyDetailsProps {
  property: {
    id: number;
    price: number;
    images: { url: string }[];
    title: string;
    description: string;
    location: string;
    latitude: number;
    longitude: number;
    bedrooms: number;
    bq: number;
    bathrooms: number;
    toilets: number;
    area: number;
    features: { name: string }[];
  };
  type: 'buy' | 'rent'; // Distinguish between property types
}

const ViewPropertyDetails: React.FC<ViewPropertyDetailsProps> = ({ property, type }) => {
  const PropertyDetailClient = dynamic(() => 
    import('@/app/components/ViewPropertyDetails'), 
    
  );

  useEffect(() => {
    console.log('ViewPropertyDetails received property:', {
      id: property.id,
      latitude: property.latitude,
      longitude: property.longitude,
      hasLatitude: !!property.latitude,
      hasLongitude: !!property.longitude,
    });
  }, [property]);

  return <PropertyDetailClient property={property} type={type} />;
};

export default ViewPropertyDetails;
