import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ViewPropertyDetails from '../../components/shared/PropertyDetailClient';
import ContactForm from '@/app/components/shared/ContactForm';
import { ContactDialog } from '@/app/components/shared/ContactDialog';
import ShareButton from '@/app/components/shared/ShareButton';
import PropertyDetailClient from '../../components/shared/PropertyDetailClient';

// Define the property type
type Property = {
  id: number;
  price: number;
  images: string[];
  title: string;
  bathrooms: number;
  bedrooms: number;
  bq: number;
  toilets: number;
  area: number;
  description: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  features: { name: string }[];
};

// Define params type
type PageProps = {
  params: {
    propertyId: string;
  };
};

// Add metadata generation if needed
export async function generateMetadata({ params }: PageProps) {
  const { propertyId } = params;
  // Add your metadata logic here
  return {
    title: `Property ${propertyId}`,
  };
}

const PropertyDetailPage = async ({ params }: PageProps) => {
  if (!params?.propertyId) {
    notFound();
  }

  const parsedPropertyId = parseInt(params.propertyId, 10);

  if (isNaN(parsedPropertyId) || parsedPropertyId < 1) {
    notFound();
  }

  try {
    const property = await prisma.property.findUnique({
      where: { id: parsedPropertyId },
      select: {
        id: true,
        price: true,
        images: true,
        title: true,
        bathrooms: true,
        bedrooms: true,
        bq: true,
        toilets: true,
        area: true,
        description: true,
        location: true,
        latitude: true,
        longitude: true,
        features: { select: { name: true } },
      },
    });

    if (!property) {
      notFound();
    }

    return (
      <ViewPropertyDetails 
        property={{
          ...property,
          latitude: property.latitude ?? 0,
          longitude: property.longitude ?? 0,
          features: property.features,
          images: property.images
        }} 
      />
    );
  } catch (error) {
    console.error('Error fetching property:', error);
    notFound();
  }
};

export default PropertyDetailPage;