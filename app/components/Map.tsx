import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

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

interface Property {
  id: number;
  title: string;
  price: string | number;
  location: string;
  latitude: number | null;
  longitude: number | null;
}

interface MapProps {
  properties: Property | Property[];
  zoom?: number;
  className?: string;
}

const MapView: React.FC<MapProps> = ({ properties, zoom = 15 }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (typeof window === 'undefined' || !mounted) return null;

  // Handle both single property and array of properties
  const propertyArray = Array.isArray(properties) ? properties : [properties];
  
  // Find center coordinates from first valid property
  const centerProperty = propertyArray.find(p => p.latitude != null && p.longitude != null);
  
  if (!centerProperty?.latitude || !centerProperty?.longitude) {
    return (
      <div className="h-[600px] w-full flex items-center justify-center bg-gray-200 rounded-lg">
        <p className="text-gray-600">
          Location coordinates not available for this property.
        </p>
      </div>
    );
  }

  return (
    <div 
  className="h-[600px] w-full rounded-lg overflow-hidden relative"
  style={{ zIndex: 1 }}
>
  <MapContainer
    center={[centerProperty.latitude, centerProperty.longitude]}
    zoom={zoom}
    scrollWheelZoom={true}
    style={{ height: '100%', width: '100%' }}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors"
    />
    {propertyArray.map(property => (
      property.latitude && property.longitude && (
        <Marker 
          key={property.id} 
          position={[property.latitude, property.longitude]}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{property.title}</h3>
              <p className="text-sm text-gray-600">{property.location}</p>
              <p className="text-sm font-bold mt-1">₦{property.price}</p>
            </div>
          </Popup>
        </Marker>
      )
    ))}
  </MapContainer>
</div>

  );
};

export default MapView;
