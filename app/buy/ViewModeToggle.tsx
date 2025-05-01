// app/components/ViewModeToggle.tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import PropertyCard from './PropertyCard';
import Link from 'next/link';
import { useViewMode } from './ViewModeContext';
import { Property } from '@/app/types/property';
import Image from 'next/image';
import { MapPin, Bed, Bath, Square, ArrowRight } from 'lucide-react';

const MapView = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
    </div>
  ),
});

interface ViewModeToggleProps {
  properties: Property[];
}

export default function ViewModeToggle({ properties }: ViewModeToggleProps) {
  const { viewMode } = useViewMode();
  const [mapKey, setMapKey] = useState(Date.now().toString());

  useEffect(() => {
    if (viewMode === 'map') {
      setMapKey(Date.now().toString());
    }
  }, [viewMode]);

  return (
    <div>
      {properties.length > 0 && (
        <>
          {viewMode === 'map' ? (
            <div className="h-[60vh] sm:h-[70vh] lg:h-[80vh] min-h-[400px] rounded-lg overflow-hidden">
              <MapView key={mapKey} properties={properties} zoom={12} />
              <noscript>
                <div className="text-center p-4 text-sm text-gray-600">
                  <p>
                    JavaScript is required to view the map. Browse properties in{' '}
                    <Link href="/buy" className="text-teal-600 hover:text-teal-700">
                      grid view
                    </Link>.
                  </p>
                </div>
              </noscript>
            </div>
          ) : viewMode === 'list' ? (
            <div className="flex flex-col gap-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="flex flex-col sm:flex-row bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 gap-4"
                >
                  <div className="relative w-full sm:w-1/3 aspect-[4/3] rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={property.images?.[0]?.url || '/api/placeholder/800/600'}
                      alt={property.title || 'Property image'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-900 text-base sm:text-lg">
                      {property.title}
                    </h2>
                    <div className="text-gray-600 flex items-center gap-1 text-sm mt-1">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{property.location}</span>
                    </div>
                    <div className="text-base sm:text-lg font-bold text-gray-900 mt-1">
                      {new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 0,
                      }).format(property.price)}
                    </div>
                    <dl className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600 text-sm mt-2">
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
                        <dd>{property.area ? `${property.area} sqft` : 'N/A'}</dd>
                      </div>
                    </dl>
                    <Link
                      href={`/buy/${property.slug}`}
                      className="mt-2 inline-flex items-center gap-2 text-teal-600 font-medium text-sm hover:text-teal-700"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}