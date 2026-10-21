// app/components/PropertyCard.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { formatPrice, formatArea } from '@/lib/site-config';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Bed, Bath, Square, ArrowRight, MapPin } from 'lucide-react';
import { Property } from '@/app/types/property';


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
    <article className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="relative overflow-hidden rounded-t-xl aspect-[4/3]">
      <Link
          href={`/buy/${property.slug}`}>
        <Image
          src={imageUrl}
          alt={property.title || 'Property image'}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
          loading="lazy"
          unoptimized
        />
        </Link>
        <button
          aria-label="Add to favorites"
          className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
        >
          <Heart className="w-4 h-4 text-gray-700" />
        </button>
        <div className="absolute bottom-3 right-3">
          <span className="bg-teal-600 text-white px-2.5 py-1 rounded-full text-xs font-medium">
            {property.type}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
          <h2 className="font-semibold text-gray-900 text-base md:text-lg">
            {property.title}
          </h2>
          <span className="text-base md:text-lg font-bold text-gray-900">
            {formatPrice(property.price)}
          </span>
        </div>
        <div className="text-gray-600 flex items-center gap-1 text-sm">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-1">{property.location}</span>
        </div>
        <dl className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600 text-sm">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <dd>{property.bedrooms || 'N/A'} beds</dd>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <dd>{property.bathrooms || 'N/A'} baths</dd>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <dd>{formatArea(property.area)}</dd>
          </div>
        </dl>
        <Link
          href={`/buy/${property.slug}`}
          className="mt-2 inline-flex items-center gap-2 text-teal-600 font-medium text-sm hover:text-teal-700 group-hover:gap-3 transition-all"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}