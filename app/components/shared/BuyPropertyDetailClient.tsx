//app/components/shared/BuyPropertyDetailClient.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, BedDouble, Bath, ChevronLeft, ChevronRight, Square } from 'lucide-react';
import { ContactDialog } from './ContactDialog';
import ShareButton from './ShareButton';
import MapErrorBoundary from '@/app/components/MapErrorBoundary';
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
  area: number | null;
  features: { name: string }[];
}

interface PropertyDetailClientProps {
  property: Property;
}

const BuyPropertyDetailClient: React.FC<PropertyDetailClientProps> = ({ property }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cache image URLs to avoid refetching
  const cachedImages = useMemo(() => {
    const cache = new Map<string, string>();
    property.images.forEach((image, index) => {
      cache.set(image.url, image.url);
    });
    return cache;
  }, [property.images]);

  // Preload all images on mount
  useEffect(() => {
    const preloadImages = () => {
      property.images.forEach((image, index) => {
        if (!imageErrors.includes(index) && cachedImages.has(image.url)) {
          const img = new window.Image();
          img.src = image.url;
          console.log(`[BuyPropertyDetailClient] Preloading image ${index}: ${img.src}`);
          img.onerror = () => {
            console.warn(`[BuyPropertyDetailClient] Preload error for image ${index}: ${image.url}`);
            setImageErrors((prev) => [...prev, index]);
          };
        }
      });
    };

    preloadImages();
  }, [property.images, imageErrors, cachedImages]);

  const nextImage = () => {
    setIsLoading(true);
    setCurrentIndex((prev) => (prev + 1) % property.images.length);
  };

  const previousImage = () => {
    setIsLoading(true);
    setCurrentIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const formatPrice = (price: number) => {
    try {
      const formatter = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      return <span className="text-xl md:text-3xl font-bold">{formatter.format(price)}</span>;
    } catch (error) {
      console.error('[BuyPropertyDetailClient] Error formatting price:', error);
      return '₦0';
    }
  };

  const toggleFullscreen = (index?: number) => {
    setFullscreenIndex(index !== undefined ? index : null);
  };

  const handleImageError = (index: number) => {
    console.warn(`[BuyPropertyDetailClient] Image load error at index ${index}: ${property.images[index].url}`);
    setImageErrors((prev) => [...prev, index]);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const thumbnailImages = [
    ...property.images.slice(currentIndex + 1, property.images.length),
    ...property.images.slice(0, Math.max(0, 4 - (property.images.length - currentIndex - 1))),
  ].slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-12">
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
              src={imageErrors.includes(fullscreenIndex) ? '/placeholder-property.jpg' : property.images[fullscreenIndex].url}
              alt={`${property.title} - Fullscreen Image`}
              fill
              className="object-contain transition-opacity duration-300"
              sizes="100vw"
              onError={() => handleImageError(fullscreenIndex)}
              onLoad={handleImageLoad}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-8 h-8 border-4 border-t-teal-600 border-gray-300 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      )}
      <div className="w-full bg-gray-900 pt-3 md:pt-7 pb-3 md:pb-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-4 relative aspect-video group">
              <Image
                src={imageErrors.includes(currentIndex) ? '/placeholder-property.jpg' : property.images[currentIndex].url}
                alt={`${property.title} - Main Image`}
                fill
                className="object-cover rounded-lg transition-opacity duration-300"
                priority={currentIndex === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                onError={() => handleImageError(currentIndex)}
                onLoad={handleImageLoad}
                onClick={() => toggleFullscreen(currentIndex)}
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-8 h-8 border-4 border-t-teal-600 border-gray-300 rounded-full animate-spin" />
                </div>
              )}
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
            <div className="md:col-span-1 hidden md:flex flex-col gap-2 h-full">
              {thumbnailImages.map((image, index) => {
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
                      src={imageErrors.includes(actualIndex) ? '/placeholder-property.jpg' : image.url}
                      alt={`Thumbnail ${actualIndex + 1}`}
                      fill
                      className="object-cover rounded transition-opacity duration-300"
                      sizes="(max-width: 768px) 25vw, 15vw"
                      onError={() => handleImageError(actualIndex)}
                      onLoad={handleImageLoad}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
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
                <div className="order-first md:order-last">{formatPrice(property.price)}</div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 md:mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
          {[
            { icon: BedDouble, value: property.bedrooms, label: 'Bedrooms' },
            { icon: Bath, value: property.bathrooms, label: 'Bathrooms' },
            { icon: Bath, value: property.toilets, label: 'Toilets' },
            { icon: BedDouble, value: property.bq, label: 'BQ' },
            {
              icon: Square,
              value: property.area != null && property.area > 0 ? `${property.area} sqft` : 'Not Available',
              label: 'Area',
              fullWidth: true,
            },
          ].map((detail, index) => (
            <Card
              key={index}
              className={`p-3 md:p-6 bg-white shadow-lg ${detail.fullWidth ? 'md:col-span-2 lg:col-span-2' : ''}`}
              aria-label={`${detail.label}: ${detail.value}`}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          <div className="lg:col-span-2 space-y-4 md:space-y-8">
            <Card className="overflow-hidden">
              <CardContent className="p-4 md:p-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-6">Description</h2>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{property.description}</p>
              </CardContent>
            </Card>
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
            <Card className="overflow-hidden">
              <CardContent className="p-4 md:p-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-6">Location</h2>
                {property.latitude && property.longitude ? (
                  <div className="h-[200px] md:h-[400px] w-full">
                    <MapErrorBoundary>
                      <MapView
                        properties={{
                          id: property.id,
                          title: property.title,
                          price: property.price,
                          location: property.location,
                          latitude: Number(property.latitude),
                          longitude: Number(property.longitude),
                        }}
                        zoom={15}
                      />
                    </MapErrorBoundary>
                  </div>
                ) : (
                  <div className="h-[200px] md:h-[400px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
                    <p className="text-sm md:text-base text-gray-500">Location coordinates not available.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="lg:block">
            <Card className="sticky top-8">
              <CardContent className="p-4 md:p-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-6">Interested?</h2>
                <div className="bg-teal-500">
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

export default BuyPropertyDetailClient;