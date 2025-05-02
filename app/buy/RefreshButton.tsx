'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function RefreshButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Preserve current query parameters
    const currentParams = searchParams?.toString() ?? '';
    const refreshUrl = `/buy${currentParams ? `?${currentParams}` : ''}`;
    // Force a full page refresh
    router.replace(refreshUrl);
    // router.refresh() could be used, but replace ensures a new fetch
    setTimeout(() => setIsRefreshing(false), 1000); // Reset loading state
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={`flex items-center gap-2 px-4 py-2 rounded text-sm sm:text-base transition-colors ${
        isRefreshing
          ? 'bg-teal-400 text-white cursor-not-allowed'
          : 'bg-teal-600 text-white hover:bg-teal-700'
      }`}
      aria-label="Refresh properties"
    >
      <RefreshCw
        className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
      />
      Refresh
    </button>
  );
}