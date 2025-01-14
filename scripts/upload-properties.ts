import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { propertiesToAdd } from './addProperties';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface PropertyData {
  title: string;
  description: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  bq: number;
  toilets: number;
  area: number;
  location: string;
  city: string;
  state: string;
  images: string[];
  features: string[];
}

// Area coordinates mapping
const areaCoordinates: Record<string, { lat: number; lng: number }> = {
  'Lekki': { lat: 6.4698, lng: 3.5852 },
  'Ikeja': { lat: 6.6018, lng: 3.3515 },
  'Victoria Island': { lat: 6.4281, lng: 3.4219 },
  'Ajah': { lat: 6.4698, lng: 3.5652 },
  'Ikoyi': { lat: 6.4500, lng: 3.4333 },
  'Surulere': { lat: 6.4904, lng: 3.3457 },
  'Yaba': { lat: 6.5163, lng: 3.3853 },
  'Gbagada': { lat: 6.5608, lng: 3.3897 },
  'Maryland': { lat: 6.5761, lng: 3.3661 },
  'Magodo': { lat: 6.6179, lng: 3.3773 },
  
  // Abuja Areas
  'Maitama': { lat: 9.0833, lng: 7.5000 },
  'Asokoro': { lat: 9.0437, lng: 7.5048 },
  'Wuse': { lat: 9.0765, lng: 7.4799 },
  'Garki': { lat: 9.0333, lng: 7.4833 },
  
  // Port Harcourt Areas
  'Old GRA': { lat: 4.8156, lng: 7.0498 },
  'New GRA': { lat: 4.8244, lng: 7.0336 },
  'Peter Odili Road': { lat: 4.7933, lng: 7.0323 }
};

function getCoordinatesForLocation(location: string): { latitude: number; longitude: number } | null {
  const matchingArea = Object.keys(areaCoordinates).find(
    area => location.toLowerCase().includes(area.toLowerCase())
  );

  if (!matchingArea) return null;

  // Add small random variation for more realistic distribution
  const coordinates = areaCoordinates[matchingArea];
  const latitude = coordinates.lat + (Math.random() - 0.5) * 0.01;
  const longitude = coordinates.lng + (Math.random() - 0.5) * 0.01;

  return { latitude, longitude };
}

async function createProperty(supabase: SupabaseClient, propertyData: PropertyData) {
  try {
    // Get coordinates based on location
    const coordinates = getCoordinatesForLocation(propertyData.location);

    // Convert relative image paths to public URLs
    const imageUrls = await Promise.all(
      propertyData.images.map(imagePath => {
        const cleanPath = imagePath.replace(/^\/images\//, '');
        return getImagePublicUrl(supabase, cleanPath);
      })
    );

    // Create the property record with coordinates
    const { data: property, error } = await supabase
      .from('properties')
      .insert([
        {
          title: propertyData.title,
          description: propertyData.description,
          price: propertyData.price,
          type: propertyData.type,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          bq: propertyData.bq,
          toilets: propertyData.toilets,
          area: propertyData.area,
          location: propertyData.location,
          city: propertyData.city,
          state: propertyData.state,
          status: 'AVAILABLE',
          agent_id: 'abiterra-admin',
          latitude: coordinates?.latitude ?? null,
          longitude: coordinates?.longitude ?? null
        }
      ])
      .select()
      .single();

    if (error) throw error;
    if (!property) throw new Error('No property returned after insertion');

    // Insert the image URLs
    const { error: imageError } = await supabase
      .from('property_images')
      .insert(
        imageUrls.map(url => ({
          property_id: property.id,
          url: url
        }))
      );

    if (imageError) throw imageError;

    // Insert the features
    const { error: featureError } = await supabase
      .from('property_features')
      .insert(
        propertyData.features.map(feature => ({
          property_id: property.id,
          name: feature
        }))
      );

    if (featureError) throw featureError;

    console.log(`✅ Successfully created property: ${propertyData.title}${coordinates ? ' with coordinates' : ''}`);
    return property;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to create property "${propertyData.title}": ${errorMessage}`);
  }
}


function getImagePublicUrl(supabase: SupabaseClient<any, "public", any>, cleanPath: string): any {
    throw new Error('Function not implemented.');
}
