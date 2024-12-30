// app/buy/[propertyId]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ViewPropertyDetails from './ViewPropertyDetails';

interface Props {
  params: { propertyId: string };
}

const PropertyDetailPage = async ({ params }: Props) => {
  const { propertyId } = params;
  const parsedPropertyId = parseInt(propertyId, 10);

  if (isNaN(parsedPropertyId) || parsedPropertyId < 1) {
    notFound();
  }

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
      features: { select: { name: true } },
    },
  });

  if (!property) {
    notFound();
  }

  return <ViewPropertyDetails property={property} />;
};

export default PropertyDetailPage;
