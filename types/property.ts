// types/property.ts
import { property_type, property_status } from '@prisma/client';

/**
 * Property interface that matches the database schema with proper typing
 * for the related images and features.
 */
export interface Property {
  images: any;
  features: any;
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  price: number;
  type: string;
  availability?: boolean;
  area?: number;
  bathrooms: number;
  bedrooms: number;
  bq: number;
  city: string;
  state: string;
  status: string;
  toilets: number;
  latitude?: number;
  longitude?: number;
  createdat?: string;
  updatedat?: string;
  isfeatured?: boolean;
  agentid: string;
  image_url?: string;
  image_id?: string;
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