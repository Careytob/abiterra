# Security guide

## Secrets: what must never be public

| Secret | Where it lives | Notes |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Server environment only | A master key that bypasses all database rules. **Never** commit it, paste it in chat or screenshots, or expose it to the browser |
| `DATABASE_URL` | Server environment only | Contains the database password |
| `NEXTAUTH_SECRET` | Server environment only | Signs login sessions. Changing it logs everyone out |
| `EMAIL_SERVER_PASSWORD`, `GOOGLE_CLIENT_SECRET` | Server environment only | |

`.env` is ignored by Git. Keep real values out of `.env.example`, which is committed. If a secret is ever exposed, **rotate it immediately**
in the provider's dashboard and update your host's environment variables; deleting it from the code does not help because it remains in Git history.

## Lock down your database tables (recommended before launch)

Supabase exposes tables in the `public` schema through its REST API. On a default setup, a table with Row Level Security (RLS) switched off
can be read or changed with the public `anon` key, which is visible to anyone who opens the site's network tab. **This application never uses
the public key to read tables**: it connects directly to Postgres (Prisma) and uses the service-role key on the server, and both bypass RLS.
So you can safely switch RLS on for every table. With no policies defined, the public key then has no access at all.

Run this once in **Supabase → SQL Editor**:

```sql
DO $$ DECLARE r record; BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
  END LOOP;
END $$;
```

Then confirm the site still works (browse, log in, add a listing, send an enquiry). Two cautions:

- This is safe when `DATABASE_URL` uses the default `postgres` user (the usual Supabase setup). If you created a custom database role for Prisma,
  give it the `BYPASSRLS` attribute first.
- Run it again after adding a table in a future migration (the `site_setting` table already has RLS enabled by its migration).

Supabase's **Security Advisor** (Database → Advisors) will report any table that still has RLS off.

## Photos
Photos are stored in a **private** bucket named `properties` and shown through short-lived signed links. Keep the bucket private.

## Accounts and access
- Passwords are stored as bcrypt hashes (`bcryptjs`). Sessions are signed JWTs.
- `/admin` and `/api/admin` require the ADMIN role; `/agent` and `/api/agent` require AGENT or ADMIN. Routes check the session again themselves.
- Use a strong, unique password for admin accounts and do not leave demo accounts (`seed:demo -- --accounts`) on a live site.

## Known gaps to address for a high-traffic or high-risk deployment
- **No rate limiting or CAPTCHA** on public forms and endpoints (sign-up, enquiries, contact form, password reset). Add a rate limiter
  (for example a Vercel/Cloudflare rule or an Upstash-based limiter) and a CAPTCHA before opening to the public at scale.
- Uploaded photos are checked by the upload routes' own rules only. Review them against your needs.
- Run `npm audit` regularly. See [KNOWN-LIMITATIONS.md](KNOWN-LIMITATIONS.md) for the findings that remain.

## Reporting a vulnerability
The licensee is responsible for the security of their own deployment. If you find a vulnerability in the original code and wish to tell the
original author, use the contact in your licence agreement.
