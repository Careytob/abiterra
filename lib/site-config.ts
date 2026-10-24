// lib/site-config.ts
//
// Single source of truth for everything that makes a deployment "yours":
// brand name, URL, currency, locale, units, contact details, map defaults and
// small regional feature flags. Everything is driven by environment variables
// so one codebase can be white-labelled for any market without code changes.
//
// IMPORTANT: Next.js inlines NEXT_PUBLIC_* variables at build time, and only
// when they are written out literally (process.env.NEXT_PUBLIC_X). That is why
// every variable below is referenced by its full name instead of via a loop.
// Change a value in your env, then rebuild/redeploy.
//
// This file is safe to import from both server and client components.

function clean(value: string | undefined): string {
  return (value ?? '').trim();
}

function str(value: string | undefined, fallback: string): string {
  const v = clean(value);
  return v || fallback;
}

function bool(value: string | undefined, fallback: boolean): boolean {
  const v = clean(value).toLowerCase();
  if (!v) return fallback;
  return v === 'true' || v === '1' || v === 'yes';
}

function num(value: string | undefined, fallback: number): number {
  const n = Number(clean(value));
  return clean(value) !== '' && Number.isFinite(n) ? n : fallback;
}

// On Vercel, fall back to the project's production domain (injected via next.config.ts)
// so a fresh deploy doesn't advertise http://localhost:3000 in canonical URLs and emails.
const vercelHost = clean(process.env.NEXT_PUBLIC_VERCEL_PROD_URL);

const siteUrl = str(
  process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    (vercelHost ? `https://${vercelHost}` : ''),
  'http://localhost:3000'
).replace(/\/+$/, '');

const siteName = str(process.env.NEXT_PUBLIC_SITE_NAME, 'Abiterra');

import type { AreaUnit, RentPeriod } from './market-presets';
export type { AreaUnit, RentPeriod };

const rentPeriodRaw = clean(process.env.NEXT_PUBLIC_RENT_PERIOD).toLowerCase();
const rentPeriod: RentPeriod =
  rentPeriodRaw === 'year' || rentPeriodRaw === 'week' ? rentPeriodRaw : 'month';

const areaUnit: AreaUnit =
  clean(process.env.NEXT_PUBLIC_AREA_UNIT).toLowerCase() === 'sqm' ? 'sqm' : 'sqft';

export const siteConfig = {
  // --- Branding -----------------------------------------------------------
  name: siteName,
  tagline: str(process.env.NEXT_PUBLIC_SITE_TAGLINE, 'Find Your Dream Home'),
  description: str(
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
    'Browse verified properties from trusted agents and owners. Search listings, view details and enquire directly.'
  ),
  url: siteUrl,
  host: (() => {
    try {
      return new URL(siteUrl).host;
    } catch {
      return 'localhost:3000';
    }
  })(),
  /** Text stamped on listing photos. Defaults to the site host (e.g. "example.com"). */
  watermarkText: clean(process.env.NEXT_PUBLIC_WATERMARK_TEXT) || '',

  // --- Locale / money / units ---------------------------------------------
  /** BCP-47 locale used for number & currency formatting, e.g. en-US, en-GB, en-KE, en-AE. */
  locale: str(process.env.NEXT_PUBLIC_LOCALE, 'en-US'),
  /** ISO-4217 currency code, e.g. USD, GBP, KES, AED, NGN, PHP. */
  currency: str(process.env.NEXT_PUBLIC_CURRENCY, 'USD').toUpperCase(),
  areaUnit,
  /** How rents are quoted: 'month' (default), 'year' or 'week'. */
  rentPeriod,

  // --- Region (optional marketing copy + structured data) -----------------
  /** Human readable market, e.g. "Nairobi, Kenya". Leave empty for region-neutral copy. */
  regionName: clean(process.env.NEXT_PUBLIC_REGION_NAME),
  /** ISO-3166 alpha-2 country code, used only in schema.org structured data. */
  countryCode: clean(process.env.NEXT_PUBLIC_COUNTRY_CODE).toUpperCase(),

  // --- Contact (a field left empty is simply not rendered) ----------------
  contact: {
    email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    phone: clean(process.env.NEXT_PUBLIC_CONTACT_PHONE),
    address: clean(process.env.NEXT_PUBLIC_CONTACT_ADDRESS),
  },
  social: {
    facebook: clean(process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK),
    instagram: clean(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM),
    twitter: clean(process.env.NEXT_PUBLIC_SOCIAL_TWITTER),
  },

  // --- Legal (used by the privacy / terms templates) -----------------------
  legal: {
    /** Operating entity shown in the legal pages. Defaults to the site name. */
    entity: str(process.env.NEXT_PUBLIC_LEGAL_ENTITY, siteName),
    /** e.g. "the State of California, USA" or "England and Wales". */
    governingLaw: str(process.env.NEXT_PUBLIC_GOVERNING_LAW, 'the jurisdiction in which the operator is established'),
  },

  // --- Map defaults (used when a listing has no coordinates) ---------------
  map: {
    latitude: num(process.env.NEXT_PUBLIC_DEFAULT_LAT, 40.7128),
    longitude: num(process.env.NEXT_PUBLIC_DEFAULT_LNG, -74.006),
  },

  // --- Feature flags -------------------------------------------------------
  features: {
    /** Rentals module (/rent). */
    rentals: bool(process.env.NEXT_PUBLIC_ENABLE_RENTALS, false),
    /** "Toilets" count — common in West Africa; most markets don't list it separately. */
    showToilets: bool(process.env.NEXT_PUBLIC_SHOW_TOILETS, false),
    /**
     * Stamp listing photos with a text watermark. OFF by default: it renders text with
     * sharp/librsvg, which crashes (SIGSEGV) on serverless hosts that have no fonts or
     * fontconfig (e.g. Vercel) unless you bundle fonts. Enable only on hosts you've tested.
     */
    watermark: bool(process.env.NEXT_PUBLIC_ENABLE_WATERMARK, false),
    /** "BQ" (boys' quarters) — specific to Nigerian listings. */
    showBQ: bool(process.env.NEXT_PUBLIC_SHOW_BQ, false),
  },
};

