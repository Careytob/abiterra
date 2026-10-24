'use client';

import { applySiteSettings, type MarketSettings } from '@/lib/site-config';

/**
 * Applies the admin-saved market settings (currency, locale, units...) to the BROWSER copy of
 * the site config. The root layout renders this first, so every client component rendered after
 * it (on the server for the first paint, then in the browser) formats prices with the right
 * values. Rendering has no visual output.
 *
 * Applying during render is deliberate: the call is idempotent and must happen before sibling
 * components render. (An effect would run too late for the first render.)
 */
export default function SiteSettingsHydrator({ settings }: { settings: MarketSettings }) {
  applySiteSettings(settings);
  return null;
}
