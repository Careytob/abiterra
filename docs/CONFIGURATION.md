# Configuration reference

There are two layers:

1. **Admin → Settings** (no code, no redeploy): currency, number format, size unit, rent period, and the
   Rentals / Toilets / BQ switches. Saved values override the environment defaults. **Reset to defaults** returns to them.
2. **Environment variables** (below): secrets, URLs, email, branding and the defaults used until Settings is saved.

`NEXT_PUBLIC_*` variables are compiled into the site at build time. Change one, then redeploy.

## Required

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Supabase Session or Transaction pooler) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key used to store and sign photo URLs. **Keep secret.** |
| `NEXTAUTH_URL` | Public address of the site, **https** in production |
| `NEXTAUTH_SECRET` | Random string that signs login sessions. Generate with `openssl rand -base64 32` |

## Branding (environment only)

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_NAME` | `Abiterra` | Brand name in titles, footer, emails |
| `NEXT_PUBLIC_SITE_TAGLINE` | `Find Your Dream Home` | Home page headline |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | generic | Default meta description |
| `NEXT_PUBLIC_SITE_URL` | localhost / Vercel domain | Canonical links, sitemap, emails |
| `NEXT_PUBLIC_REGION_NAME` | empty | Optional copy such as "Nairobi, Kenya" |
| `NEXT_PUBLIC_COUNTRY_CODE` | empty | Two-letter code used in structured data |
| `NEXT_PUBLIC_CONTACT_EMAIL` / `_PHONE` / `_ADDRESS` | empty | Footer and legal pages (hidden when empty) |
| `NEXT_PUBLIC_SOCIAL_FACEBOOK` / `_INSTAGRAM` / `_TWITTER` | empty | Footer links (hidden when empty) |
| `NEXT_PUBLIC_LEGAL_ENTITY`, `NEXT_PUBLIC_GOVERNING_LAW` | site name / generic | Used by the legal page templates |
| `NEXT_PUBLIC_DEFAULT_LAT`, `NEXT_PUBLIC_DEFAULT_LNG` | New York | Map centre when a listing has no coordinates |
| `CANONICAL_HOST` | empty | If set (e.g. `example.com`), `www.` redirects to it |

Also replace `public/logo.svg` and `public/hero_image.webp` (see [CUSTOMIZING.md](CUSTOMIZING.md)).

## Defaults for Settings (overridable in the admin area)

| Variable | Default | Values |
|---|---|---|
| `NEXT_PUBLIC_CURRENCY` | `USD` | ISO 4217 code |
| `NEXT_PUBLIC_LOCALE` | `en-US` | Number format, e.g. `en-GB`, `de-DE` |
| `NEXT_PUBLIC_AREA_UNIT` | `sqft` | `sqft` or `sqm` |
| `NEXT_PUBLIC_RENT_PERIOD` | `month` | `week`, `month`, `year` |
| `NEXT_PUBLIC_ENABLE_RENTALS` | `false` | `true` shows rentals |
| `NEXT_PUBLIC_SHOW_TOILETS`, `NEXT_PUBLIC_SHOW_BQ` | `false` | Extra fields common in some regions |

Changing the size unit or rent period changes labels only. Existing numbers are not converted.

## Email (needed for password reset and agent enquiry emails)

`EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT` (e.g. 587), `EMAIL_SERVER_SECURE` (`true` for port 465), `EMAIL_SERVER_USER`,
`EMAIL_SERVER_PASSWORD`, `EMAIL_FROM`. Without these, password-reset emails cannot be sent. Enquiries are still
saved and shown in the dashboards.

## Optional

`SUPABASE_URL`, `SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are read only by two old maintenance scripts
(`scripts/list-supabase-images.ts`, `scripts/uploadImages.ts`); the running site does not need them.

| Variable | Purpose |
|---|---|
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Powers the "Sign in with Google" button. The login and sign-up pages always show that button, so if you do not set these, remove the button from `app/login/page.tsx` and `app/signup/page.tsx` or it will fail when clicked |
| `NEXT_PUBLIC_SENTRY_DSN` | Error reporting. Disabled when empty |
| `NEXT_PUBLIC_ENABLE_WATERMARK`, `NEXT_PUBLIC_WATERMARK_TEXT` | Photo watermark. **Off by default**, see [KNOWN-LIMITATIONS.md](KNOWN-LIMITATIONS.md) |
| `NEXT_PUBLIC_API_BASE_URL` | Only if the site must call its own API at a different address |

## Demo data

`npm run seed:demo` accepts: `--reset` (delete and recreate demo data), `--accounts` (also create demo ADMIN and AGENT logins;
needs `DEMO_PASSWORD` of 10+ characters, never leave these on a public site), `--force` (seed even if real listings exist).
Optional variables: `SEED_CITY`, `SEED_REGION`, `SEED_PRICE_MULTIPLIER` (e.g. `0.01` for a low-value currency),
`DEMO_ADMIN_EMAIL`, `DEMO_AGENT_EMAIL`.
