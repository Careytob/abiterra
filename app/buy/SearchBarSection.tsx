// app/buy/SearchBarSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function SearchBarSection({ defaultSearch = '' }: { defaultSearch?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(defaultSearch);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    bedrooms: '',
    bathrooms: '',
    priceMin: '',
    priceMax: '',
  });

  // Sync with URL params
  useEffect(() => {
    if (!searchParams) return;
    setSearch(searchParams.get('search') || '');
    setFilters({
      bedrooms: searchParams.get('bedrooms') || '',
      bathrooms: searchParams.get('bathrooms') || '',
      priceMin: searchParams.get('priceMin') || '',
      priceMax: searchParams.get('priceMax') || '',
    });
  }, [searchParams]);

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams?.toString());
    if (search.trim()) {
      params.set('search', search.trim());
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`/buy?${params.toString()}`);
  };

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams?.toString());
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.set('page', '1');
    router.push(`/buy?${params.toString()}`);
    setShowFilters(false);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      bedrooms: '',
      bathrooms: '',
      priceMin: '',
      priceMax: '',
    });
    const params = new URLSearchParams(searchParams?.toString());
    ['bedrooms', 'bathrooms', 'priceMin', 'priceMax'].forEach((key) => params.delete(key));
    params.set('page', '1');
    router.push(`/buy?${params.toString()}`);
    setShowFilters(false);
  };

  return (
    <section className="bg-white border-b sticky top-[var(--navbar-height)] z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter a location, neighborhood, city, or state"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              aria-label="Search properties by location"
            />
          </form>
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors"
            aria-label="Open filters"
            aria-controls="filter-modal"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-30 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md" id="filter-modal">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filter Properties</h2>
              <button onClick={() => setShowFilters(false)} aria-label="Close filters">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                  Bedrooms
                </label>
                <select
                  id="bedrooms"
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
                  className="mt-1 w-full rounded-md border-gray-200 py-2 text-sm"
                >
                  <option value="">Any</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>
              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                  Bathrooms
                </label>
                <select
                  id="bathrooms"
                  name="bathrooms"
                  value={filters.bathrooms}
                  onChange={handleFilterChange}
                  className="mt-1 w-full rounded-md border-gray-200 py-2 text-sm"
                >
                  <option value="">Any</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>
              <div>
                <label htmlFor="priceMin" className="block text-sm font-medium text-gray-700">
                  Min Price (₦)
                </label>
                <input
                  id="priceMin"
                  name="priceMin"
                  type="number"
                  value={filters.priceMin}
                  onChange={handleFilterChange}
                  placeholder="e.g., 5000000"
                  className="mt-1 w-full rounded-md border-gray-200 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="priceMax" className="block text-sm font-medium text-gray-700">
                  Max Price (₦)
                </label>
                <input
                  id="priceMax"
                  name="priceMax"
                  type="number"
                  value={filters.priceMax}
                  onChange={handleFilterChange}
                  placeholder="e.g., 50000000"
                  className="mt-1 w-full rounded-md border-gray-200 py-2 text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <button
                onClick={applyFilters}
                className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}