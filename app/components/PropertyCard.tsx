// components/PropertyCard.jsx
'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    images: { id: string; url: string }[];
    type: string;
    specs: {
      area: string;
      beds: number;
      baths: number;
      size: number;
    };
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.error(`Image failed to load: ${property.images[0]?.url}`);
    setImageError(true);
  };

  const getImageUrl = useCallback(() => {
    if (!property.images || property.images.length === 0 || !property.images[0].url || imageError) {
      return `/api/placeholder/800/600`;
    }
    return property.images[0].url; // Signed URL
  }, [property.images, imageError]);

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="group bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative w-full h-48">
          <Image
            src={getImageUrl()}
            alt={property.title || 'Property image'}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            onError={handleImageError}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            loading="lazy"
            unoptimized // Disable Next.js image optimization
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">{property.title}</h3>
          <p className="text-gray-600 text-sm truncate">{property.location}</p>
          <p className="text-xl font-bold mt-2">${property.price.toLocaleString()}</p>
          <div className="flex space-x-4 text-sm text-gray-500 mt-2">
            <span>{property.specs.beds} Beds</span>
            <span>{property.specs.baths} Baths</span>
            <span>{property.specs.area}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}