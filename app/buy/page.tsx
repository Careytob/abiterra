'use client';
import { GetServerSideProps } from 'next';
import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, LayoutGrid, Map, Bed, Bath, Square, Heart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

interface Property {
  id: number;
  title: string;
  description: string;
  price: string | number;
  location: string;
  latitude: number | null;
  longitude: number | null;
  image: string;
  type: string;
  specs: {
    area: string;
    beds: number;
    baths: number;
    size: number;
  };
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await fetch(`https://yourapi.com/properties?type=SALE&page=1&limit=12`);
    const data = await response.json();
    
    return {
      props: {
        properties: data.properties || [],
        pagination: data.pagination || {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 12,
          hasNextPage: false,
          hasPreviousPage: false
        }
      }
    };
  } catch (error) {
    console.error('Error fetching properties:', error);
    return {
      props: {
        properties: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 12,
          hasNextPage: false,
          hasPreviousPage: false
        }
      }
    };
  }
};

const BuyPage = ({ properties, pagination }: { properties: Property[]; pagination: PaginationInfo }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const formatPrice = (price: string | number) => {
    const priceString = price.toString();
    const numericPrice = priceString.replace(/[^0-9.]/g, '');
    const [wholePart, decimalPart] = numericPrice.split('.');
    const formattedWholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimalPart ? `${formattedWholePart}.${decimalPart}` : formattedWholePart;
  };

  const PropertyCard = ({ property }: { property: Property }) => (
    <article className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
        <Image 
          src={property.image || '/placeholder.jpg'}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <button className="absolute top-4 right-4 bg-white/90 p-2.5 rounded-full hover:bg-white">
          <Heart className="w-4 h-4 text-gray-700" />
        </button>
        <div className="absolute bottom-4 right-4">
          <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm">
            {property.type || 'N/A'}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-start">
          <h2 className="font-semibold text-gray-900">{property.title || 'Untitled Property'}</h2>
          <span className="text-xl font-bold">₦{formatPrice(property.price)}</span>
        </div>
        <p className="text-gray-600 flex items-center gap-1 mt-1">
          <MapPin className="w-4 h-4" />
          {property.location || 'Location not available'}
        </p>
        {property.specs ? (
          <dl className="flex items-center gap-6 text-gray-600 mt-2">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4" />
              <dd>{property.specs.beds || 0} beds</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4" />
              <dd>{property.specs.baths || 0} baths</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Square className="w-4 h-4" />
              <dd>{property.specs.area || 'N/A'}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-gray-500 mt-2">No property specifications available.</p>
        )}
        <Link href={`/buy/${property.id}`}>
          <button className="mt-3 flex items-center gap-2 text-teal-600 font-medium group-hover:gap-3 transition-all">
            View Details 
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </article>
  );

  return (
    <>
      <NextSeo
        title="Properties for Sale in Lagos | Luxury Real Estate Listings"
        description="Browse luxury properties for sale in Lagos, Nigeria."
        openGraph={{
          url: 'https://yourwebsite.com/buy',
          title: 'Properties for Sale in Lagos',
          description: 'Browse luxury properties for sale in Lagos, Nigeria.',
          images: [{ url: '/og-image.jpg', width: 800, height: 600, alt: 'Luxury properties for sale' }],
          site_name: 'Your Website Name',
        }}
      />

      <main className="bg-gray-50 min-h-screen pt-20">
        <section className="bg-white border-b sticky top-20 z-10">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a property"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </section>
      </main>
    </>
  );
};

export default BuyPage;
