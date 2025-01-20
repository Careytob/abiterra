'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Define the Property interface to be shared
interface Property {
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
}

interface ViewPropertyDetailsProps {
  property: Property;
  type?: 'RENT' | 'SALE'; // Using uppercase to match the PropertyDetailClient interface
}

const ViewPropertyDetails: React.FC<ViewPropertyDetailsProps> = ({ property, type }) => {
  const PropertyDetailClient = dynamic(() => 
    import('@/app/components/ViewPropertyDetails')
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

  // Combine property data with type before passing to PropertyDetailClient
  const propertyWithType = {
    ...property,
    type
  };

  return <PropertyDetailClient property={propertyWithType} type={'SALE'} />;
};

export default ViewPropertyDetails;