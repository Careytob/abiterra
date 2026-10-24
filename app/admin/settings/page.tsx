'use client';

// app/admin/settings/page.tsx
//
// Lets a non-technical admin set currency, number format, units and feature switches
// without touching code or environment variables. Saved values override the env defaults.
import { useEffect, useMemo, useState } from 'react';
import { formatPriceWith, type MarketSettings } from '@/lib/site-config';
import { COUNTRY_PRESETS, CURRENCIES, LOCALES } from '@/lib/market-presets';

const RENT_SHORT = { week: 'wk', month: 'mo', year: 'yr' } as const;
const OTHER = '__other__';

export default function AdminSettingsPage() {
  const [form, setForm] = useState<MarketSettings | null>(null);
  const [defaults, setDefaults] = useState<MarketSettings | null>(null);
  const [loadError, setLoadError] = useState('');
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [customCurrency, setCustomCurrency] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load settings');
        setForm(json.settings);
        setDefaults(json.defaults);
        setCustomCurrency(!CURRENCIES.some((c) => c.code === json.settings.currency));
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'Failed to load settings');
      }
    })();
  }, []);

  const update = <K extends keyof MarketSettings>(key: K, value: MarketSettings[K]) => {
    setMessage(null);
    setForm((f) => (f ? { ...f, [key]: value } : f));
  };

  const applyPreset = (id: string) => {
    const preset = COUNTRY_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setMessage(null);
    setCustomCurrency(false);
    setForm((f) =>
      f
        ? { ...f, currency: preset.currency, locale: preset.locale, areaUnit: preset.areaUnit, rentPeriod: preset.rentPeriod }
        : f
    );
  };

  // Locale list: include the current value even if it isn't one of the common ones.
  const localeOptions = useMemo(() => {
    if (!form) return LOCALES;
    return LOCALES.some((l) => l.code === form.locale) ? LOCALES : [{ code: form.locale, name: `${form.locale} (custom)` }, ...LOCALES];
  }, [form]);

  const preview = useMemo(() => {
    if (!form) return null;
    const area = `${(1200).toLocaleString(form.locale)} ${form.areaUnit === 'sqm' ? 'sq m' : 'sq ft'}`;
    return {
      sale: formatPriceWith(450000, form.locale, form.currency.toUpperCase()),
      rent: `${formatPriceWith(1850, form.locale, form.currency.toUpperCase())} / ${RENT_SHORT[form.rentPeriod]}`,
      area,
    };
  }, [form]);

  async function save() {
    if (!form) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not save settings');
      setMessage({ type: 'ok', text: 'Saved. Applying your changes across the site…' });
      // Reload so this browser picks up the new values everywhere.
      setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Could not save settings' });
      setSaving(false);
    }
  }

  async function resetToDefaults() {
    if (!window.confirm('Reset all of these settings back to the defaults set when the site was installed?')) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/settings', { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not reset settings');
      setMessage({ type: 'ok', text: 'Reset. Applying defaults across the site…' });
      setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Could not reset settings' });
      setSaving(false);
    }
  }

  if (loadError) return <p className="rounded-md bg-red-50 p-4 text-sm text-red-700">{loadError}</p>;
  if (!form || !preview) return <p className="text-sm text-zinc-500">Loading settings…</p>;

  const field = 'w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600';
  const label = 'mb-1 block text-sm font-medium text-zinc-700';
  const card = 'rounded-lg border border-zinc-200 bg-white p-5';

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Market settings</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Choose how prices, sizes and rents appear on your site. Changes apply to every page.
        </p>
      </div>

      <section className={card}>
        <h2 className="mb-1 font-medium text-zinc-900">Quick setup</h2>
        <p className="mb-3 text-sm text-zinc-500">
          Pick your country to fill in the currency, number format, size unit and rent period. You can still adjust each one below.
        </p>
        <select className={field} defaultValue="" onChange={(e) => applyPreset(e.target.value)} aria-label="Choose your country">
          <option value="" disabled>
            Choose your country…
          </option>
          {COUNTRY_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label} ({p.currency})
            </option>
          ))}
        </select>
      </section>

      <section className={`${card} space-y-4`}>
        <h2 className="font-medium text-zinc-900">Currency and number format</h2>

        <div>
          <label className={label} htmlFor="currency">Currency</label>
          <select
            id="currency"
            className={field}
            value={customCurrency ? OTHER : form.currency}
            onChange={(e) => {
              if (e.target.value === OTHER) {
                setCustomCurrency(true);
              } else {
                setCustomCurrency(false);
                update('currency', e.target.value);
              }
            }}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
            <option value={OTHER}>Other (enter a code)…</option>
          </select>
          {customCurrency && (
            <input
              className={`${field} mt-2 uppercase`}
              maxLength={3}
              placeholder="3-letter code, e.g. XAF"
              value={form.currency}
              onChange={(e) => update('currency', e.target.value.toUpperCase())}
              aria-label="Custom currency code"
            />
          )}
        </div>

        <div>
          <label className={label} htmlFor="locale">Number format</label>
          <select id="locale" className={field} value={form.locale} onChange={(e) => update('locale', e.target.value)}>
            {localeOptions.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-zinc-500">
            Controls separators and where the currency symbol goes. Match it to your country, for example Canadian dollars with “English (Canada)”. The site text itself stays in English.
          </p>
        </div>
      </section>

      <section className={`${card} space-y-4`}>
        <h2 className="font-medium text-zinc-900">Sizes and rents</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="areaUnit">Property size unit</label>
            <select id="areaUnit" className={field} value={form.areaUnit} onChange={(e) => update('areaUnit', e.target.value as MarketSettings['areaUnit'])}>
              <option value="sqft">Square feet (sq ft)</option>
              <option value="sqm">Square metres (sq m)</option>
            </select>
          </div>
          <div>
            <label className={label} htmlFor="rentPeriod">Rent is quoted per</label>
            <select id="rentPeriod" className={field} value={form.rentPeriod} onChange={(e) => update('rentPeriod', e.target.value as MarketSettings['rentPeriod'])}>
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="year">Year</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-zinc-500">
          Changing the size unit or rent period only changes the labels. Existing numbers are not converted, so update listings to match.
        </p>
      </section>

      <section className={`${card} space-y-3`}>
        <h2 className="font-medium text-zinc-900">What to show</h2>
        {([
          ['rentals', 'Show rentals', 'Adds Rent to the menu and the homepage, and a rentals page for visitors.'],
          ['showToilets', 'Show a “Toilets” count on listings', 'Common in some regions; most markets only list bathrooms.'],
          ['showBQ', 'Show a “BQ” (boys’ quarters) count on listings', 'Used in Nigerian listings.'],
        ] as const).map(([key, title, hint]) => (
          <label key={key} className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-600"
              checked={form[key]}
              onChange={(e) => update(key, e.target.checked)}
            />
            <span>
              <span className="block text-sm font-medium text-zinc-800">{title}</span>
              <span className="block text-xs text-zinc-500">{hint}</span>
            </span>
          </label>
        ))}
      </section>

      <section className="rounded-lg border border-teal-200 bg-teal-50 p-5">
        <h2 className="mb-3 font-medium text-teal-900">Preview</h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-teal-800/70">A property for sale</dt>
            <dd className="text-lg font-semibold text-teal-950">{preview.sale}</dd>
          </div>
          <div>
            <dt className="text-teal-800/70">A rental</dt>
            <dd className="text-lg font-semibold text-teal-950">{preview.rent}</dd>
          </div>
          <div>
            <dt className="text-teal-800/70">A property size</dt>
            <dd className="text-lg font-semibold text-teal-950">{preview.area}</dd>
          </div>
        </dl>
      </section>

      {message && (
        <p
          role="status"
          className={`rounded-md p-3 text-sm ${message.type === 'ok' ? 'bg-teal-50 text-teal-800' : 'bg-red-50 text-red-700'}`}
        >
          {message.text}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 pb-8">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-md bg-teal-600 px-5 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save settings'}
        </button>
        <button
          onClick={resetToDefaults}
          disabled={saving}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
        >
          Reset to defaults
        </button>
        {defaults && (
          <span className="text-xs text-zinc-400">
            Defaults: {defaults.currency} · {defaults.locale} · {defaults.areaUnit === 'sqm' ? 'sq m' : 'sq ft'} · per {defaults.rentPeriod}
          </span>
        )}
      </div>
    </div>
  );
}