// ---------------------------------------------------------------------------
// Runtime market settings (editable from Admin -> Settings)
// ---------------------------------------------------------------------------
//
// The values above come from environment variables and act as the DEFAULTS. The admin
// Settings page stores overrides in the database; the server loads them (see
// lib/site-settings.ts) and calls applySiteSettings(), and a tiny client component does
// the same in the browser, so every formatPrice()/formatArea() call picks them up.

/** The settings a non-technical admin can change without touching code or redeploying. */
export interface MarketSettings {
  currency: string;
  locale: string;
  areaUnit: AreaUnit;
  rentPeriod: RentPeriod;
  rentals: boolean;
  showToilets: boolean;
  showBQ: boolean;
}

/** Values derived from env vars at build time: what "reset to defaults" returns to. */
export const envDefaults: MarketSettings = {
  currency: siteConfig.currency,
  locale: siteConfig.locale,
  areaUnit: siteConfig.areaUnit,
  rentPeriod: siteConfig.rentPeriod,
  rentals: siteConfig.features.rentals,
  showToilets: siteConfig.features.showToilets,
  showBQ: siteConfig.features.showBQ,
};

/** True for a real ISO-4217 currency code that this runtime can format. */
export function isValidCurrency(code: unknown): code is string {
  if (typeof code !== 'string' || !/^[A-Za-z]{3}$/.test(code)) return false;
  try {
    new Intl.NumberFormat('en-US', { style: 'currency', currency: code.toUpperCase() }).format(1);
    return true;
  } catch {
    return false;
  }
}

/** True for a well-formed BCP-47 locale tag that this runtime supports. */
export function isValidLocale(tag: unknown): tag is string {
  if (typeof tag !== 'string' || tag.length > 35 || !/^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$/.test(tag)) return false;
  try {
    Intl.getCanonicalLocales(tag);
    return Intl.NumberFormat.supportedLocalesOf(tag).length > 0;
  } catch {
    return false;
  }
}

/** Turn stored text rows into typed settings. Anything invalid is ignored (falls back to the default). */
export function parseStoredSettings(raw: Record<string, string>): Partial<MarketSettings> {
  const out: Partial<MarketSettings> = {};
  if (isValidCurrency(raw.currency)) out.currency = raw.currency.toUpperCase();
  if (isValidLocale(raw.locale)) out.locale = raw.locale;
  if (raw.areaUnit === 'sqft' || raw.areaUnit === 'sqm') out.areaUnit = raw.areaUnit;
  if (raw.rentPeriod === 'week' || raw.rentPeriod === 'month' || raw.rentPeriod === 'year') {
    out.rentPeriod = raw.rentPeriod;
  }
  for (const k of ['rentals', 'showToilets', 'showBQ'] as const) {
    if (raw[k] === 'true') out[k] = true;
    else if (raw[k] === 'false') out[k] = false;
  }
  return out;
}

