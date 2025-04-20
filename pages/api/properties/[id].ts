// pages/api/properties/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const propertyId = parseInt(id as string, 10);

    if (isNaN(propertyId)) {
      return res.status(400).json({ error: 'Invalid property ID' });
    }

    const property = await prisma.property.findUnique({
      where: {
        id: propertyId,
      },
      include: {
        images: true,
        features: true,
      },
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const processedImages = await Promise.all(
      property.images.map(async (image) => {
        if (!image.url) return { ...image, url: `/api/placeholder/800/600` };
        const { data, error } = await supabase.storage
          .from('properties')
          .createSignedUrl(image.url, 7200);
        if (error || !data?.signedUrl) {
          console.error(`Signed URL error for ${image.url}:`, error?.message);
          return { ...image, url: `/api/placeholder/800/600` };
        }
        return { ...image, url: data.signedUrl };
      })
    );

    const response = {
      id: property.id,
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location,
      latitude: property.latitude,
      longitude: property.longitude,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      toilets: property.toilets,
      bq: property.bq,
      area: property.area !== null ? `${property.area} sqft` : 'Not Available',
      images: processedImages,
      features: property.features,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch property' });
  }
}