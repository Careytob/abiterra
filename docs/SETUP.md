# Setup guide

This takes you from a fresh download to a working marketplace on your own computer, then on the internet.
Allow about 45 minutes the first time. You do not need to be an expert, but you should be comfortable
copying commands into a terminal.

## 1. What you need

| Item | Why | Cost |
|---|---|---|
| **Node.js 20 or newer** and npm | Runs the app (check with `node --version`) | Free |
| **Git** | Gets and updates the code | Free |
| **Supabase account** | Hosts the PostgreSQL database and the private photo storage | Free tier is enough to start |
| **Vercel account** (or another Node host) | Puts the site on the internet | Free tier is enough to start |
| *Optional:* an email (SMTP) account | Sends password-reset and new-enquiry emails | Many have free tiers |
| *Optional:* Google Cloud OAuth credentials | Adds "Sign in with Google" | Free |

## 2. Create the database (Supabase)

1. Create a new Supabase project. Save the database password somewhere safe.
2. Open **Project Settings → Database** and copy a **connection string**. Use the **Session pooler** string
   (port 5432). The Transaction pooler (port 6543) also works; the app adds the extra option it needs automatically.
   Do **not** use the "Direct connection" string on Vercel: it is IPv6-only and fails there.
3. Open **Project Settings → API** and copy the **Project URL** and the **service_role** key.
   The service_role key is a master key. Never put it in client code, screenshots or a public repository.
   (The public `anon` key is not used by the application itself.)

## 3. Get the code running locally

```bash
npm install
cp .env.example .env
```

Open `.env` and fill in at least these (full list in [CONFIGURATION.md](CONFIGURATION.md)):

```
DATABASE_URL="<your Supabase connection string>"
NEXT_PUBLIC_SUPABASE_URL="https://<ref>.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="<service_role key>"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<run: openssl rand -base64 32>"
```

Then create the tables and start the app:

```bash
npx prisma migrate deploy
npm run dev
```

Open <http://localhost:3000>.

## 3b. Add sample listings (optional but recommended)

```bash
npm run seed:demo
```

This adds 12 generic listings (one waiting for approval), sample enquiries and messages, and creates the private
`properties` photo bucket. It refuses to run if the database already has real listings, and `-- --reset` only
removes data it created. See [CONFIGURATION.md](CONFIGURATION.md#demo-data) for options.

## 4. Create your admin account

There is no default admin; you promote an account you create.

1. Sign up at `/signup` using the email you want to use as admin.
2. In your terminal: `npm run admin:promote -- you@example.com`
3. Log out and back in (your role is stored in your login session).
4. An **Admin** link now appears in the top menu. Open **Admin → Settings** to choose your currency and units.

## 5. Put it on the internet (Vercel)

1. Push your copy of the code to a **private** GitHub repository.
2. In Vercel choose **Add New → Project** and import it.
3. Add every environment variable from your `.env` under **Settings → Environment Variables** (Production).
   Two values change for production:
   - `NEXTAUTH_URL` = your live address, **starting with `https://`**
   - `NEXT_PUBLIC_SITE_URL` = the same live address
4. Deploy. The default build command (`npm run build`) generates the database client, applies any new
   migrations, then builds the site. No extra configuration is needed.
5. Add a custom domain under **Settings → Domains** if you have one, then update the two values above to match.

Values starting with `NEXT_PUBLIC_` are baked in at build time: after changing one, redeploy.

## 6. Check it works

- [ ] Home page shows listings (or the empty state if you skipped the seed).
- [ ] `/buy` lists properties and a property page opens.
- [ ] You can sign up, then promote yourself and see **Admin** in the menu.
- [ ] Admin → Properties → **Add property** with photos works and the photos display.
- [ ] Send a test enquiry from a property page and see it in Admin → Inquiries.

Something not working? See [TROUBLESHOOTING.md](TROUBLESHOOTING.md).