/** The market settings currently in effect. */
export function getMarketSettings(): MarketSettings {
  return {
    currency: siteConfig.currency,
    locale: siteConfig.locale,
    areaUnit: siteConfig.areaUnit,
    rentPeriod: siteConfig.rentPeriod,
    rentals: siteConfig.features.rentals,
    showToilets: siteConfig.features.showToilets,
    showBQ: siteConfig.features.showBQ,
  };
}

/**
 * Make `overrides` the active settings. Any field that is missing or invalid falls back to
 * the env default, so deleting an override and re-applying genuinely restores the default.
 * Safe to call many times with the same input (it is called during render).
 */
export function applySiteSettings(overrides: Partial<MarketSettings> = {}): void {
  const o = overrides ?? {};
  siteConfig.currency = isValidCurrency(o.currency) ? o.currency.toUpperCase() : envDefaults.currency;
  siteConfig.locale = isValidLocale(o.locale) ? o.locale : envDefaults.locale;
  siteConfig.areaUnit = o.areaUnit === 'sqm' || o.areaUnit === 'sqft' ? o.areaUnit : envDefaults.areaUnit;
  siteConfig.rentPeriod =
    o.rentPeriod === 'week' || o.rentPeriod === 'month' || o.rentPeriod === 'year' ? o.rentPeriod : envDefaults.rentPeriod;
  siteConfig.features.rentals = typeof o.rentals === 'boolean' ? o.rentals : envDefaults.rentals;
  siteConfig.features.showToilets = typeof o.showToilets === 'boolean' ? o.showToilets : envDefaults.showToilets;
  siteConfig.features.showBQ = typeof o.showBQ === 'boolean' ? o.showBQ : envDefaults.showBQ;
}

/** Pure formatter used by the live preview in the Settings page (does not touch the active config). */
export function formatPriceWith(
  amount: number,
  locale: string,
  currency: string
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format a price using the configured locale + currency, no decimals. */
export function formatPrice(amount: number | null | undefined): string {
  const value = typeof amount === 'number' && Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat(siteConfig.locale, {
      style: 'currency',
      currency: siteConfig.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    // Invalid locale/currency code in env — fail soft instead of crashing the page.
    return `${siteConfig.currency} ${value.toLocaleString()}`;
  }
}

/** Just the currency symbol, e.g. "$", "£", "KSh", "₦". Falls back to the ISO code. */
export function currencySymbol(): string {
  try {
    const parts = new Intl.NumberFormat(siteConfig.locale, {
      style: 'currency',
      currency: siteConfig.currency,
      currencyDisplay: 'narrowSymbol',
    }).formatToParts(0);
    return parts.find((p) => p.type === 'currency')?.value ?? siteConfig.currency;
  } catch {
    return siteConfig.currency;
  }
}

/** Label for price inputs, e.g. "Price ($)". */
export function priceLabel(label = 'Price'): string {
  return `${label} (${currencySymbol()})`;
}

/** "1,200 sqft" / "110 sqm". Returns `fallback` for missing or zero areas. */
export function formatArea(area: number | null | undefined, fallback = 'N/A'): string {
  if (area == null || !Number.isFinite(area) || area <= 0) return fallback;
  return `${area.toLocaleString(siteConfig.locale)} ${siteConfig.areaUnit}`;
}

/** Short unit label for form fields. */
export function areaUnitLabel(): string {
  return siteConfig.areaUnit;
}

/** Rent period labels, e.g. { long: 'month', short: 'mo' }. */
export function rentPeriodLabel(): { long: RentPeriod; short: string } {
  const short = { week: 'wk', month: 'mo', year: 'yr' }[siteConfig.rentPeriod];
  return { long: siteConfig.rentPeriod, short };
}

/** " in Nairobi, Kenya" when a region is configured, otherwise "". */
export function inRegion(): string {
  return siteConfig.regionName ? ` in ${siteConfig.regionName}` : '';
}

/** Absolute URL for a site path, e.g. absoluteUrl('/buy') -> https://example.com/buy */
export function absoluteUrl(path = ''): string {
  if (!path) return siteConfig.url;
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Page title helper: pageTitle('Buy') -> "Buy | Brand" */
export function pageTitle(title: string): string {
  return `${title} | ${siteConfig.name}`;
}

/** Text stamped on listing photos: explicit override, else the site host. */
export function watermarkText(): string {
  return siteConfig.watermarkText || siteConfig.host;
}

/** Language subtag for <html lang>, e.g. "en-GB" -> "en". */
export function htmlLang(): string {
  return siteConfig.locale.split('-')[0] || 'en';
}
