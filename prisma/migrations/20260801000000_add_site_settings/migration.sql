-- Adds admin-editable site settings (currency, locale, units, feature switches).
-- Environment variables remain the defaults; rows here override them.

-- CreateTable
CREATE TABLE "site_setting" (
  "key" VARCHAR(100) NOT NULL,
  "value" TEXT NOT NULL,
  "updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "site_setting_pkey" PRIMARY KEY ("key")
);

-- Lock the table down: the app talks to Postgres directly (a role that bypasses RLS), so
-- with RLS on and no policies, Supabase's public REST API cannot read or write settings.
ALTER TABLE "site_setting" ENABLE ROW LEVEL SECURITY;
