'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Bed, Bath, Square, ArrowRight, MapPin } from 'lucide-react';

interface Property {
  id: number;
  title: string;
  description: string;
  price: string | number;
  location: string;
  latitude: number | null;
  longitude: number | null;
  type: 'For Sale' | 'For Rent'; // Updated to match API
  specs: {
    area: string;
    beds: number;
    baths: number;
    size: number;
  };
  images: { id: number; url: string }[];
}

const formatPrice = (price: string | number): string => {
  const priceString = price.toString();
  const numericPrice = priceString.replace(/[^0-9.]/g, '');
  const [wholePart, decimalPart] = numericPrice.split('.');
  const formattedWholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decimalPart ? `${formattedWholePart}.${decimalPart}` : formattedWholePart;
};

export default function PropertyCard({ property }: { property: Property }) {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = useCallback(() => {
    if (!property.images || property.images.length === 0) {
      return `/api/placeholder/800/600`;
    }

    const firstImage = property.images[0];
    if (!firstImage.url || typeof firstImage.url !== 'string') {
      return `/api/placeholder/800/600`;
    }

    try {
      if (firstImage.url.startsWith('http')) {
        return firstImage.url;
      }

      if (firstImage.url.startsWith('/api/supabase-image/')) {
        return firstImage.url;
      }

      const cleanPath = firstImage.url.startsWith('/')
        ? firstImage.url.substring(1)
        : firstImage.url;

      return `/api/supabase-image/${encodeURIComponent(cleanPath)}`;
    } catch (e) {
      console.error('Error processing image URL:', e);
      return `/api/placeholder/800/600`;
    }
  }, [property.images]);

  const imageUrl = imageError ? `/api/placeholder/800/600` : getImageUrl();

  const handleImageError = () => {
    console.warn('Image load error for:', property.title, imageUrl);
    setImageError(true);
  };

  return (
    <article className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
        <Image
          src={imageUrl}
          alt={property.title || 'Property image'}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          onError={handleImageError}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          loading="lazy"
          unoptimized
        />
        <button aria-label="Add to favorites" className="absolute top-4 right-4 bg-white/90 p-2.5 rounded-full hover:bg-white">
          <Heart className="w-4 h-4 text-gray-700" />
        </button>
        <div className="absolute bottom-4 right-4">
          <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm">
            {property.type}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-start">
          <h2 className="font-semibold text-gray-900">{property.title}</h2>
          <span className="text-xl font-bold">₦{formatPrice(property.price)}</span>
        </div>
        <div className="text-gray-600 flex items-center gap-1 mt-1">
          <MapPin className="w-4 h-4" />
          {property.location}
        </div>
        {property.specs && (
          <dl className="flex items-center gap-6 text-gray-600 mt-2">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4" />
              <dd>{property.specs.beds} beds</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4" />
              <dd>{property.specs.baths} baths</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Square className="w-4 h-4" />
              <dd>{property.specs.area}</dd>
            </div>
          </dl>
        )}
        <Link href={`/buy/${property.id}`} className="mt-3 inline-flex items-center gap-2 text-teal-600 font-medium group-hover:gap-3 transition-all">
          View Details
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}