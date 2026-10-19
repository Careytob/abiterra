# What changed, and how to apply it

Base commit: `7ef4955` ("convert image format to webp", 2025-05-22) — the tip of `main` on the repo as reviewed.

## How to apply

```bash
cd abiterra          # your existing local clone
git checkout main
git pull              # make sure you're on 7ef4955 with no local changes
git apply abiterra-admin-panel-and-cleanup.patch
npm install
npx prisma generate
npx prisma migrate deploy   # or `prisma migrate dev` locally against a dev DB
git add -A
git commit -m "Add admin/agent dashboards, guest inquiries, moderation workflow, repo cleanup"
git push
```

Try it out:

```bash
npm run admin:promote -- you@example.com          # ADMIN
npm run admin:promote -- someone@example.com AGENT # AGENT
npm run dev
# sign in as the admin account → /admin
# sign in as the agent account → /agent
```

If `git apply` complains about the repo being dirty or on the wrong commit, use `git apply --3way` or apply to a fresh branch off `7ef4955`.

## What's in this patch

### 1. Admin dashboard
`/admin/properties` — full CRUD across every listing (not just admin-created ones), photo upload straight to Supabase Storage, and a moderation queue (see below). `/admin/inquiries` and `/admin/messages` cover the two things that previously required opening the database directly: property-page inquiries and general Contact-page submissions — both with status tracking and delete; `/admin/inquiries` also has a "log inquiry" form for leads that came in by phone or WhatsApp.

### 2. Agent self-service listings + moderation (the "list it like Zillow" feature)
Three account tiers now exist: `USER` (buyer), `AGENT` (lists their own properties), `ADMIN` (manages everything). Signup at `/signup` now asks which one you're creating.

- `/agent` — an agent's own dashboard: create, edit, delete their own listings, see each one's status (Pending/Published/Rejected) and any rejection reason.
- New submissions are created as `PENDING` and **do not appear on the public site** until approved — every public property query (`/buy`, `/rent`, the homepage, `/api/properties`, property detail pages) now filters to `publishstatus = 'PUBLISHED'`.
- Editing an already-published listing puts it back into `PENDING` — an agent can't slip unreviewed changes onto a live listing without another review pass.
- `/admin/properties` has status tabs (All/Pending/Published/Rejected) and Approve/Reject buttons on pending items; rejecting prompts for a reason, which the agent sees on their own dashboard.
- `/agent/inquiries` shows only inquiries for that agent's own properties (via the new `property.listedby` column, a real foreign key to the submitting account — not the old free-text `agentid` field, which is left alone for backward compatibility as a display string).
- Properties created through `/admin` (not `/agent`) still publish immediately — an admin's own additions aren't self-moderated.

### 3. Guest inquiries — no more forced signup to contact a lister
The inquiry API used to hard-require a signed-in session; the property-page contact dialog showed a login/signup wall instead of a form. Now:
- `inquiry` table: added `name` and `email` columns, made `userid` optional (migration backfills existing rows from the linked account first).
- Signed-in users still get their name/email pulled from their account (can't be spoofed); guests submit name + email + phone + message directly.
- The general site-wide Contact page (`/contact`) was already guest-accessible — no changes needed there.

### 4. Rent module turned into a feature flag
Gated behind `NEXT_PUBLIC_ENABLE_RENTALS=true` instead of being silently deleted from the nav array.

### 5. Bug fix found along the way
`/rent/[propertyId]` ran `parseInt()` on the property's UUID before querying — since `property.id` is a UUID string, not a number, this broke the page for any real property. Fixed while adding the publish-status filter to the same query.

### 6. Repo hygiene
- `prisma/generated/` (22MB, incl. a 20MB Windows binary) removed from git tracking and gitignored.
- Added `.env.example` documenting every env var the app actually reads.
- Rewrote `README.md`: what the app does, the stack, setup steps, Supabase bucket requirement, admin/agent bootstrapping, and an honest "known gaps" section — including a newly-found bug where `app/sitemap.xml` silently returns no property URLs (queries a table/column set that doesn't match the real schema).

## Deliberately not touched

- The one-off scripts in `scripts/` with your real listing data — flagged as worth pruning before handoff, left alone since it's your content.
- The two overlapping `components/ui` / `app/components/ui` directories — flagged, not consolidated.
- The hardcoded Sentry DSN in the three `sentry.*.config.ts` files — flagged in the README, not changed.
- The broken `app/sitemap.xml` property query — flagged in the README, not fixed (separate concern from this round of work).
