// components/PropertyImage.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ImageProps } from 'next/image';

type PropertyImageProps = Omit<ImageProps, 'src'> & {
  src: string;
  fallbackSrc?: string;
};

export default function PropertyImage({
  src,
  fallbackSrc = '/images/placeholder.jpg',
  alt,
  ...props
}: PropertyImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset states when src changes
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    console.warn('Image failed to load:', src);
    setImgSrc(fallbackSrc);
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-full">
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
        </div>
      )}
      
      <Image
        {...props}
        src={imgSrc}
        alt={alt || "Property image"}
        onError={handleError}
        onLoad={handleLoad}
        className={`${props.className || ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
    </div>
  );
}