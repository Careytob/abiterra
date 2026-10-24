import { Metadata } from 'next';
import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import prisma from '@/lib/prisma';
import { siteConfig, formatPrice, absoluteUrl, rentPeriodLabel } from '@/lib/site-config';
import { loadSiteConfig } from '@/lib/site-settings';
import RentPropertyDetailClient from '@/app/components/shared/RentPropertyDetailClient';

type PageProps = {
  params: Promise<{ propertyId: string }>;
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const FALLBACK_IMAGE = '/images/placeholder.jpg';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await loadSiteConfig(); // apply admin-saved currency/units settings
  const { propertyId } = await params;
  const fallback: Metadata = { title: `Property For Rent | ${siteConfig.name}` };
  if (!UUID_REGEX.test(propertyId)) return fallback;

  try {
    const property = await prisma.property.findFirst({
      where: { id: propertyId, publishstatus: 'PUBLISHED', type: 'RENT' },
      select: { title: true, description: true, price: true },
    });
    if (!property) return fallback;

    const formattedPrice = formatPrice(property.price);
    const period = rentPeriodLabel().long;
    return {
      title: `${property.title} For Rent | ${siteConfig.name}`,
      description: property.description || `Property for rent at ${siteConfig.name}`,
      alternates: { canonical: absoluteUrl(`/rent/${propertyId}`) },
      openGraph: {
        title: `${property.title} - ${formattedPrice}/${period} | ${siteConfig.name}`,
        description: property.description || `Property for rent at ${siteConfig.name}`,
        url: absoluteUrl(`/rent/${propertyId}`),
        type: 'website',
      },
    };
  } catch (error) {
    console.error('[RentDetailMetadata] Error generating metadata:', error);
    return fallback;
  }
}

const PropertyDetailPage = async ({ params }: PageProps) => {
  const { propertyId } = await params;

  if (!propertyId || !UUID_REGEX.test(propertyId)) {
    notFound();
  }

  let property;
  try {
    property = await prisma.property.findFirst({
      where: { id: propertyId, publishstatus: 'PUBLISHED', type: 'RENT' },
      include: {
        image: { select: { id: true, filepath: true, ismain: true }, orderBy: { ismain: 'desc' } },
        feature: { select: { name: true } },
      },
    });
  } catch (err) {
    console.error(`[RentDetailPage] Prisma error for ${propertyId}:`, err);
    notFound();
  }

  if (!property) {
    notFound();
  }

  const images = await Promise.all(
    property.image.map(async (img) => {
      try {
        const { data, error } = await supabase.storage
          .from('properties')
          .createSignedUrl(img.filepath, 3600);
        if (error || !data?.signedUrl) {
          console.warn(`[RentDetailPage] Signed URL failed for ${img.filepath}:`, error?.message);
          return { url: FALLBACK_IMAGE };
        }
        return { url: data.signedUrl };
      } catch (err) {
        console.error(`[RentDetailPage] Error signing ${img.filepath}:`, err);
        return { url: FALLBACK_IMAGE };
      }
    })
  );

  return (
    <>
      <div className="container mx-auto px-4 pt-24">
        <nav className="py-4" aria-label="Breadcrumb">
          <ol className="flex space-x-2 text-sm">
            <li><a href="/" className="text-blue-600 hover:text-blue-800">Home</a></li>
            <li>/</li>
            <li><a href="/rent" className="text-blue-600 hover:text-blue-800">Properties for Rent</a></li>
            <li>/</li>
            <li className="text-gray-600">{property.title}</li>
          </ol>
        </nav>
      </div>

      <RentPropertyDetailClient
        property={{
          id: property.id,
          price: property.price,
          title: property.title,
          description: property.description ?? '',
          location: property.location,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          bq: property.bq,
          toilets: property.toilets,
          latitude: property.latitude ?? siteConfig.map.latitude,
          longitude: property.longitude ?? siteConfig.map.longitude,
          area: property.area ?? 0,
          listedby: property.listedby ?? null,
          features: property.feature,
          images: images.length ? images : [{ url: FALLBACK_IMAGE }],
        }}
      />
    </>
  );
};

export default PropertyDetailPage;
