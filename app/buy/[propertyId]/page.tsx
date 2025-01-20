import { Metadata } from 'next';
import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import BuyPropertyDetailClient from '@/app/components/shared/BuyPropertyDetailClient';

type PageProps = {
  params: {
    propertyId: string;
  };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const property = await prisma.property.findUnique({
      where: { id: parseInt(params.propertyId, 10) },
      select: {
        title: true,
        description: true,
        price: true,
        location: true,
        images: { select: { url: true } },
      },
    });

    if (!property) {
      return { title: 'Property Not Found' };
    }

    const formattedPrice = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(property.price);

    return {
      title: `${property.title} For Sale | Your Brand`,
      description: `Property for sale in ${property.location}. ${property.description?.substring(0, 150)}...`,
      openGraph: {
        title: `${property.title} - ${formattedPrice} | Your Brand`, // No "/Year"
        description: property.description,
        images: property.images.map((image) => ({
          url: image.url,
          width: 1200,
          height: 630,
        })),
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/buy/${params.propertyId}`,
      },
    };
    
  } catch (error) {
    console.error('Error generating metadata:', error);
    return { title: 'Property For Sale | Your Brand' };
  }
}

const PropertyDetailPage = async ({ params }: PageProps) => {
  if (!params?.propertyId) {
    notFound();
  }

  const parsedPropertyId = parseInt(params.propertyId, 10);

  if (isNaN(parsedPropertyId) || parsedPropertyId < 1) {
    notFound();
  }

  const property = await prisma.property.findUnique({
    where: { id: parsedPropertyId },
    select: {
      id: true,
      price: true,
      images: { select: { url: true } },
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
    <BuyPropertyDetailClient 
      property={{
        ...property,
        latitude: property.latitude ?? 0,
        longitude: property.longitude ?? 0,
        features: property.features,
        images: property.images,
      }}
    />
  );
};

export default PropertyDetailPage;
