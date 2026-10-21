// app/api/admin/properties/schema.ts
import { z } from 'zod';

// Mirrors the `property` model in prisma/schema.prisma. `type` and `status`
// stay as plain strings in the DB (not native Postgres enums), so we
// validate them here instead of relying on generated Prisma enum types.
export const propertyImageSchema = z.object({
  // Present when this image already exists on the property being edited;
  // absent for a freshly uploaded image that still needs a DB row created.
  id: z.string().optional(),
  url: z.string().min(1),
  filepath: z.string().min(1),
  imagetype: z.string().default('other'),
  ismain: z.boolean().default(false),
});

export const propertyInputSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  slug: z.string().optional(), // auto-generated from title if omitted
  description: z.string().min(10, 'Description is required'),
  location: z.string().min(2, 'Location is required'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  type: z.enum(['SALE', 'RENT']),
  status: z.enum(['AVAILABLE', 'PENDING', 'SOLD', 'RENTED']).default('AVAILABLE'),
  availability: z.boolean().default(true),
  area: z.coerce.number().nonnegative().nullable().optional(),
  bedrooms: z.coerce.number().int().nonnegative(),
  bathrooms: z.coerce.number().int().nonnegative(),
  bq: z.coerce.number().int().nonnegative().default(0),
  toilets: z.coerce.number().int().nonnegative().default(0),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  latitude: z.coerce.number().nullable().optional(),
  longitude: z.coerce.number().nullable().optional(),
  isfeatured: z.boolean().default(false),
  agentid: z.string().min(1).default('admin'),
  features: z.array(z.string().min(1)).default([]),
  images: z.array(propertyImageSchema).default([]),
});

export type PropertyInput = z.infer<typeof propertyInputSchema>;
