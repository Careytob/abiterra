// lib/market-presets.ts
//
// Plain data shared by the admin Settings page (client) and the settings API (server):
// the currencies and number-format locales offered in the dropdowns, plus one-click
// "country" presets that fill in sensible defaults. Presets are only suggestions; every
// field can still be changed afterwards.

export type AreaUnit = 'sqft' | 'sqm';
export type RentPeriod = 'week' | 'month' | 'year';

export const CURRENCIES: { code: string; name: string }[] = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'NZD', name: 'New Zealand Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'SEK', name: 'Swedish Krona' },
  { code: 'NOK', name: 'Norwegian Krone' },
  { code: 'DKK', name: 'Danish Krone' },
  { code: 'PLN', name: 'Polish Zloty' },
  { code: 'CZK', name: 'Czech Koruna' },
  { code: 'HUF', name: 'Hungarian Forint' },
  { code: 'RON', name: 'Romanian Leu' },
  { code: 'TRY', name: 'Turkish Lira' },
  { code: 'AED', name: 'UAE Dirham' },
  { code: 'SAR', name: 'Saudi Riyal' },
  { code: 'QAR', name: 'Qatari Riyal' },
  { code: 'KWD', name: 'Kuwaiti Dinar' },
  { code: 'BHD', name: 'Bahraini Dinar' },
  { code: 'OMR', name: 'Omani Rial' },
  { code: 'ILS', name: 'Israeli Shekel' },
  { code: 'EGP', name: 'Egyptian Pound' },
  { code: 'MAD', name: 'Moroccan Dirham' },
  { code: 'NGN', name: 'Nigerian Naira' },
  { code: 'GHS', name: 'Ghanaian Cedi' },
  { code: 'KES', name: 'Kenyan Shilling' },
  { code: 'UGX', name: 'Ugandan Shilling' },
  { code: 'TZS', name: 'Tanzanian Shilling' },
  { code: 'RWF', name: 'Rwandan Franc' },
  { code: 'ZMW', name: 'Zambian Kwacha' },
  { code: 'ZAR', name: 'South African Rand' },
  { code: 'XOF', name: 'West African CFA Franc' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'PKR', name: 'Pakistani Rupee' },
  { code: 'BDT', name: 'Bangladeshi Taka' },
  { code: 'LKR', name: 'Sri Lankan Rupee' },
  { code: 'NPR', name: 'Nepalese Rupee' },
  { code: 'PHP', name: 'Philippine Peso' },
  { code: 'IDR', name: 'Indonesian Rupiah' },
  { code: 'MYR', name: 'Malaysian Ringgit' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'THB', name: 'Thai Baht' },
  { code: 'VND', name: 'Vietnamese Dong' },
  { code: 'HKD', name: 'Hong Kong Dollar' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'KRW', name: 'South Korean Won' },
  { code: 'MXN', name: 'Mexican Peso' },
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'ARS', name: 'Argentine Peso' },
  { code: 'CLP', name: 'Chilean Peso' },
  { code: 'COP', name: 'Colombian Peso' },
  { code: 'PEN', name: 'Peruvian Sol' },
  { code: 'DOP', name: 'Dominican Peso' },
  { code: 'JMD', name: 'Jamaican Dollar' },
  { code: 'TTD', name: 'Trinidad & Tobago Dollar' },
  { code: 'BBD', name: 'Barbadian Dollar' },
  { code: 'BSD', name: 'Bahamian Dollar' },
];

/** Number-format locales. They control separators and symbol placement only; the app text stays English. */
export const LOCALES: { code: string; name: string }[] = [
  { code: 'en-US', name: 'English (United States)  1,234.56' },
  { code: 'en-CA', name: 'English (Canada)  1,234.56' },
  { code: 'en-GB', name: 'English (United Kingdom)  1,234.56' },
  { code: 'en-IE', name: 'English (Ireland)  1,234.56' },
  { code: 'en-AU', name: 'English (Australia)  1,234.56' },
  { code: 'en-NZ', name: 'English (New Zealand)  1,234.56' },
  { code: 'en-ZA', name: 'English (South Africa)  1 234,56' },
  { code: 'en-NG', name: 'English (Nigeria)  1,234.56' },
  { code: 'en-GH', name: 'English (Ghana)  1,234.56' },
  { code: 'en-KE', name: 'English (Kenya)  1,234.56' },
  { code: 'en-UG', name: 'English (Uganda)  1,234.56' },
  { code: 'en-TZ', name: 'English (Tanzania)  1,234.56' },
  { code: 'en-IN', name: 'English (India)  1,23,456.78' },
  { code: 'en-PK', name: 'English (Pakistan)  1,234.56' },
  { code: 'en-SG', name: 'English (Singapore)  1,234.56' },
  { code: 'en-HK', name: 'English (Hong Kong)  1,234.56' },
  { code: 'en-PH', name: 'English (Philippines)  1,234.56' },
  { code: 'en-MY', name: 'English (Malaysia)  1,234.56' },
  { code: 'en-AE', name: 'English (UAE)  1,234.56' },
  { code: 'en-JM', name: 'English (Jamaica)  1,234.56' },
  { code: 'fr-CA', name: 'Français (Canada)  1 234,56' },
  { code: 'fr-FR', name: 'Français (France)  1 234,56' },
  { code: 'de-DE', name: 'Deutsch (Deutschland)  1.234,56' },
  { code: 'es-ES', name: 'Español (España)  1.234,56' },
  { code: 'es-MX', name: 'Español (México)  1,234.56' },
  { code: 'es-AR', name: 'Español (Argentina)  1.234,56' },
  { code: 'es-CO', name: 'Español (Colombia)  1.234,56' },
  { code: 'es-CL', name: 'Español (Chile)  1.234,56' },
  { code: 'pt-BR', name: 'Português (Brasil)  1.234,56' },
  { code: 'pt-PT', name: 'Português (Portugal)  1 234,56' },
  { code: 'it-IT', name: 'Italiano (Italia)  1.234,56' },
  { code: 'nl-NL', name: 'Nederlands (Nederland)  1.234,56' },
];

