// app/buy/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import BuyPropertyDetailClient from '@/app/components/shared/BuyPropertyDetailClient';
import { Property, PropertyImage } from '@/types/property';

type PageProps = {
  params: Promise<{ slug: string }>;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const property = await prisma.property.findUnique({
      where: { slug: resolvedParams.slug },
      select: {
        title: true,
        description: true,
        price: true,
        location: true,
        image: { select: { filepath: true, imagetype: true } },
      },
    });

    if (!property) {
      return { title: 'Property Not Found' };
    }

    const formattedImages = await Promise.all(
      property.image.map(async (image) => {
        if (!image.filepath) return { url: '/placeholder-property.jpg', type: image.imagetype || 'unknown' };
        const { data, error } = await supabase.storage
          .from('properties')
          .createSignedUrl(image.filepath, 31536000);
        if (error || !data?.signedUrl) {
          console.error(`[PropertyDetailMetadata] Signed URL error for ${image.filepath}:`, error?.message);
          return { url: '/placeholder-property.jpg', type: image.imagetype || 'unknown' };
        }
        return { url: data.signedUrl, type: image.imagetype || 'unknown' };
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
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/buy/${resolvedParams.slug}`,
      },
    };
  } catch (error) {
    console.error('[PropertyDetailMetadata] Error generating metadata:', error);
    return { title: 'Property For Sale | Abiterra' };
  }
}

const PropertyDetailPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  if (!resolvedParams?.slug) {
    notFound();
  }

  const property = await prisma.property.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      image: { select: { id: true, url: true, filepath: true, imagetype: true } },
      feature: { select: { id: true, name: true } },
    },
  });

  if (!property) {
    notFound();
  }

  const formattedImages = await Promise.all(
    property.image.map(async (image) => {
      if (!image.filepath) {
        return { 
          id: image.id, 
          url: '/placeholder-property.jpg', 
          imageType: image.imagetype || undefined 
        } as PropertyImage;
      }
      const { data, error } = await supabase.storage
        .from('properties')
        .createSignedUrl(image.filepath, 31536000);
      if (error || !data?.signedUrl) {
        console.error(`[PropertyDetailPage] Signed URL error for ${image.filepath}:`, error?.message);
        return { 
          id: image.id, 
          url: '/placeholder-property.jpg', 
          imageType: image.imagetype || undefined 
        } as PropertyImage;
      }
      return { 
        id: image.id, 
        url: data.signedUrl, 
        imageType: image.imagetype || undefined 
      } as PropertyImage;
    })
  );

  // Create the formatted property object with proper typing
  const formattedProperty: Property = {
    id: property.id,
    title: property.title,
    slug: property.slug,
    description: property.description,
    location: property.location,
    price: property.price,
    type: property.type as Property['type'],
    status: property.status as Property['status'],
    availability: property.availability || false,
    area: property.area || undefined,
    bathrooms: property.bathrooms,
    bedrooms: property.bedrooms,
    bq: property.bq,
    city: property.city,
    state: property.state,
    toilets: property.toilets,
    latitude: property.latitude || undefined,
    longitude: property.longitude || undefined,
    createdat: (property.createdat || new Date()).toISOString(),
    updatedat: (property.updatedat || new Date()).toISOString(),
    isfeatured: property.isfeatured || false,
    agentid: property.agentid,
    images: formattedImages,
    features: property.feature.map(f => ({ id: f.id, name: f.name })),
  };

  return <BuyPropertyDetailClient property={formattedProperty} />;
};

export const revalidate = 3600;

export default PropertyDetailPage;