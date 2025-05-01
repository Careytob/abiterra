// app/buy/page.tsx
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ViewModeToggle from './ViewModeToggle';
import ToggleButtons from './ToggleButtons';
import { ViewModeProvider } from './ViewModeContext';
import { Property } from '../types/property';
import SearchBarSection from './SearchBarSection';
import { url } from 'inspector';

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
  limit = 12,
  retries = 2
): Promise<{
  properties: Property[];
  pagination: PaginationInfo;
}> {
  const searchParam = search?.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
  const filterParams = Object.entries(filters)
    .filter(([_, value]) => value)
    .map(([key, value]) => `&${key}=${encodeURIComponent(value)}`)
    .join('');

  const isProduction = process.env.NODE_ENV === 'production';

  // Define the base URL for the API
  let baseUrl: string;
  if (isProduction) {
    // Use the environment variable or fallback to the correct domain
    baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://abiterra.com'; 
  } else {
    baseUrl = 'http://localhost:3000';
  }

  // Ensure no trailing slash and construct the full API URL
  baseUrl = baseUrl.replace(/\/$/, '');
  const apiUrl = `${baseUrl}/api/properties?type=SALE&page=${page}&limit=${limit}${searchParam}${filterParams}`;

  console.log(`Environment: ${process.env.NODE_ENV}, Using API URL: ${apiUrl}`);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Fetching properties (attempt ${attempt}):`, apiUrl);

      const fetchOptions = isProduction
        ? { cache: 'no-store' as RequestCache }
        : { next: { revalidate: 300 } };

      const response = await fetch(apiUrl, fetchOptions);

      if (!response.ok) {
        // Read the body only once
        let errorDetail = '';
        try {
          // Try to parse as JSON first
          errorDetail = JSON.stringify(await response.json());
        } catch (e) {
          // If JSON parsing fails, fall back to text without re-reading
          errorDetail = 'Failed to parse error response as JSON';
        }

        console.error(`HTTP error response:`, {
          status: response.status,
          statusText: response.statusText,
          url: apiUrl,
          detail: errorDetail,
        });

        throw new Error(
          `HTTP error! status: ${response.status}, url: ${apiUrl}, details: ${errorDetail}`
        );
      }

      const data = await response.json();

      console.log(`API response received:`, {
        hasProperties: !!data.properties,
        propertiesLength: data.properties?.length,
        paginationInfo: data.pagination,
      });

      if (!data.properties || !Array.isArray(data.properties)) {
        console.error(`Invalid API response format:`, data);
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
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      const errorCause = err instanceof Error && err.cause ? `Cause: ${JSON.stringify(err.cause)}` : '';

      console.error(`Fetch error (attempt ${attempt}/${retries}):`, {
        message: errorMessage,
        cause: errorCause,
        url: apiUrl,
      });

      if (attempt === retries) throw err;

      const backoffTime = attempt * 1000;
      console.log(`Retrying in ${backoffTime}ms...`);
      await new Promise((resolve) => setTimeout(resolve, backoffTime));
    }
  }

  throw new Error('Failed to fetch properties after all retries');
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
  let errorDetails: string | null = null;

  try {
    console.log('BuyPage: Attempting to fetch properties', { 
      page, search, filters, 
      env: process.env.NODE_ENV 
    });
    
    const data = await fetchProperties(page, search, filters);
    properties = data.properties;
    pagination = data.pagination;
    
    console.log('BuyPage: Successfully fetched properties', { 
      count: properties.length,
      pagination 
    });
  } catch (err) {
    const baseError = err instanceof Error ? err.message : 'An unknown error occurred';
    const cause = err instanceof Error && err.cause ? ` (Cause: ${JSON.stringify(err.cause)})` : '';
    
    error = 'Unable to load properties';
    errorDetails = `${baseError}${cause}`;
    
    console.error('BuyPage error:', {
      message: baseError,
      cause: cause,
      stack: err instanceof Error ? err.stack : undefined
    });
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
                  ? 'Unable to load properties'
                  : `Showing ${properties.length} of ${pagination.totalItems} properties`}
              </p>
            </div>
            <ToggleButtons />
          </div>
        </header>
        {error && (
          <div className="space-y-4 text-center py-8 text-sm sm:text-base" role="alert">
            <div className="text-red-500">
              Unable to load properties. Please try again later or contact support.
            </div>
            {process.env.NODE_ENV !== 'production' && errorDetails && (
              <div className="text-xs bg-gray-100 p-4 rounded text-left overflow-x-auto max-w-full">
                <p className="font-semibold">Error Details (only visible in development):</p>
                <p className="text-red-600 mt-1">{errorDetails}</p>
              </div>
            )}
            <div className="mt-4">
              <Link
                href="/buy"
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors"
              >
                Refresh Page
              </Link>
            </div>
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