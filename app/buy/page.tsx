'use client'
import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, MapPin, LayoutGrid, Map, Bed, Bath, Square, Heart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import Link from 'next/link';

interface Property {
  id: number;
  title: string;
  description: string;
  price: string;
  location: string;
  image: string;
  type: string;
  specs: {
    beds: number;
    baths: number;
    area: string;
  } | null;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ApiResponse {
  properties: Property[];
  pagination: PaginationInfo;
}

const BuyPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [properties, setProperties] = useState<Property[]>([]);
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

  const fetchProperties = async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/properties?type=SALE&page=${page}&limit=${pagination.itemsPerPage}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data: ApiResponse = await response.json();
      setProperties(data.properties);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching properties:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(pagination.currentPage);
  }, [pagination.currentPage]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  // Generate pagination numbers
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

    if (currentPage <= 2) {
      end = 4;
    }
    if (currentPage >= totalPages - 1) {
      start = totalPages - 3;
    }

    if (start > 2) {
      range.push('...');
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (end < totalPages - 1) {
      range.push('...');
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <>
      <NextSeo
        title="Properties for Sale in Lagos | Luxury Real Estate Listings"
        description="Browse luxury properties for sale in Lagos, Nigeria. Find exclusive villas, apartments, and houses in prime locations."
      />

      <main className="bg-gray-50 min-h-screen pt-20">
        {/* Search Section */}
        <section className="bg-white border-b sticky top-20 z-10">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter an address, neighborhood, city, or ZIP code"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-700">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto p-6">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-semibold">Properties for Sale in Lagos</h1>
              <p className="text-gray-600 mt-1">
                {isLoading ? (
                  'Loading properties...'
                ) : error ? (
                  'Error loading properties'
                ) : (
                  `Showing ${properties.length} of ${pagination.totalItems} properties`
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                className={`p-2 rounded-lg hover:bg-gray-100 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button 
                className={`p-2 rounded-lg hover:bg-gray-100 ${viewMode === 'map' ? 'bg-gray-100' : ''}`}
                onClick={() => setViewMode('map')}
              >
                <Map className="w-5 h-5" />
              </button>
            </div>
          </header>

          {error && (
            <div className="text-red-500 text-center py-8">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <article key={property.id} className="group cursor-pointer">
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
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <span className="text-white text-2xl font-bold">{property.price}</span>
                      <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm">
                        {property.type}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h2 className="font-semibold text-gray-900">{property.title}</h2>
                    <p className="text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {property.location}
                    </p>
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
                    <Link href={`/buy/${property.id}`}>
                      <button className="mt-3 flex items-center gap-2 text-teal-600 font-medium group-hover:gap-3 transition-all">
                        View Details 
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && !error && pagination.totalPages > 1 && (
            <nav className="mt-12 flex justify-center items-center gap-2">
              <button 
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPreviousPage}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {getPaginationRange().map((pageNum, index) => {
                if (pageNum === '...') {
                  return <span key={`ellipsis-${index}`} className="px-2">...</span>;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum as number)}
                    className={`w-10 h-10 rounded-lg ${
                      pagination.currentPage === pageNum
                        ? 'bg-teal-600 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button 
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          )}
        </section>
      </main>
    </>
  );
};

export default BuyPage;