// lib/propertyHelpers.ts
import { createClient } from '@supabase/supabase-js';

// Define the Property type based on your database schema
interface Property {
  id: string | number;
  slug: string;
  title: string;
  updated_at: string;
  created_at: string;
  // status is now optional since we're not selecting it
  status?: string;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function getAllProperties(): Promise<Property[]> {
  const { data: properties, error } = await supabase
    .from('properties')  // Replace with your actual table name
    .select('id, slug, title, updated_at, created_at')
    .eq('status', 'active')  // We filter by status but don't select it
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching properties for sitemap:', error);
    return [];
  }
  
  return (properties || []) as Property[];
}