// Mark the component as a client component
'use client';

import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, LayoutGrid, Map, Bed, Bath, Square, Heart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import debounce from 'lodash/debounce';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('../components/Map').then(mod => mod.default), {
  ssr: false
});

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

const BuyPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [mapKey, setMapKey] = useState(Date.now().toString());
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: string | number) => {
    const priceString = price.toString();
    const numericPrice = priceString.replace(/[^0-9.]/g, '');
    const [wholePart, decimalPart] = numericPrice.split('.');
    const formattedWholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimalPart ? `${formattedWholePart}.${decimalPart}` : formattedWholePart;
  };

  const fetchProperties = async (page: number, search?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const searchParam = search?.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
      const response = await fetch(`/api/properties?type=SALE&page=${page}&limit=${pagination.itemsPerPage}${searchParam}`);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (!data.properties || !Array.isArray(data.properties)) throw new Error('Invalid response format');
      
      setProperties(data.properties);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = debounce((search: string) => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchProperties(1, search);
  }, 500);

  useEffect(() => {
    fetchProperties(pagination.currentPage, searchQuery);
  }, [pagination.currentPage, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const getPaginationRange = () => {
    const range: (number | string)[] = [];
    const { currentPage, totalPages } = pagination;
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    range.push(1);
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 2) end = 4;
    if (currentPage >= totalPages - 1) start = totalPages - 3;

    if (start > 2) range.push('...');
    for (let i = start; i <= end; i++) range.push(i);
    if (end < totalPages - 1) range.push('...');
    if (totalPages > 1) range.push(totalPages);

    return range;
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
            {property.type}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-start">
          <h2 className="font-semibold text-gray-900">{property.title}</h2>
          <span className="text-xl font-bold">₦{formatPrice(property.price)}</span>
        </div>
        <p className="text-gray-600 flex items-center gap-1 mt-1">
          <MapPin className="w-4 h-4" />
          {property.location}
        </p>
        {property.specs ? (
          <dl className="flex items-center gap-6 text-gray-600 mt-2">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4" />
              <dd>{property.specs.beds} beds</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4" />
              <dd>{property.specs.baths} baths</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Square className="w-4 h-4" />
              <dd>{property.specs.area}</dd>
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
        {/* Your component JSX... */}
      </main>
    </>
  );
};

export default BuyPage;
