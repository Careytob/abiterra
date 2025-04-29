'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import PropertyCard from './PropertyCard';
import Link from 'next/link';
import { useViewMode } from './ViewModeContext';

const MapView = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
    </div>
  ),
});

interface Property {
  id: number;
  title: string;
  description: string;
  price: string | number;
  location: string;
  latitude: number | null;
  longitude: number | null;
  type: 'For Sale' | 'For Rent';
  specs: {
    area: string;
    beds: number;
    baths: number;
    size: number;
  };
  images: { id: number; url: string }[];
}

interface ViewModeToggleProps {
  properties: Property[];
}

export default function ViewModeToggle({ properties }: ViewModeToggleProps) {
  const { viewMode } = useViewMode();
  const [mapKey, setMapKey] = useState(Date.now().toString());

  // Refresh map key when viewMode changes to 'map'
  useEffect(() => {
    if (viewMode === 'map') {
      setMapKey(Date.now().toString());
    }
  }, [viewMode]);

  return (
    <div>
      {properties.length > 0 && (
        viewMode === 'map' ? (
          <div className="h-[80vh] min-h-[600px] rounded-lg overflow-hidden">
            {/* 
              Map height options:
              - h-[80vh]: 80% of viewport height (responsive, taller on larger screens)
              - h-[600px]: Fixed height (previous default, good for consistency)
              - h-[800px]: Taller fixed height (matches older designs)
              - h-[100vh]: Full viewport height (maximizes map, may push content below fold)
              - h-[60vh]: Shorter responsive height (more compact)
              Adjust min-h-[600px] to set a minimum height for small screens.
            */}
            <MapView key={mapKey} properties={properties} />
            <noscript>
              <div className="text-center p-4">
                <p>
                  JavaScript is required to view the map. Browse properties in{' '}
                  <Link href="/buy">grid view</Link>.
                </p>
              </div>
            </noscript>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )
      )}
    </div>
  );
}