'use client'
import React, { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, LayoutGrid, Map, Bed, Bath, Square, Heart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Head from 'next/head';
import { NextSeo } from 'next-seo';

const BuyPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const properties = [
    {
      id: 1,
      title: "Luxury 5-Bedroom Villa",
      price: "₦250,000,000",
      location: "Lekki Phase 1, Lagos",
      specs: {
        beds: 5,
        baths: 6,
        area: "500m²"
      },
      type: "Villa",
      image: "/house-1.jpg",
      description: "Magnificent 5-bedroom luxury villa in the heart of Lekki Phase 1. Features modern amenities and spacious living areas."
    },
    {
      id: 2,
      title: "Luxury 5-bedroom",
      price: "₦250,000,000",
      location: "Lekki Phase 1, Lagos",
      specs: {
        beds: 3,
        baths: 3,
        area: "500m²"
      },
      type: "Villa",
      image: "/house-2.jpg",
      description: "Magnificent 5-bedroom luxury villa in the heart of Lekki Phase 1. Features modern amenities and spacious living areas."
    },
    {
      id: 3,
      title: "Luxury 5-bedroom",
      price: "₦250,000,000",
      location: "GRA Ikeja, Lagos",
      specs: {
        beds: 5,
        baths: 6,
        area: "500m²"
      },
      type: "Villa",
      image: "/house-3.jpg",
      description: "Magnificent 5-bedroom luxury villa in the heart of Lekki Phase 1. Features modern amenities and spacious living areas."
    },
    {
      id: 4,
      title: "Luxury 5-Bedroom",
      price: "₦300,000,000",
      location: "Lekki Phase 1, Lagos",
      specs: {
        beds: 5,
        baths: 6,
        area: "500m²"
      },
      type: "Villa",
      image: "/house-4.jpg",
      description: "Magnificent 5-bedroom luxury villa in the heart of Lekki Phase 1. Features modern amenities and spacious living areas."
    },
    {
      id: 5,
      title: "Luxury 5-Bedroom Villa",
      price: "₦280,000,000/yr",
      location: "Maryland Estate, Lagos",
      specs: {
        beds: 5,
        baths: 6,
        area: "500m²"
      },
      type: "Villa",
      image: "/house-5.jpg",
      description: "Magnificent 5-bedroom luxury villa in the heart of Lekki Phase 1. Features modern amenities and spacious living areas."
    },
    {
      id: 6,
      title: "Luxury 5-Bedroom Villa",
      price: "₦320,000,000",
      location: "GRA Ikeja, Lagos",
      specs: {
        beds: 5,
        baths: 6,
        area: "500m²"
      },
      type: "Villa",
      image: "/house-6.jpg",
      description: "Magnificent 5-bedroom luxury villa in the heart of Lekki Phase 1. Features modern amenities and spacious living areas."
    },
    
  ];

  //structured data for the real estate listings
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": properties.map((property, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "RealEstateListing",
        "name": property.title,
        "description": property.description,
        "price": property.price,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": property.location,
          "addressRegion": "Lagos",
          "addressCountry": "NG"
        },
        "numberOfRooms": property.specs.beds,
        "numberOfBathrooms": property.specs.baths,
        "floorSize": {
          "@type": "QuantitativeValue",
          "value": parseInt(property.specs.area),
          "unitText": "m²"
        }
      }
    }))
  };

  return (
    <>
      <NextSeo
        title="Properties for Sale in Lagos | Luxury Real Estate Listings"
        description="Browse luxury properties for sale in Lagos, Nigeria. Find exclusive villas, apartments, and houses in prime locations like Lekki Phase 1, GRA Ikeja, and Maryland Estate."
        canonical="https://abiterra.com/buy"
        openGraph={{
          title: 'Apartments for Rent in Lagos | Modern Flats & Properties',
          description: 'Find modern apartments for rent in prime Lagos locations. Discover your next home.',
          images: [
            {
              url: 'https://abiterra.com/apartment-1.jpg',
              width: 1200,
              height: 630,
              alt: 'Modern 3-Bedroom Flat in Lekki Phase 1',
            },
            {
              url: 'https://abiterra.com/apartment-2.jpg',
              width: 1200,
              height: 630,
              alt: '3-Bedroom Flat in Maryland Estate',
            },
            {
              url: 'https://abiterra.com/apartment-3.jpg',
              width: 1200,
              height: 630,
              alt: '3-Bedroom Flat in GRA Ikeja',
            },
            {
              url: 'https://abiterra.com/apartment-4.jpg',
              width: 1200,
              height: 630,
              alt: 'Modern 3-Bedroom Flat in Lekki Phase 1',
            },
            {
              url: 'https://abiterra.com/apartment-5.jpg',
              width: 1200,
              height: 630,
              alt: '3-Bedroom Flat in Maryland Estate',
            },
            {
              url: 'https://abiterra.com/apartment-6.jpg',
              width: 1200,
              height: 630,
              alt: '3-Bedroom Flat in GRA Ikeja',
            }
          ],
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="bg-gray-50 min-h-screen pt-20">
        {/* Search Section */}
        <section className="bg-white border-b sticky top-20 z-10" aria-label="Property search filters">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <label htmlFor="property-search" className="sr-only">Search properties</label>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="property-search"
                  type="text"
                  placeholder="Enter an address, neighborhood, city, or ZIP code"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button 
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                aria-label="Open filters menu"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto p-6">
          {/* View Controls */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-semibold">Properties for Sale in Lagos</h1>
              <p className="text-gray-600 mt-1" aria-label="Number of properties found">
                Showing {properties.length} properties
              </p>
            </div>
            <div className="flex items-center gap-3" role="toolbar" aria-label="View options">
              <button 
                className={`p-2 rounded-lg hover:bg-gray-100 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button 
                className={`p-2 rounded-lg hover:bg-gray-100 ${viewMode === 'map' ? 'bg-gray-100' : ''}`}
                onClick={() => setViewMode('map')}
                aria-label="Map view"
                aria-pressed={viewMode === 'map'}
              >
                <Map className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Property Grid */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            role="list"
            aria-label="Property listings"
          >
            {properties.map((property) => (
              <article 
                key={property.id} 
                className="group cursor-pointer"
                role="listitem"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
                  <Image 
                    src={property.image}
                    alt={`${property.title} - ${property.location}`}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    priority={property.id <= 3} // Prioritize loading for above-the-fold images
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <button 
                    className="absolute top-4 right-4 bg-white/90 p-2.5 rounded-full hover:bg-white"
                    aria-label="Add to favorites"
                  >
                    <Heart className="w-4 h-4 text-gray-700" />
                  </button>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className="text-white text-2xl font-bold">{property.price}</span>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">{property.type}</span>
                  </div>
                </div>

                {/* Property Details */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-semibold text-gray-900">{property.title}</h2>
                      <address className="text-gray-600 flex items-center gap-1 mt-1 not-italic">
                        <MapPin className="w-4 h-4" />
                        {property.location}
                      </address>
                    </div>
                  </div>

                  {/* Property Features */}
                  <dl className="flex items-center gap-6 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">Bedrooms</dt>
                      <Bed className="w-4 h-4" />
                      <dd>{property.specs.beds} beds</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">Bathrooms</dt>
                      <Bath className="w-4 h-4" />
                      <dd>{property.specs.baths} baths</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">Floor area</dt>
                      <Square className="w-4 h-4" />
                      <dd>{property.specs.area}</dd>
                    </div>
                  </dl>

                  {/* View Details Button */}
                  <div className="pt-2">
                    <button 
                      className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all"
                      aria-label={`View details for ${property.title}`}
                    >
                      View Details 
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination Controls */}
          <nav 
            className="mt-12 flex justify-center items-center gap-2"
            aria-label="Pagination"
          >
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-10 h-10 rounded-lg ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                    aria-label={`Page ${pageNumber}`}
                    aria-current={currentPage === pageNumber ? 'page' : undefined}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return <span key={pageNumber} aria-hidden="true">...</span>;
              }
              return null;
            })}
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </nav>
        </section>
      </main>
    </>
  );
};

export default BuyPage;