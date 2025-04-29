'use client';

import { useEffect } from 'react';
import { LayoutGrid, Map } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useViewMode } from './ViewModeContext';

export default function ToggleButtons() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { viewMode, setViewMode } = useViewMode();
  const initialViewMode = searchParams?.get('view') === 'map' ? 'map' : 'grid';

  // Sync initial view mode from URL
  useEffect(() => {
    if (initialViewMode !== viewMode) {
      setViewMode(initialViewMode);
    }
  }, [initialViewMode, setViewMode]);

  // Update URL when view mode changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (viewMode === 'map') {
      params.set('view', 'map');
    } else {
      params.delete('view');
    }
    router.replace(`/buy?${params.toString()}`, { scroll: false });
  }, [viewMode, router, searchParams]);

  const handleViewModeChange = (mode: 'grid' | 'map') => {
    setViewMode(mode);
  };

  return (
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
  );
}