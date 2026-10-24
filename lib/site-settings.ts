// lib/site-settings.ts  (SERVER ONLY: do not import from client components)
//
// Loads and saves the admin-editable market settings (currency, locale, units, feature
// switches). Environment variables are the defaults; rows in the `site_setting` table
// override them. See lib/site-config.ts for the active-config helpers.
import { unstable_cache, revalidateTag, revalidatePath } from 'next/cache';
import prisma from './prisma';
import {
  siteConfig,
  applySiteSettings,
  getMarketSettings,
  parseStoredSettings,
  type MarketSettings,
} from './site-config';

export const SETTINGS_TAG = 'site-settings';

const KEYS: (keyof MarketSettings)[] = [
  'currency',
  'locale',
  'areaUnit',
  'rentPeriod',
  'rentals',
  'showToilets',
  'showBQ',
];

// Cached across requests; invalidated by saveSiteSettings(). A failure is NOT cached.
const readStoredSettings = unstable_cache(
  async () => {
    const rows = await prisma.site_setting.findMany();
    const out: Record<string, string> = {};
    for (const r of rows) out[r.key] = r.value;
    return out;
  },
  ['site-settings-v1'],
  { tags: [SETTINGS_TAG], revalidate: 3600 }
);

/**
 * Apply the saved settings to the active config and return it.
 * Call this at the top of any SERVER component / metadata function / route that formats
 * prices or reads the rentals flag. Browsers get the same values via <SiteSettingsHydrator>.
 * If the database is unreachable (or the table doesn't exist yet) the env defaults are used.
 */
export async function loadSiteConfig() {
  try {
    applySiteSettings(parseStoredSettings(await readStoredSettings()));
  } catch (err) {
    console.error('[SiteSettings] Could not load settings, using environment defaults:', err);
  }
  return siteConfig;
}

function refreshSite() {
  revalidateTag(SETTINGS_TAG);
  // Cached pages (e.g. the homepage) contain formatted prices, so rebuild them too.
  revalidatePath('/', 'layout');
}

/** Persist a full set of settings. Values must already be validated. */
export async function saveSiteSettings(next: MarketSettings): Promise<MarketSettings> {
  await prisma.$transaction(
    KEYS.map((key) =>
      prisma.site_setting.upsert({
        where: { key },
        update: { value: String(next[key]) },
        create: { key, value: String(next[key]) },
      })
    )
  );
  applySiteSettings(next);
  refreshSite();
  return getMarketSettings();
}

/** Delete every override so the env defaults apply again. */
export async function resetSiteSettings(): Promise<MarketSettings> {
  await prisma.site_setting.deleteMany();
  applySiteSettings({});
  refreshSite();
  return getMarketSettings();
}
