
'use client';

import React, { useState } from 'react';
import { siteConfig, formatPrice as formatMoney, rentPeriodLabel } from '@/lib/site-config';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, BedDouble, Bath, ChevronLeft, ChevronRight, Square } from 'lucide-react';
import { ContactDialog } from './ContactDialog';
import ShareButton from './ShareButton';
import 'leaflet/dist/leaflet.css';

const MapView = dynamic(() => import('@/app/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

interface Property {
  id: string;
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

const RentPropertyDetailClient: React.FC<PropertyDetailClientProps> = ({ property }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % property.images.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const formatPrice = (price: number) => {
    try {
      return (
        <div className="flex flex-col">
          <span className="text-xl md:text-3xl font-bold">{formatMoney(price)}</span>
          <span className="text-xs md:text-sm text-gray-600">per {rentPeriodLabel().long}</span>
        </div>
      );
    } catch (error) {
      console.error('Error formatting price:', error);
      return formatMoney(0);
    }
  };

  const toggleFullscreen = (index?: number) => {
    setFullscreenIndex(index !== undefined ? index : null);
  };

  // Select up to 4 thumbnails, prioritizing images after the current one
  const thumbnailImages = [
    ...property.images.slice(currentIndex + 1, property.images.length),
    ...property.images.slice(0, Math.max(0, 4 - (property.images.length - currentIndex - 1)))
  ].slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fullscreen Modal */}
      {fullscreenIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <button 
            onClick={() => toggleFullscreen()}
            className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full z-10"
          >
            Close
          </button>
          <div className="max-w-[90%] max-h-[90%] relative w-full h-full">
            <Image
              src={property.images[fullscreenIndex].url}
              alt={`${property.title} - Fullscreen Image`}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Image Gallery Section */}
      <div className="w-full bg-gray-900 pt-3 md:pt-7 pb-3 md:pb-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Large Main Image */}
            <div className="md:col-span-4 relative aspect-video group">
              <Image
                src={property.images[currentIndex].url}
                alt={`${property.title} - Main Image`}
                fill
                className="object-cover rounded-lg"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onClick={() => toggleFullscreen(currentIndex)}
              />
              <div className="absolute inset-0 flex items-center justify-between px-2 md:px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={previousImage}
                  className="bg-white/90 p-1 md:p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="bg-white/90 p-1 md:p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
                </button>
              </div>
              <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-white/90 px-2 py-1 md:px-3 md:py-1 rounded-full">
                <span className="text-xs md:text-sm font-medium">
                  {currentIndex + 1} / {property.images.length}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="md:col-span-1 hidden md:flex flex-col gap-2 h-full">
              {thumbnailImages.map((image, index) => {
                // Calculate the actual index in the original images array
                const actualIndex = (currentIndex + index + 1) % property.images.length;
                return (
                  <div 
                    key={actualIndex}
                    className={`relative aspect-video flex-shrink-0 w-full cursor-pointer 
                      ${actualIndex === currentIndex ? 'border-2 border-blue-500' : 'opacity-60 hover:opacity-100'}
                      transition-all duration-300`}
                    onClick={() => setCurrentIndex(actualIndex)}
                  >
                    <Image
                      src={image.url}
                      alt={`Thumbnail ${actualIndex + 1}`}
                      fill
                      className="object-cover rounded"
                      sizes="(max-width: 768px) 25vw, 10vw"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    
      {/* Property Title and Price Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <Card className="p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold">{property.title}</h1>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" />
                  <p className="text-sm md:text-lg text-gray-600">{property.location}</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="order-first md:order-last">
                  {formatPrice(property.price)}
                </div>
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

      {/* Property Details Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 md:mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
          {[
            { icon: BedDouble, value: property.bedrooms, label: 'Bedrooms' },
            { icon: Bath, value: property.bathrooms, label: 'Bathrooms' },
            { icon: Bath, value: property.toilets, label: 'Toilets' },
            { icon: BedDouble, value: property.bq, label: 'BQ' },
            { icon: Square, value: property.area, label: siteConfig.areaUnit === 'sqm' ? 'Sq M' : 'Sq Ft', fullWidth: true }
          ].filter((d) =>
            d.label === 'Toilets' ? siteConfig.features.showToilets
              : d.label === 'BQ' ? siteConfig.features.showBQ
              : true
          ).map((detail, index) => (
            <Card 
              key={index} 
              className={`p-3 md:p-6 bg-white shadow-lg ${detail.fullWidth ? 'md:col-span-2 lg:col-span-2' : ''}`}
            >
              <div className="flex flex-col items-center text-center">
                <detail.icon className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mb-1 md:mb-2" />
                <span className="text-xl md:text-3xl font-bold mb-0 md:mb-1">{detail.value}</span>
                <span className="text-xs md:text-sm text-gray-600">{detail.label}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Description, Features, and Contact Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          <div className="lg:col-span-2 space-y-4 md:space-y-8">
            {/* Description Card */}
            <Card className="overflow-hidden">
              <CardContent className="p-4 md:p-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-6">Description</h2>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{property.description}</p>
              </CardContent>
            </Card>

            {/* Features Card */}
            <Card className="overflow-hidden">
              <CardContent className="p-4 md:p-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-6">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 md:gap-y-4 gap-x-4 md:gap-x-8">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 md:gap-3">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-600 rounded-full" />
                      <span className="text-xs md:text-base text-gray-600">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card className="overflow-hidden">
              <CardContent className="p-4 md:p-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-6">Location</h2>
                {property.latitude && property.longitude ? (
                  <div className="h-[200px] md:h-[400px] w-full">
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
                  <div className="h-[200px] md:h-[400px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
                    <p className="text-sm md:text-base text-gray-500">Location coordinates not available.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Section */}
          <div className=" lg:block">
            <Card className="sticky top-8">
              <CardContent className="p-4 md:p-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-6">Interested?</h2>
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

export default RentPropertyDetailClient;