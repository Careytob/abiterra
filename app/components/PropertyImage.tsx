'use client';

import Image from 'next/image';
import { ImageProps } from 'next/image';

const PropertyImage = (props: ImageProps) => {
  return <Image {...props} />;
};

export default PropertyImage;