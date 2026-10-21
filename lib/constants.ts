import { siteConfig } from './site-config';

// Used when a listing has no coordinates. Configure with
// NEXT_PUBLIC_DEFAULT_LAT / NEXT_PUBLIC_DEFAULT_LNG (see .env.example).
export const DEFAULT_COORDINATES = {
  latitude: siteConfig.map.latitude,
  longitude: siteConfig.map.longitude,
};
