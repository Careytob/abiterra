# Abiterra: Multi-Agent Real Estate Marketplace

A white-label property marketplace built with **Next.js 15, TypeScript, Prisma, PostgreSQL (Supabase) and NextAuth**.
Agents submit listings, an admin approves them, and visitors browse and enquire as guests.

## Features

- **Three roles:** buyer (USER), AGENT (self-service listings) and ADMIN.
- **Moderation workflow:** new or edited agent listings stay `PENDING` until an admin approves or rejects them (with a reason shown to the agent).
- **Admin dashboard (`/admin`):** full listing CRUD with photo upload, status tabs, inquiries and contact messages, and a "log inquiry" form for phone/WhatsApp leads.
- **Agent dashboard (`/agent`):** manage own listings and see enquiries for them.
- **Guest enquiries:** no sign-up wall; signed-in users are pre-filled.
- **Search, filters, map view, blog (Markdown), SEO metadata, sitemap and robots.**
- **Rentals module** behind a feature flag.
- **Fully configurable branding, currency, locale, units and region** via env vars. No code changes needed to white-label.

## Quick start

```bash
npm install
cp .env.example .env        # fill in DATABASE_URL, Supabase and NextAuth values
npx prisma migrate deploy
npm run seed:demo           # optional: 12 generic sample listings
npm run dev
```

Create an account at `/signup`, then promote it:

```bash
npm run admin:promote -- you@example.com            # ADMIN
npm run admin:promote -- agent@example.com AGENT    # AGENT
```

Sign in and open `/admin` (or `/agent`).

### Demo data
`npm run seed:demo` is safe to re-run with `-- --reset`. It only touches listings whose slug starts with `demo-`, and refuses to run against a database that already holds real listings. `-- --accounts` creates demo ADMIN/AGENT logins (needs `DEMO_PASSWORD`). Replace the illustrations in `scripts/seed-assets/` with real photos if you like.

## Configure for your market

Set these in `.env` and rebuild. Full list in `.env.example`.

| Variable | Example | Effect |
|---|---|---|
| `NEXT_PUBLIC_SITE_NAME` | `Harbour Homes` | Brand name everywhere (titles, footer, emails, watermark) |
| `NEXT_PUBLIC_CURRENCY` / `NEXT_PUBLIC_LOCALE` | `KES` / `en-KE` | Price formatting |
| `NEXT_PUBLIC_AREA_UNIT` | `sqm` | Area display and form label |
| `NEXT_PUBLIC_RENT_PERIOD` | `month` | Rent wording |
| `NEXT_PUBLIC_DEFAULT_LAT/LNG` | `-1.2921` / `36.8219` | Map default centre |
| `NEXT_PUBLIC_ENABLE_RENTALS` | `true` | Shows the rentals module |
| `NEXT_PUBLIC_ENABLE_WATERMARK` | `false` | Photo watermark. Off by default: it needs system fonts and crashes on font-less serverless hosts such as Vercel |

Then replace `public/logo.svg` and `public/hero_image.webp`, and review the **privacy policy and terms pages. They are templates, not legal advice.**

## Deploy (Vercel)

1. Import the repo, add the env vars above, and set `NEXTAUTH_URL` / `NEXT_PUBLIC_SITE_URL` to your domain.
2. The build runs `prisma migrate deploy`, so `DATABASE_URL` must be reachable at build time.
3. Create a private Storage bucket named `properties` (the seed script does this automatically).

## Notes

- Listings are entered manually. There is no MLS/IDX or portal data-feed integration.
- Photos are served from a private Supabase bucket via 1-year signed URLs.
- Never commit `.env` or your service-role key.
