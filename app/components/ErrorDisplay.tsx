'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import RefreshButton from '@/app/buy/RetryButton';

export default function ErrorDisplay({
  error,
  errorDetails,
  isRetrying,
}: {
  error: string;
  errorDetails: string | null;
  isRetrying: boolean;
}) {
  const [remainingTime, setRemainingTime] = useState(15);

  useEffect(() => {
    if (isRetrying) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRetrying]);

  return (
    <div className="space-y-4 text-center py-8 text-sm sm:text-base" role="alert">
      <div className="text-red-500">
        {error}
        {error.includes('Database') && (
          <>
            <br />
            {isRetrying ? (
              <span className="flex items-center justify-center gap-2 mt-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-teal-500"></div>
                <span>Retrying in approximately {remainingTime} seconds...</span>
              </span>
            ) : (
              <span className="block mt-2">
                Connection failed. Try again or check back in about 30 seconds.
                <Link
                  href="/"
                  className="text-teal-600 hover:text-teal-700 ml-1"
                >
                  Go to Home
                </Link>
              </span>
            )}
            <p className="mt-2 text-gray-600">
              Some recent properties may still be visible below (cached data).
            </p>
            {error.includes('Database schema error') && (
              <p className="mt-2 text-gray-600">
                The database configuration contains unsupported data types or access restrictions. Please contact support.
              </p>
            )}
          </>
        )}
      </div>
      {process.env.NODE_ENV !== 'production' && errorDetails && (
        <div className="text-xs bg-gray-100 p-4 rounded text-left overflow-x-auto max-w-full">
          <p className="font-semibold">Error Details (only visible in development):</p>
          <p className="text-red-600 mt-1">{errorDetails}</p>
        </div>
      )}
      <div className="mt-4 flex justify-center gap-4">
        <RefreshButton />
        <button
          onClick={() => window.location.reload()}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors text-sm sm:text-base"
        >
          Retry Now
        </button>
        <Link
          href="/contact"
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors text-sm sm:text-base"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}