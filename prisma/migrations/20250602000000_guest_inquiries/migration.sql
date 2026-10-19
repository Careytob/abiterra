-- Allow property inquiries to be submitted without an account: capture the
-- sender's name/email directly on the row, and make userid optional.

-- AlterTable
ALTER TABLE "inquiry" ADD COLUMN "name" VARCHAR;
ALTER TABLE "inquiry" ADD COLUMN "email" VARCHAR;
ALTER TABLE "inquiry" ALTER COLUMN "userid" DROP NOT NULL;

-- Backfill existing rows from the linked account before enforcing NOT NULL,
-- so historical data (all of which does have a userid today) stays complete.
UPDATE "inquiry" i
SET "name" = u."name", "email" = u."email"
FROM "users" u
WHERE i."userid" = u."id" AND i."name" IS NULL;

-- Anything that still has no name/email (shouldn't happen given the
-- backfill above, but guards against orphaned rows) falls back to a
-- placeholder rather than blocking the migration.
UPDATE "inquiry" SET "name" = 'Unknown' WHERE "name" IS NULL;
UPDATE "inquiry" SET "email" = 'unknown@abiterra.local' WHERE "email" IS NULL;

ALTER TABLE "inquiry" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "inquiry" ALTER COLUMN "email" SET NOT NULL;
