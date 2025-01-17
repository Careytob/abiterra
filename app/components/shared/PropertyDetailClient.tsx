'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/app/components/ui/card';
import { MapPin, BedDouble, Bath, ChevronLeft, ChevronRight, Square } from 'lucide-react';
import { ContactDialog } from './ContactDialog';
import ShareButton from './ShareButton';
import 'leaflet/dist/leaflet.css';

// Dynamically import MapView with SSR disabled
const MapView = dynamic(() => import('@/app/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

interface Property {
  id: number;
  price: number;
  images: { url: string }[];
  title: string;
  description: string;
  location: string;
  latitude: number;  
  longitude: number; 
  bedrooms: number;
  bq: number;
  bathrooms: number;
  toilets: number;
  area: number;
  features: { name: string }[];
}

interface PropertyDetailClientProps {
  property: Property;
}

interface FormatPriceOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

const PropertyDetailClient: React.FC<PropertyDetailClientProps> = ({ property }) => {
  //console.log(property.latitude, property.longitude); // Log the coordinates

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Initialize Leaflet only on client side
    if (typeof window !== 'undefined') {
      const initLeaflet = async () => {
        const L = await import('leaflet');
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
      };
      initLeaflet();
    }
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % property.images.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const formatPrice = (price: number, options: FormatPriceOptions = {}) => {
    const {
      currency = '₦',
      locale = 'en-NG',
      minimumFractionDigits = 0,
      maximumFractionDigits = 0
    } = options;
  
    try {
      const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
      
      if (isNaN(numericPrice)) {
        return `${currency}0`;
      }
      
      const formatter = new Intl.NumberFormat(locale, {
        minimumFractionDigits,
        maximumFractionDigits,
      });
  
      return `${currency}${formatter.format(numericPrice)}`;
    } catch (error) {
      console.error('Error formatting price:', error);
      return `${currency}0`;
    }
  };

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full bg-gray-900 pt-8">
        <Card className="relative max-w-7xl mx-auto">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={property.images[currentIndex].url}
              alt={`${property.title} - Image ${currentIndex + 1}`}
              fill
              className="object-cover rounded-lg"
              priority
            />
            <button 
              onClick={previousImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
            <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded-full">
              <span className="text-sm font-medium">
                {currentIndex + 1} / {property.images.length}
              </span>
            </div>
          </div>
        </Card>
      </div>
    
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">{property.title}</h1>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <p className="text-lg text-gray-600">{property.location}</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <p className="text-3xl font-bold text-black order-first md:order-last">
                  <span className="font-bold">{formatPrice(property.price)}</span>
                </p>
                <div className="flex items-center gap-4">
                  <ShareButton
                    title={property.title}
                    location={property.location}
                    price={property.price}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="p-6 bg-white shadow-lg">
            <div className="flex flex-col items-center text-center">
              <BedDouble className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-3xl font-bold mb-1">{property.bedrooms}</span>
              <span className="text-gray-600">Bedrooms</span>
            </div>
          </Card>
          <Card className="p-6 bg-white shadow-lg">
            <div className="flex flex-col items-center text-center">
              <Bath className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-3xl font-bold mb-1">{property.bathrooms}</span>
              <span className="text-gray-600">Bathrooms</span>
            </div>
          </Card>
          <Card className="p-6 bg-white shadow-lg">
            <div className="flex flex-col items-center text-center">
              <Bath className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-3xl font-bold mb-1">{property.toilets}</span>
              <span className="text-gray-600">Toilets</span>
            </div>
          </Card>
          <Card className="p-6 bg-white shadow-lg">
            <div className="flex flex-col items-center text-center">
              <BedDouble className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-3xl font-bold mb-1">{property.bq}</span>
              <span className="text-gray-600">BQ</span>
            </div>
          </Card>
          <Card className="p-6 bg-white shadow-lg md:col-span-2 lg:col-span-2">
            <div className="flex flex-col items-center text-center">
              <Square className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-3xl font-bold mb-1">{property.area}</span>
              <span className="text-gray-600">Sq Ft</span>
            </div>
          </Card>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="overflow-hidden">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Description</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span className="text-gray-600">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Location</h2>
                {property.latitude && property.longitude ? (
                  <div className="h-[400px] w-full">
                    <MapView
                      properties={{
                        id: property.id,
                        title: property.title,
                        price: property.price,
                        location: property.location,
                        latitude: Number(property.latitude),
                        longitude: Number(property.longitude)
                      }}
                      zoom={15}
                    />
                  </div>
                ) : (
                  <div className="h-[400px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
                    <p className="text-gray-500">Location coordinates not available.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Interested?</h2>
                <div className='bg-teal-500'>
                  <ContactDialog propertyId={property.id.toString()} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailClient;