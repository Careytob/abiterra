import { notFound } from 'next/navigation';
import { Search, SlidersHorizontal, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ViewModeToggle from './ViewModeToggle';
import ToggleButtons from './ToggleButtons';
import { ViewModeProvider } from './ViewModeContext';

interface Property {
  id: number;
  title: string;
  description: string;
  price: string | number;
  location: string;
  latitude: number | null;
  longitude: number | null;
  type: 'For Sale' | 'For Rent';
  specs: {
    area: string;
    beds: number;
    baths: number;
    size: number;
  };
  images: { id: number; url: string }[];
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

async function fetchProperties(page: number, search?: string, limit = 12): Promise<{
  properties: Property[];
  pagination: PaginationInfo;
}> {
  const searchParam = search?.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://abiterra.com';
  const url = `${baseUrl}/api/properties?type=SALE&page=${page}&limit=${limit}${searchParam}`;

  try {
    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, url: ${url}`);
    }
    const data = await response.json();
    console.log('API response:', JSON.stringify(data, null, 2));
    if (!data.properties || !Array.isArray(data.properties)) {
      throw new Error('Invalid response format: properties missing or not an array');
    }
    return {
      properties: data.properties.map((p: Property) => ({
        ...p,
        images: Array.isArray(p.images) ? p.images : [],
      })),
      pagination: data.pagination || {
        currentPage: page,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: limit,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  } catch (err) {
    console.error('Fetch error:', err, { url });
    throw err;
  }
}

interface BuyPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function BuyPage({ searchParams }: BuyPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1', 10);
  const search = resolvedSearchParams.search || '';
  let properties: Property[] = [];
  let pagination: PaginationInfo = {
    currentPage: page,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPreviousPage: false,
  };
  let error: string | null = null;

  try {
    const data = await fetchProperties(page, search);
    properties = data.properties;
    pagination = data.pagination;
  } catch (err) {
    error = err instanceof Error ? err.message : 'An error occurred';
  }

  if (isNaN(page) || page < 1) {
    notFound();
  }

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
    <ViewModeProvider>
      <main className="bg-gray-50 min-h-screen pt-20">
        <section className="bg-white border-b sticky top-20 z-10">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  defaultValue={search}
                  placeholder="Enter a location, neighborhood, city, or state"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                aria-label="Open filters"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </section>
        <section className="max-w-7xl mx-auto p-6">
          <header className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold">Properties for Sale</h1>
                <p className="text-gray-600 mt-1">
                  {error
                    ? 'Error loading properties'
                    : `Showing ${properties.length} of ${pagination.totalItems} properties`}
                </p>
              </div>
              <ToggleButtons />
            </div>
          </header>
          {error && (
            <div className="text-red-500 text-center py-8" role="alert">
              {error}
            </div>
          )}
          {properties.length === 0 && !error && (
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold">No properties found</h2>
              <p className="text-gray-600 mt-2">
                Try adjusting your search or explore other locations.
              </p>
              <Link href="/buy" className="mt-4 inline-block text-teal-600">
                Reset Search
              </Link>
            </div>
          )}
          <ViewModeToggle properties={properties} />
          {pagination.totalPages > 1 && (
            <nav className="mt-12 flex justify-center items-center gap-2" aria-label="Pagination">
              <Link
                href={`/buy?page=${pagination.currentPage - 1}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                className={`p-2 rounded-lg ${!pagination.hasPreviousPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              {paginationRange().map((pageNum, index) => (
                typeof pageNum === 'string' ? (
                  <span key={`ellipsis-${index}`} className="px-2">...</span>
                ) : (
                  <Link
                    key={pageNum}
                    href={`/buy?page=${pageNum}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg ${pagination.currentPage === pageNum ? 'bg-teal-600 text-white' : 'hover:bg-gray-100'}`}
                    aria-label={`Page ${pageNum}`}
                    aria-current={pagination.currentPage === pageNum ? 'page' : undefined}
                  >
                    {pageNum}
                  </Link>
                )
              ))}
              <Link
                href={`/buy?page=${pagination.currentPage + 1}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                className={`p-2 rounded-lg ${!pagination.hasNextPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            </nav>
          )}
        </section>
      </main>
    </ViewModeProvider>
  );
}