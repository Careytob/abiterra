// app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import * as Sentry from '@sentry/nextjs';
import {
  envDefaults,
  getMarketSettings,
  isValidCurrency,
  isValidLocale,
  type MarketSettings,
} from '@/lib/site-config';
import { loadSiteConfig, saveSiteSettings, resetSiteSettings } from '@/lib/site-settings';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') return null;
  return session;
}

/** Validate an untrusted body into MarketSettings, or return a human-readable error. */
function validate(body: unknown): { ok: true; value: MarketSettings } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid request.' };
  const b = body as Record<string, unknown>;

  if (!isValidCurrency(b.currency)) {
    return { ok: false, error: 'That currency code is not valid. Use a 3-letter code such as USD, GBP or KES.' };
  }
  if (!isValidLocale(b.locale)) {
    return { ok: false, error: 'That number format (locale) is not valid. Example: en-US or en-GB.' };
  }
  if (b.areaUnit !== 'sqft' && b.areaUnit !== 'sqm') {
    return { ok: false, error: 'Area unit must be square feet or square metres.' };
  }
  if (b.rentPeriod !== 'week' && b.rentPeriod !== 'month' && b.rentPeriod !== 'year') {
    return { ok: false, error: 'Rent period must be week, month or year.' };
  }
  for (const k of ['rentals', 'showToilets', 'showBQ'] as const) {
    if (typeof b[k] !== 'boolean') return { ok: false, error: `Invalid value for ${k}.` };
  }

  return {
    ok: true,
    value: {
      currency: b.currency.toUpperCase(),
      locale: b.locale,
      areaUnit: b.areaUnit,
      rentPeriod: b.rentPeriod,
      rentals: b.rentals as boolean,
      showToilets: b.showToilets as boolean,
      showBQ: b.showBQ as boolean,
    },
  };
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await loadSiteConfig();
    return NextResponse.json({ settings: getMarketSettings(), defaults: envDefaults });
  } catch (err) {
    console.error('[SettingsAPI] Failed to load settings:', err);
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const parsed = validate(await request.json().catch(() => null));
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  try {
    const settings = await saveSiteSettings(parsed.value);
    return NextResponse.json({ settings });
  } catch (err) {
    console.error('[SettingsAPI] Failed to save settings:', err);
    Sentry.captureException(err);
    return NextResponse.json(
      { error: 'Could not save settings. If this is a new install, make sure database migrations have run.' },
      { status: 500 }
    );
  }
}

// Reset to the defaults from the environment.
export async function DELETE() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const settings = await resetSiteSettings();
    return NextResponse.json({ settings });
  } catch (err) {
    console.error('[SettingsAPI] Failed to reset settings:', err);
    Sentry.captureException(err);
    return NextResponse.json({ error: 'Could not reset settings' }, { status: 500 });
  }
}
