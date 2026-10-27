# Abiterra: Multi-Agent Real Estate Marketplace

A white-label property marketplace. Agents and owners submit listings, an admin approves them, and visitors browse, search,
view a map and send enquiries without needing an account. Built with **Next.js 15, TypeScript, Prisma, PostgreSQL (Supabase) and NextAuth**.

> **Scope in one line:** listings are entered manually (there is no MLS/IDX or portal feed), and the site text is English.
> See [Known limitations](docs/KNOWN-LIMITATIONS.md) for the full, honest list.

## What it does

- **Three roles:** visitor/buyer, agent or property owner, and admin.
- **Moderation workflow:** new or edited agent listings stay **Pending** until an admin approves or rejects them (with a reason).
- **Admin dashboard:** listings with photo upload, status tabs, enquiries and contact messages, a form to log phone leads, and a **Settings** page.
- **Agent dashboard:** own listings, enquiries with Reply / Call / Mark contacted actions, and a "new" badge.
- **Guest enquiries:** no sign-up wall. The listing agent is notified in the dashboard and by email (if email is configured).
- **Browse and search:** filters, map view, featured listings, sale and (optionally) rental listings.
- **Market settings without code:** currency, number format, size unit, rent period and feature switches in **Admin → Settings**,
  with country presets and a live preview.
- **Blog** from Markdown files, SEO metadata, sitemap and robots.txt.

## Quick start

```bash
npm install
cp .env.example .env          # fill in the database, Supabase and NextAuth values
npx prisma migrate deploy
npm run seed:demo             # optional: 12 sample listings
npm run dev
```

Then create an account at `/signup` and make it an admin:

```bash
npm run admin:promote -- you@example.com
```

Log out and in again, and open **Admin**. Full instructions: [docs/SETUP.md](docs/SETUP.md). Requires **Node.js 20+**.

## Documentation

| Guide | For |
|---|---|
| [Setup guide](docs/SETUP.md) | Installing, configuring and deploying (about 45 minutes) |
| [Admin and agent guide](docs/ADMIN-GUIDE.md) | Running the site day to day |
| [Configuration reference](docs/CONFIGURATION.md) | Every environment variable and setting |
| [Customizing](docs/CUSTOMIZING.md) | Logo, colours, wording, blog, map |
| [Architecture](docs/ARCHITECTURE.md) | How the code is organised (for developers) |
| [Security guide](docs/SECURITY.md) | Secrets, database lock-down, known gaps |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Fixes for the problems most likely to appear |
| [Known limitations](docs/KNOWN-LIMITATIONS.md) | What it does not do and the technical debt |
| [Third-party licences](docs/THIRD-PARTY-LICENSES.md) | Dependency licences |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start locally |
| `npm run build` | Generate the database client, apply migrations, build |
| `npm run seed:demo` | Add generic sample listings (safe to re-run with `-- --reset`) |
| `npm run admin:promote -- email [ROLE]` | Give an account the ADMIN (default) or AGENT role |
| `npm run demo:images` | Regenerate the illustrated sample photos |

## Licence

Not open source. Use is governed by your licence agreement; see [LICENSE.md](LICENSE.md).