export interface CountryPreset {
  id: string;
  label: string;
  currency: string;
  locale: string;
  areaUnit: AreaUnit;
  rentPeriod: RentPeriod;
}

export const COUNTRY_PRESETS: CountryPreset[] = [
  { id: 'us', label: 'United States', currency: 'USD', locale: 'en-US', areaUnit: 'sqft', rentPeriod: 'month' },
  { id: 'ca', label: 'Canada', currency: 'CAD', locale: 'en-CA', areaUnit: 'sqft', rentPeriod: 'month' },
  { id: 'gb', label: 'United Kingdom', currency: 'GBP', locale: 'en-GB', areaUnit: 'sqft', rentPeriod: 'month' },
  { id: 'ie', label: 'Ireland', currency: 'EUR', locale: 'en-IE', areaUnit: 'sqm', rentPeriod: 'month' },
  { id: 'au', label: 'Australia', currency: 'AUD', locale: 'en-AU', areaUnit: 'sqm', rentPeriod: 'week' },
  { id: 'nz', label: 'New Zealand', currency: 'NZD', locale: 'en-NZ', areaUnit: 'sqm', rentPeriod: 'week' },
  { id: 'de', label: 'Germany', currency: 'EUR', locale: 'de-DE', areaUnit: 'sqm', rentPeriod: 'month' },
  { id: 'fr', label: 'France', currency: 'EUR', locale: 'fr-FR', areaUnit: 'sqm', rentPeriod: 'month' },
  { id: 'es', label: 'Spain', currency: 'EUR', locale: 'es-ES', areaUnit: 'sqm', rentPeriod: 'month' },
  { id: 'ae', label: 'United Arab Emirates', currency: 'AED', locale: 'en-AE', areaUnit: 'sqft', rentPeriod: 'year' },
  { id: 'za', label: 'South Africa', currency: 'ZAR', locale: 'en-ZA', areaUnit: 'sqm', rentPeriod: 'month' },
  { id: 'ng', label: 'Nigeria', currency: 'NGN', locale: 'en-NG', areaUnit: 'sqm', rentPeriod: 'year' },
  { id: 'gh', label: 'Ghana', currency: 'GHS', locale: 'en-GH', areaUnit: 'sqm', rentPeriod: 'month' },
  { id: 'ke', label: 'Kenya', currency: 'KES', locale: 'en-KE', areaUnit: 'sqm', rentPeriod: 'month' },
  { id: 'in', label: 'India', currency: 'INR', locale: 'en-IN', areaUnit: 'sqft', rentPeriod: 'month' },
  { id: 'pk', label: 'Pakistan', currency: 'PKR', locale: 'en-PK', areaUnit: 'sqft', rentPeriod: 'month' },
  { id: 'ph', label: 'Philippines', currency: 'PHP', locale: 'en-PH', areaUnit: 'sqm', rentPeriod: 'month' },
  { id: 'sg', label: 'Singapore', currency: 'SGD', locale: 'en-SG', areaUnit: 'sqft', rentPeriod: 'month' },
  { id: 'jm', label: 'Jamaica', currency: 'JMD', locale: 'en-JM', areaUnit: 'sqft', rentPeriod: 'month' },
  { id: 'mx', label: 'Mexico', currency: 'MXN', locale: 'es-MX', areaUnit: 'sqm', rentPeriod: 'month' },
  { id: 'br', label: 'Brazil', currency: 'BRL', locale: 'pt-BR', areaUnit: 'sqm', rentPeriod: 'month' },
];
