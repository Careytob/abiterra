# Troubleshooting

Each entry lists the symptom, the cause, and the fix. These are the problems most likely to appear on a first deployment.

## "prepared statement ... already exists" (error code 42P05)
**Cause:** Supabase's Transaction pooler (port 6543) reuses connections in a way Prisma's prepared statements do not tolerate.
**Fix:** The app adds `pgbouncer=true` automatically to Supabase pooler addresses. If you still see it, add `?pgbouncer=true&connection_limit=1`
to `DATABASE_URL` yourself, or use the Session pooler (port 5432). Command-line scripts that make their own connection
(for example `admin:promote`) need the same option in your local `.env`.

## Logged in, but `/admin` or `/agent` sends me to the login page
**Cause:** `NEXTAUTH_URL` is wrong. It must be your real address and start with `https://` in production.
**Fix:** Correct `NEXTAUTH_URL` (and `NEXT_PUBLIC_SITE_URL`), redeploy, then log out and in again. Also check that `NEXTAUTH_SECRET` is set.

## I promoted my account to admin but still see no Admin link
**Cause:** Your role is stored in your login session.
**Fix:** Log out and log in again.

## Home page or `/buy` is empty
1. The database may have no published listings. Run `npm run seed:demo`, or add and approve a listing.
2. Your local `.env` may point at a different Supabase project than your live site. Compare the project reference in `DATABASE_URL`.
3. The home page is cached for up to 5 minutes. Wait, or redeploy.
4. Look in your host's logs for lines starting `[HomePage]` or `[PropertiesAPI]`.

## Photos do not appear
**Cause:** The `properties` storage bucket is missing, or `SUPABASE_SERVICE_ROLE_KEY` is wrong or was rotated and not updated on the host.
**Fix:** Create a private bucket named `properties` (the seed script does this), and update the key in your host's environment variables, then redeploy.

## Property pages crash or the server restarts with "SIGSEGV" and a Fontconfig message
**Cause:** The optional photo watermark draws text with `sharp`, which needs system fonts that serverless hosts such as Vercel do not have.
**Fix:** Leave `NEXT_PUBLIC_ENABLE_WATERMARK` unset or `false` (the default).

## Price or unit changes do not show
- Settings saved in **Admin → Settings** apply immediately; refresh the page. If you changed an environment variable instead, redeploy: `NEXT_PUBLIC_*` values are compiled in.
- Saved Settings override environment variables. Use **Reset to defaults** to go back to them.

## Password-reset emails never arrive
Fill in the `EMAIL_SERVER_*` and `EMAIL_FROM` variables. Check spam. Use an SMTP provider that allows sending from your `EMAIL_FROM` address.

## "Could not save settings" on the Settings page
The `site_setting` table is missing. Run `npx prisma migrate deploy` (a normal Vercel build does this for you).

## `npm install` complains about peer dependencies
The repository includes an `.npmrc` with `legacy-peer-deps=true` for one harmless optional peer (see [KNOWN-LIMITATIONS.md](KNOWN-LIMITATIONS.md)). Make sure that file was copied with the code.

## Build fails on Google Fonts with no internet access
The build downloads the Roboto font from Google Fonts. Build on a machine with internet access, or switch to a locally hosted font in `app/layout.tsx`.
