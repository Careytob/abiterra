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

/*
const debugCoordinates = (stage: string, properties: Property[]) => {
  properties.forEach(prop => {
    console.log(`[${stage}] Property ${prop.id}:`, {
      latitude: prop.latitude,
      longitude: prop.longitude,
      rawLat: typeof prop.latitude === 'number' ? prop.latitude.toString() : null,
      rawLong: typeof prop.longitude === 'number' ? prop.longitude.toString() : null,
      precision: {
        lat: typeof prop.latitude === 'number' ? prop.latitude.toString().split('.')[1]?.length : null,
        long: typeof prop.longitude === 'number' ? prop.longitude.toString().split('.')[1]?.length : null
      }
    });
  });
};
*/

const MapView: React.FC<MapProps> = ({ properties, zoom = 15 }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Add debugging on properties change
  /*
  useEffect(() => {
    if (mounted) {
      const propsArray = Array.isArray(properties) ? properties : [properties];
      debugCoordinates('MAP_COMPONENT', propsArray);
    }
  }, [properties, mounted]);
*/
  if (typeof window === 'undefined' || !mounted) return null;

  // Handle both single property and array of properties
  const propertyArray = Array.isArray(properties) ? properties : [properties];
  
  // Find center coordinates from first valid property
  const centerProperty = propertyArray.find(p => p.latitude != null && p.longitude != null);
  
  if (!centerProperty?.latitude || !centerProperty?.longitude) {
    console.warn('No valid coordinates found for center property:', centerProperty);
    return (
      <div className="h-[600px] w-full flex items-center justify-center bg-gray-200 rounded-lg">
        <p className="text-gray-600">
          Location coordinates not available for this property.
        </p>
      </div>
    );
  }

  // Log the coordinates being used for the map center
 // console.log('Map center coordinates:', {
    //latitude: centerProperty.latitude,
    //longitude: centerProperty.longitude
  //});

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
        {propertyArray.map(property => {
          if (property.latitude && property.longitude) {
            // Log each marker's coordinates
            //console.log(`Marker coordinates for property ${property.id}:`, {
             // latitude: property.latitude,
              //longitude: property.longitude
            //});
            
            return (
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
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;