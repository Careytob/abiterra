'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/app/components/ui/card';
import { MapPin, Share2, BedDouble, Bath, ChevronLeft, ChevronRight, Square } from 'lucide-react';
import { ContactDialog } from './ContactDialog';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MapView from '@/app/components/Map';
import { formatPrice } from '@/lib/utils';
import { property } from 'lodash';



delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

//console.log('Property Data:', property);


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
  //console.log('Property Coordinates:', property.latitude, property.longitude);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    //console.log('Property data:', property);
    //console.log('Coordinates:', property.latitude, property.longitude);
  }, [property]);



  

  // Add useEffect for map mounting
  useEffect(() => {
    //console.log('MapView mounted');
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
      // Convert to number if it's a string
      const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
      // Check if the conversion resulted in a valid number
      if (isNaN(numericPrice)) {
        return `${currency}0`;
      }
  
      // Format the number using Intl.NumberFormat
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

  return (
      <div className="min-h-screen bg-gray-50">
        {/* ... existing code ... */}
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
      
       {/* Header Section */}
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
                    <span className=" font-bold ">{formatPrice(property.price)}</span>
                  </p>

                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                      <Share2 className="w-5 h-5" />
                      Share
                    </button>
                   
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      
          {/* Property Stats */}
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
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description Card */}
              <Card className="overflow-hidden">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold mb-6">Description</h2>
                  <p className="text-gray-600 leading-relaxed">{property.description}</p>
                </CardContent>
              </Card>
  
              {/* Features Card */}
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
  
              {/* Location Card */}
         {/* Location Card */}
                  {/* Location Card */}
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
  
            {/* Right Column - Contact Card */}
            {/* ... existing contact card code ... */}
        <div>
              <Card className="sticky top-8">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold mb-6">Interested?</h2>
                  <div className="w-full bg-teal-600 text-white  px-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors">
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