// app/buy/page.tsx
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ViewModeToggle from './ViewModeToggle';
import ToggleButtons from './ToggleButtons';
import { ViewModeProvider } from './ViewModeContext';
import { Property } from '../types/property';
import SearchBarSection from './SearchBarSection';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

async function fetchProperties(
  page: number,
  search?: string,
  filters: { bedrooms?: string; bathrooms?: string; priceMin?: string; priceMax?: string } = {},
  limit = 12
): Promise<{
  properties: Property[];
  pagination: PaginationInfo;
}> {
  const searchParam = search?.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
  const filterParams = Object.entries(filters)
    .filter(([_, value]) => value)
    .map(([key, value]) => `&${key}=${encodeURIComponent(value)}`)
    .join('');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const host = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_SITE_URL || 'localhost:3000';
  const url = new URL(
    `/api/properties?type=SALE&page=${page}&limit=${limit}${searchParam}${filterParams}`,
    `${protocol}://${host}`
  );

  try {
    console.log('Fetching properties from:', url.toString());
    const response = await fetch(url.toString(), { next: { revalidate: 300 } });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, url: ${url.toString()}`);
    }
    const data = await response.json();
    if (!data.properties || !Array.isArray(data.properties)) {
      throw new Error('Invalid response format: properties missing or not an array');
    }
    return {
      properties: data.properties,
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
    console.error('Fetch error:', err, { url: url.toString() });
    throw err;
  }
}

interface BuyPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    bedrooms?: string;
    bathrooms?: string;
    priceMin?: string;
    priceMax?: string;
  }>;
}

export default async function BuyPage({ searchParams }: BuyPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1', 10);
  const search = resolvedSearchParams.search || '';
  const filters = {
    bedrooms: resolvedSearchParams.bedrooms || '',
    bathrooms: resolvedSearchParams.bathrooms || '',
    priceMin: resolvedSearchParams.priceMin || '',
    priceMax: resolvedSearchParams.priceMax || '',
  };
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
    const data = await fetchProperties(page, search, filters);
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
      <main className="bg-gray-50 min-h-screen">
        <SearchBarSection defaultSearch={search} />
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--navbar-height)+7rem)] pb-8">
          <header className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Properties for Sale
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  {error
                    ? 'Error loading properties'
                    : `Showing ${properties.length} of ${pagination.totalItems} properties`}
                </p>
              </div>
              <ToggleButtons />
            </div>
          </header>
          {error && (
            <div className="text-red-500 text-center py-8 text-sm sm:text-base" role="alert">
              {error}
            </div>
          )}
          {properties.length === 0 && !error && (
            <div className="text-center py-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                No properties found
              </h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Try adjusting your search or explore other locations.
              </p>
              <Link
                href="/buy"
                className="mt-4 inline-block text-teal-600 text-sm sm:text-base hover:text-teal-700"
              >
                Reset Search
              </Link>
            </div>
          )}
          <ViewModeToggle properties={properties} />
          {pagination.totalPages > 1 && (
            <nav
              className="mt-8 flex flex-wrap justify-center items-center gap-2"
              aria-label="Pagination"
            >
              <Link
                href={`/buy?page=${pagination.currentPage - 1}${search ? `&search=${encodeURIComponent(search)}` : ''}${Object.entries(filters)
                  .filter(([_, v]) => v)
                  .map(([k, v]) => `&${k}=${encodeURIComponent(v)}`)
                  .join('')}`}
                className={`p-2 rounded-lg ${
                  !pagination.hasPreviousPage
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-100'
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              {paginationRange().map((pageNum, index) =>
                typeof pageNum === 'string' ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-gray-600 text-sm"
                  >
                    ...
                  </span>
                ) : (
                  <Link
                    key={pageNum}
                    href={`/buy?page=${pageNum}${search ? `&search=${encodeURIComponent(search)}` : ''}${Object.entries(filters)
                      .filter(([_, v]) => v)
                      .map(([k, v]) => `&${k}=${encodeURIComponent(v)}`)
                      .join('')}`}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm ${
                      pagination.currentPage === pageNum
                        ? 'bg-teal-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    aria-label={`Page ${pageNum}`}
                    aria-current={
                      pagination.currentPage === pageNum ? 'page' : undefined
                    }
                  >
                    {pageNum}
                  </Link>
                )
              )}
              <Link
                href={`/buy?page=${pagination.currentPage + 1}${search ? `&search=${encodeURIComponent(search)}` : ''}${Object.entries(filters)
                  .filter(([_, v]) => v)
                  .map(([k, v]) => `&${k}=${encodeURIComponent(v)}`)
                  .join('')}`}
                className={`p-2 rounded-lg ${
                  !pagination.hasNextPage
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-100'
                }`}
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