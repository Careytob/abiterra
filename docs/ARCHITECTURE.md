# Architecture

A guide for developers taking over the code.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) with React 18 and TypeScript |
| Database | PostgreSQL (designed for Supabase) through Prisma 6 |
| Auth | NextAuth v4: email and password, plus Google. JWT sessions, the role is stored in the token |
| Photos | Supabase Storage, one **private** bucket named `properties`, served through signed URLs |
| Styling | Tailwind CSS 3, Radix UI Themes, a few shadcn-style components in `components/ui` |
| Maps | Leaflet via `react-leaflet`, OpenStreetMap tiles |
| Email | Nodemailer over SMTP |
| Errors | Sentry (optional) |
| Hosting | Built for Vercel; any Node 20+ host works |

## Folder map

```
app/                     Pages (App Router). Each folder is a URL
  admin/  agent/         Dashboards (properties, inquiries, messages, settings)
  buy/  rent/            Public listing pages and detail pages
  blog/                  Markdown blog, read from content/blog
  api/                   JSON endpoints (see below)
  components/            Shared UI
lib/                     Server and shared logic
  site-config.ts         Defaults from env, plus the runtime settings layer
  site-settings.ts       Reads and writes the admin Settings (database + cache)
  auth.ts  prisma.ts  email.ts  blogHelpers.ts  watermark.ts
prisma/                  schema.prisma and migrations
scripts/                 seed-demo, promote-admin and maintenance scripts
content/blog/            Blog posts (Markdown with front matter)
middleware.ts            Route protection
```

## Data model (prisma/schema.prisma)

- **User** (`UserRole`: USER, AGENT, ADMIN), plus NextAuth's `Account`, `Session`, `VerificationToken`, and `PasswordReset`.
- **property**: `type` (SALE or RENT), `publishstatus` (PENDING, PUBLISHED or REJECTED, stored as text), `rejectionreason`,
  `availability`, `isfeatured`, coordinates, `listedby` (the owning agent's User id) and `agentid` (a free-text agent label).
  Both agent fields exist for historical reasons; ownership checks use `listedby`.
- **image** (stored `filepath` in the bucket, `ismain`) and **feature** (a name per amenity), both belonging to a property.
- **inquiry**: an enquiry about a property (`inquiry_status`: PENDING, REVIEWED, CONTACTED).
- **contact**: a message from the Contact page.
- **site_setting**: key/value rows that override the environment defaults (see Settings below).

## Access control

`middleware.ts` guards `/admin` and `/api/admin` (ADMIN only) and `/agent` and `/api/agent` (AGENT or ADMIN). Unauthenticated
API calls get 401, wrong role gets 403, pages redirect to `/login` or `/`. The API routes and dashboard layouts check
the session again, so protection does not rely on middleware alone. Agents can only change their own listings and enquiries.

## Settings: how runtime configuration works

Environment variables are read once in `lib/site-config.ts` and are the defaults. The admin Settings page writes
overrides to the `site_setting` table. At runtime:

1. Server code calls `await loadSiteConfig()` (from `lib/site-settings.ts`). It reads the table through a cache tagged
   `site-settings` and updates the in-memory `siteConfig`.
2. The root layout renders `SiteSettingsHydrator` first, which applies the same values to the browser copy, so
   client components format prices correctly on first render.
3. Saving settings invalidates the cache tag and revalidates the site layout.

**Rule for new code:** any *server* component, `generateMetadata`, or route that formats prices or reads the rentals
flag must call `loadSiteConfig()` first. Client components just call `formatPrice()` and friends.
If the table or database is unavailable, the environment defaults are used.

## Request and caching notes

- Home page is statically generated and revalidated every 5 minutes (`export const revalidate = 300`).
- `/buy` is a server component that calls its own `/api/properties`, building the address from the request host.
- Detail pages are rendered per request. Photo URLs are signed on demand.
- `lib/prisma.ts` adds `pgbouncer=true` to Supabase pooler connection strings, which prevents "prepared statement already exists".
- `vercel.json` sets a daily cron that calls `/api/keep-alive` so a free-tier database does not pause.

## API overview

Public: `/api/properties` (list), `/api/properties/[slug]`, `/api/inquiry`, `/api/contact-form`, `/api/signup`, `/api/auth/*`,
image helpers (`/api/supabase-image`, `/api/image-proxy`, `/api/images`, `/api/placeholder`, `/api/blog-images`), `/api/check`, `/api/keep-alive`, `/api/user`.
Agent: `/api/agent/properties`, `/api/agent/inquiries`, `/api/agent/upload-image`.
Admin: `/api/admin/properties` (and `[id]`, `[id]/moderate`), `/api/admin/inquiries`, `/api/admin/messages`, `/api/admin/upload-image`, `/api/admin/settings`.

## Scripts

`npm run dev` · `npm run build` (generate client, apply migrations, build) · `npm run seed:demo` · `npm run admin:promote` ·
`npm run demo:images` (regenerates the illustrated sample photos).
