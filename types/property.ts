// types/property.ts
import { property_type, property_status } from '@prisma/client';

/**
 * Property interface that matches the database schema with proper typing
 * for the related images and features.
 */
export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  price: number;
  type: property_type;
  availability: boolean;
  area: number | null;
  bathrooms: number;
  bedrooms: number;
  bq: number;
  city: string;
  state: string;
  status: property_status;
  toilets: number;
  latitude: number | null;
  longitude: number | null;
  createdAt: Date;
  updatedAt: Date;
  isFeatured: boolean;
  agentId: string;
  images: PropertyImage[];
  features: PropertyFeature[];
}

export interface PropertyImage {
  id: string;
  url: string;
  filePath?: string | null;
  imageType?: string | null;
  isMain?: boolean;
}

export interface PropertyFeature {
  id: string;
  name: string;
}