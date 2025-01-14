'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Search, SlidersHorizontal, MapPin, LayoutGrid, Map, Bed, Bath, Square, Heart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import debounce from 'lodash/debounce';
import dynamic from 'next/dynamic';

// Separate the Map component import
const MapView = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
    </div>
  )
});

// Type definitions
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

const formatPrice = (price: string | number): string => {
  const priceString = price.toString();
  const numericPrice = priceString.replace(/[^0-9.]/g, '');
  const [wholePart, decimalPart] = numericPrice.split('.');
  const formattedWholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decimalPart ? `${formattedWholePart}.${decimalPart}` : formattedWholePart;
};

// Separate PropertyCard into a client component
const PropertyCard = ({ property }: { property: Property }) => (
  <article className="group cursor-pointer">
    <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
      <Image 
        src={property.image || '/placeholder.jpg'}
        alt={property.title}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <button aria-label="Add to favorites" className="absolute top-4 right-4 bg-white/90 p-2.5 rounded-full hover:bg-white">
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
      <div className="text-gray-600 flex items-center gap-1 mt-1">
        <MapPin className="w-4 h-4" />
        {property.location}
      </div>
      {property.specs && (
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
      )}
      <Link href={`/buy/${property.id}`} className="mt-3 inline-flex items-center gap-2 text-teal-600 font-medium group-hover:gap-3 transition-all">
        View Details 
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </article>
);

export default function BuyPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [mapKey, setMapKey] = useState(Date.now().toString());
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const fetchProperties = useCallback(async (page: number, search?: string) => {
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
  }, [pagination.itemsPerPage]);

  const debouncedSearch = useCallback(
    debounce((search: string) => {
      setPagination(prev => ({ ...prev, currentPage: 1 }));
      fetchProperties(1, search);
    }, 500),
    [fetchProperties]
  );

  useEffect(() => {
    fetchProperties(pagination.currentPage, searchQuery);
  }, [pagination.currentPage, searchQuery, fetchProperties]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleViewModeChange = (mode: 'grid' | 'map') => {
    setViewMode(mode);
    if (mode === 'map') {
      setMapKey(Date.now().toString());
    }
  };

  const paginationRange = () => {
    const { currentPage, totalPages } = pagination;
    const maxVisiblePages = 5;
    const range: (number | string)[] = [];
    
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
    range.push(totalPages);

    return range;
  };

  return (
    <main className="bg-gray-50 min-h-screen pt-20">
      <section className="bg-white border-b sticky top-20 z-10">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Enter a location, neighborhood, city, or state"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
              />
              {isLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-500" />
                </div>
              )}
            </div>
            <button 
              className="flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-700"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto p-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Properties for Sale</h1>
            <p className="text-gray-600 mt-1">
              {isLoading ? 'Loading properties...' : 
               error ? 'Error loading properties' :
               `Showing ${properties.length} of ${pagination.totalItems} properties`}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-teal-600 text-white' : 'hover:bg-gray-100'}`}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleViewModeChange('map')}
              className={`p-2 rounded-lg ${viewMode === 'map' ? 'bg-teal-600 text-white' : 'hover:bg-gray-100'}`}
              aria-label="Map view"
              aria-pressed={viewMode === 'map'}
            >
              <Map className="w-5 h-5" />
            </button>
          </div>
        </header>

        {error && (
          <div className="text-red-500 text-center py-8" role="alert">{error}</div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="h-[600px] rounded-lg overflow-hidden">
            <MapView key={mapKey} properties={properties} />
          </div>
        )}

        {!isLoading && !error && pagination.totalPages > 1 && (
          <nav className="mt-12 flex justify-center items-center gap-2" aria-label="Pagination">
            <button 
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {paginationRange().map((pageNum, index) => (
              typeof pageNum === 'string' ? (
                <span key={`ellipsis-${index}`} className="px-2">...</span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-lg ${
                    pagination.currentPage === pageNum ? 'bg-teal-600 text-white' : 'hover:bg-gray-100'
                  }`}
                  aria-label={`Page ${pageNum}`}
                  aria-current={pagination.currentPage === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              )
            ))}
            
            <button 
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}