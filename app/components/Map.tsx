
// app/components/Map.tsx
import React, { useEffect, useState, useRef } from 'react';
import { formatPrice } from '@/lib/site-config';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L, { Map } from 'leaflet';
import { useMap } from 'react-leaflet';

// The map only needs these fields, so any listing-like object can be passed in.
type MapProperty = {
  id: string | number;
  title: string;
  price: number | string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // callers may pass full listing objects
};

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x-blue.png',
  iconUrl: '/images/marker-icon-blue.png',
  shadowUrl: '/images/marker-shadow.png',
});

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface MapProps {
  properties: MapProperty | MapProperty[];
  zoom?: number;
  className?: string;
}

const MapUpdater: React.FC<{ properties: MapProperty | MapProperty[]; zoom: number }> = ({
  properties,
  zoom,
}) => {
  const map = useMap();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const propertyArray = Array.isArray(properties) ? properties : [properties];
    const centerProperty = propertyArray.find(
      (p) => p.latitude != null && p.longitude != null
    );

    if (centerProperty?.latitude && centerProperty?.longitude) {
      if (!initialized) {
        map.setView([centerProperty.latitude, centerProperty.longitude], zoom);
        setInitialized(true);
      } else {
        map.flyTo([centerProperty.latitude, centerProperty.longitude], zoom, {
          duration: 0.5,
        });
      }
    }
  }, [map, properties, zoom, initialized]);

  return null;
};

const MapView: React.FC<MapProps> = ({ properties, zoom = 15, className }) => {
  const [mounted, setMounted] = useState(false);
  const mapRef = useRef<Map | null>(null);
  const mapId = useRef(`map-${Math.random().toString(36).substring(2, 11)}`).current;

  useEffect(() => {
    setMounted(true);

    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove();
          mapRef.current = null;
          console.log(`Cleaned up map ${mapId}`);
        } catch (error) {
          console.error(`Error cleaning up map ${mapId}:`, error);
        }
      }
    };
  }, []);

  if (typeof window === 'undefined' || !mounted) {
    return null;
  }

  const propertyArray = Array.isArray(properties) ? properties : [properties];
  const centerProperty = propertyArray.find(
    (p) => p.latitude != null && p.longitude != null
  );

  if (!centerProperty?.latitude || !centerProperty?.longitude) {
    return (
      <div
        className={`h-[50vh] sm:h-[60vh] lg:h-[70vh] w-full flex items-center justify-center bg-gray-200 rounded-lg ${className || ''}`}
        aria-label="Map unavailable"
      >
        <p className="text-gray-600">
          Location coordinates not available for this property.
        </p>
      </div>
    );
  }

  return (
    <div
      id={mapId}
      className={`h-[50vh] sm:h-[60vh] lg:h-[70vh] w-full rounded-lg overflow-hidden relative ${className || ''}`}
      style={{ zIndex: 1 }}
      aria-label="Property location map"
    >
      <MapContainer
        center={[centerProperty.latitude, centerProperty.longitude]}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        ref={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <MapUpdater properties={properties} zoom={zoom} />
        {propertyArray.map((property) => {
          if (property.latitude != null && property.longitude != null) {
            return (
              <Marker
                key={property.id}
                position={[property.latitude, property.longitude]}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{property.title}</h3>
                    <p className="text-sm text-gray-600">{property.location}</p>
                    <p className="text-sm font-bold mt-1">{formatPrice(Number(property.price))}</p>
                  </div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;