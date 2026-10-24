// app/buy/[slug]/page.tsx
import { Metadata } from 'next';
import { siteConfig, formatPrice, absoluteUrl, watermarkText } from '@/lib/site-config';
import { loadSiteConfig } from '@/lib/site-settings';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import * as Sentry from '@sentry/nextjs';
import BuyPropertyDetailClient from '@/app/components/shared/BuyPropertyDetailClient';
import { Property, PropertyImage } from '@/types/property';
import { getWatermarkedImageUrl } from '@/lib/watermark';

type PageProps = {
  params: Promise<{ slug: string }>;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await loadSiteConfig(); // apply admin-saved currency/units settings
  const resolvedParams = await params;
  try {
    const property = await prisma.property.findUnique({
      where: { slug: resolvedParams.slug, publishstatus: 'PUBLISHED' },
      select: {
        title: true,
        description: true,
        price: true,
        location: true,
        image: { select: { filepath: true, imagetype: true } },
      },
    });

    if (!property) {
      console.warn(`[PropertyDetailMetadata] Property not found for slug: ${resolvedParams.slug}`);
      return { title: 'Property Not Found' };
    }

    const formattedImages = await Promise.all(
      (property.image || []).map(async (image) => {
        if (!image.filepath || typeof image.filepath !== 'string') {
          console.warn(`[PropertyDetailMetadata] Invalid filepath for image:`, image);
          return { url: '/images/placeholder.jpg', type: image.imagetype || 'unknown' };
        }
        try {
          const { data, error } = await supabase.storage
            .from('properties')
            .createSignedUrl(image.filepath, 3600); // Reduced to 1 hour
          if (error || !data?.signedUrl) {
            console.error(`[PropertyDetailMetadata] Signed URL error for ${image.filepath}:`, error?.message);
            Sentry.captureException(error, { extra: { filepath: image.filepath, slug: resolvedParams.slug } });
            return { url: '/images/placeholder.jpg', type: image.imagetype || 'unknown' };
          }
          return { url: data.signedUrl, type: image.imagetype || 'unknown' };
        } catch (err) {
          console.error(`[PropertyDetailMetadata] Error generating signed URL for ${image.filepath}:`, err);
          Sentry.captureException(err, { extra: { filepath: image.filepath, slug: resolvedParams.slug } });
          return { url: '/images/placeholder.jpg', type: image.imagetype || 'unknown' };
        }
      })
    );

    const formattedPrice = formatPrice(property.price);

    return {
      title: `${property.title} For Sale | ${siteConfig.name}`,
      description: `Property for sale in ${property.location}. ${property.description?.substring(0, 150) || ''}...`,
      openGraph: {
        title: `${property.title} - ${formattedPrice} | ${siteConfig.name}`,
        description: property.description || `Property for sale at ${siteConfig.name}`,
        images: formattedImages.map((image) => ({
          url: image.url,
          width: 1200,
          height: 630,
        })),
      },
      alternates: {
        canonical: absoluteUrl(`/buy/${resolvedParams.slug}`),
      },
    };
  } catch (error) {
    console.error('[PropertyDetailMetadata] Error generating metadata:', error);
    Sentry.captureException(error, { extra: { slug: resolvedParams.slug } });
    return { title: `Property For Sale | ${siteConfig.name}` };
  }
}

const PropertyDetailPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  if (!resolvedParams?.slug) {
    console.warn('[PropertyDetailPage] Missing slug parameter');
    notFound();
  }

  let property;
  try {
    property = await prisma.property.findUnique({
      where: { slug: resolvedParams.slug, publishstatus: 'PUBLISHED' },
      include: {
        image: { select: { id: true, url: true, filepath: true, imagetype: true } },
        feature: { select: { id: true, name: true } },
      },
    });
  } catch (err) {
    console.error(`[PropertyDetailPage] Prisma error for slug ${resolvedParams.slug}:`, err);
    Sentry.captureException(err, { extra: { slug: resolvedParams.slug } });
    notFound();
  }

  if (!property) {
    console.warn(`[PropertyDetailPage] Property not found for slug: ${resolvedParams.slug}`);
    notFound();
  }

  const formattedImages = await Promise.all(
    (property.image || []).map(async (image) => {
      if (!image.filepath || typeof image.filepath !== 'string') {
        console.warn(`[PropertyDetailPage] Invalid filepath for image:`, image);
        return {
          id: image.id,
          url: '/images/placeholder.jpg',
          imageType: image.imagetype || undefined,
        } as PropertyImage;
      }

      try {
        const { data, error } = await supabase.storage
          .from('properties')
          .createSignedUrl(image.filepath, 3600); // Reduced to 1 hour
        if (error || !data?.signedUrl) {
          console.error(`[PropertyDetailPage] Signed URL error for ${image.filepath}:`, error?.message);
          Sentry.captureException(error, { extra: { filepath: image.filepath, slug: resolvedParams.slug } });
          return {
            id: image.id,
            url: '/images/placeholder.jpg',
            imageType: image.imagetype || undefined,
          } as PropertyImage;
        }

        // Apply watermark with error handling
        let watermarkedUrl = data.signedUrl;
        try {
          if (siteConfig.features.watermark) watermarkedUrl = await getWatermarkedImageUrl(data.signedUrl, {
            text: watermarkText(),
            opacity: 0.3,
            fontSize: 40,
            color: 'rgba(255, 255, 255, 0.4)',
          });
        } catch (err) {
          console.error(`[PropertyDetailPage] Watermark error for ${image.filepath}:`, err);
          Sentry.captureException(err, { extra: { filepath: image.filepath, slug: resolvedParams.slug } });
          watermarkedUrl = data.signedUrl; // Fallback to signed URL
        }

        return {
          id: image.id,
          url: watermarkedUrl,
          imageType: image.imagetype || undefined,
        } as PropertyImage;
      } catch (err) {
        console.error(`[PropertyDetailPage] Error processing image ${image.filepath}:`, err);
        Sentry.captureException(err, { extra: { filepath: image.filepath, slug: resolvedParams.slug } });
        return {
          id: image.id,
          url: '/images/placeholder.jpg',
          imageType: image.imagetype || undefined,
        } as PropertyImage;
      }
    })
  );

  // Create the formatted property object with proper typing
  const formattedProperty: Property = {
    id: property.id,
    title: property.title,
    slug: property.slug,
    description: property.description || '',
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
    listedby: property.listedby ?? null,
    images: formattedImages,
    features: property.feature.map((f) => ({ id: f.id, name: f.name })),
  };

  return <BuyPropertyDetailClient property={formattedProperty} />;
};

export const revalidate = 3600;

export default PropertyDetailPage;