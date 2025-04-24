// app/buy/[propertyId]/page.tsx
import { Metadata } from 'next';
import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import BuyPropertyDetailClient from '@/app/components/shared/BuyPropertyDetailClient';

type PageProps = {
  params: Promise<{ propertyId: string }>;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const property = await prisma.property.findUnique({
      where: { id: parseInt(resolvedParams.propertyId, 10) },
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

    const formattedImages = await Promise.all(
      property.images.map(async (image) => {
        if (!image.url) return { url: '/placeholder-property.jpg' };
        const cleanPath = image.url.startsWith('/') ? image.url.substring(1) : image.url;
        const { data, error } = await supabase.storage
          .from('properties')
          .createSignedUrl(cleanPath, 31536000); // Removed transform
        if (error || !data?.signedUrl) {
          console.error(`[PropertyDetailMetadata] Signed URL error for ${cleanPath}:`, error?.message);
          return { url: '/placeholder-property.jpg' };
        }
        console.log(`[PropertyDetailMetadata] Generated signed URL: ${data.signedUrl}`);
        return { url: data.signedUrl };
      })
    );

    const formattedPrice = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(property.price);

    return {
      title: `${property.title} For Sale | Abiterra`,
      description: `Property for sale in ${property.location}. ${property.description?.substring(0, 150)}...`,
      openGraph: {
        title: `${property.title} - ${formattedPrice} | Abiterra`,
        description: property.description,
        images: formattedImages.map((image) => ({
          url: image.url,
          width: 1200,
          height: 630,
        })),
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/buy/${resolvedParams.propertyId}`,
      },
    };
  } catch (error) {
    console.error('[PropertyDetailMetadata] Error generating metadata:', error);
    return { title: 'Property For Sale | Abiterra' };
  }
}

const PropertyDetailPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  if (!resolvedParams?.propertyId) {
    notFound();
  }

  const parsedPropertyId = parseInt(resolvedParams.propertyId, 10);

  if (isNaN(parsedPropertyId) || parsedPropertyId < 1) {
    notFound();
  }

  const property = await prisma.property.findUnique({
    where: { id: parsedPropertyId },
    select: {
      id: true,
      price: true,
      images: { select: { id: true, url: true } },
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

  const formattedImages = await Promise.all(
    property.images.map(async (image) => {
      if (!image.url) return { id: image.id, url: '/placeholder-property.jpg' };
      const cleanPath = image.url.startsWith('/') ? image.url.substring(1) : image.url;
      const { data, error } = await supabase.storage
        .from('properties')
        .createSignedUrl(cleanPath, 31536000); // Removed transform
      if (error || !data?.signedUrl) {
        console.error(`[PropertyDetailPage] Signed URL error for ${cleanPath}:`, error?.message);
        return { id: image.id, url: '/placeholder-property.jpg' };
      }
      console.log(`[PropertyDetailPage] Generated signed URL for image ${image.id}: ${data.signedUrl}`);
      return { id: image.id, url: data.signedUrl };
    })
  );

  return (
    <BuyPropertyDetailClient
      property={{
        ...property,
        latitude: property.latitude ?? 0,
        longitude: property.longitude ?? 0,
        area: property.area ?? 0,
        features: property.features,
        images: formattedImages,
      }}
    />
  );
};

export const revalidate = 3600; // Revalidate every 1 hour

export default PropertyDetailPage;