# Known limitations and technical debt

An honest list, so there are no surprises after you buy.

## Product scope
- **Manual listing entry only.** There is no integration with MLS/IDX, RESO Web API, portal feeds (Rightmove, Zoopla, realestate.com.au, Domain)
  or CRM exports. Those need licences, credentials and a participating broker, so they are not included.
  The data model is simple enough to add an import job; imported listings would need their own attribution fields.
- **English only.** The currency and number format (Settings) change how numbers look, not the language of the site.
- **Branding is set by environment variables**, not in the admin area (name, tagline, contact, social links, legal entity). Market settings
  (currency, number format, units, rent period, rentals/toilets/BQ) *are* editable in Admin → Settings.
- **Legal pages are templates**, not legal advice. Have a lawyer review the privacy policy and terms for your jurisdiction.
- **Rentals are listings only.** No bookings, applications, deposits or payments.
- **No payments of any kind.** Listings are advertisements; enquiries are messages.
- **Notifications:** agents see a badge in the dashboard and receive an email if SMTP is configured. There are no real-time or push notifications.
- **Photos:** one private Supabase bucket. Switching storage provider means changing the upload, signing and image routes.
- **Watermark** is off by default because the text rendering library crashes on font-less serverless hosts such as Vercel (see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)).
- **Map tiles** come from OpenStreetMap's public server, which is not meant for heavy commercial traffic. See [CUSTOMIZING.md](CUSTOMIZING.md#map).
- **Sample photos** are generated illustrations. The home page photo is a stock image: confirm you may use it or replace it.

## Engineering
- **Next.js 15.5 (App Router).** Upgrading to Next 16 is a breaking change and has not been attempted. About twelve route and page files still read
  `params` synchronously (the Next 15 style). That works on 15 but must be converted to `await params` for 16.
- **Type and lint errors do not fail the build** (`typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` are `true` in `next.config.ts`).
  Run `npx prisma generate` then `npx tsc --noEmit` and fix what it reports before turning them off.
- **No automated tests.** Jest is configured but no tests exist. Manual test checklist: [SETUP.md](SETUP.md#6-check-it-works).
- **Dependency advisories remain.** After the security update there were 26 `npm audit` findings in production dependencies:
  0 critical, 2 high and 24 moderate. The two high ones are `postcss` (bundled inside Next.js and only used at build time;
  fixed by Next 16) and `zod` 3 (fixed by moving to zod 4, a breaking change; it is used in two files to validate form input).
  Run `npm audit` for the current picture and update when you can test the result.
- **`.npmrc` sets `legacy-peer-deps=true`.** `next-auth` lists `nodemailer` as an optional peer at an older major version (it is only needed for
  NextAuth's own email-login provider, which this app does not use). Remove the file and update if you adopt a NextAuth version that accepts the
  current nodemailer.
- **Two ownership fields on listings** (`listedby` is the real link to the agent; `agentid` is a legacy text label).
- **Node 20 or newer** is required (nodemailer 10 needs it).
- Some older maintenance scripts remain in `scripts/` (slug cleanup, image inspection). They are not needed to run the site.

## Licensing notes for dependencies
See [THIRD-PARTY-LICENSES.md](THIRD-PARTY-LICENSES.md). Notably, `react-leaflet` uses the Hippocratic License 2.1, which is not a conventional open-source licence.
