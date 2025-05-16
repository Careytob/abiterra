'use client';

import { useRouter } from 'next/navigation';

export default function RetryButton() {
  const router = useRouter();

  const handleRetry = () => {
    router.refresh();
  };

  return (
    <button
    onClick={() => window.location.reload()}
    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors text-sm sm:text-base"
  >
    Retry Now
  </button>





  );
}