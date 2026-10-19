-- Adds self-service agent/owner listings with an approval workflow.

-- AlterEnum: a third account tier, between USER and ADMIN, for agents/
-- owners who can list their own properties but not moderate everyone's.
ALTER TYPE "UserRole" ADD VALUE 'AGENT';

-- AlterTable: every existing property was already live, so it defaults to
-- PUBLISHED to preserve current behavior. New agent-submitted properties
-- are created with 'PENDING' explicitly by the application, not by this
-- default.
ALTER TABLE "property" ADD COLUMN "publishstatus" VARCHAR NOT NULL DEFAULT 'PUBLISHED';
ALTER TABLE "property" ADD COLUMN "rejectionreason" TEXT;
ALTER TABLE "property" ADD COLUMN "listedby" VARCHAR;

-- AddForeignKey
ALTER TABLE "property"
  ADD CONSTRAINT "property_listedby_fkey"
  FOREIGN KEY ("listedby") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE NO ACTION;

-- CreateIndex
CREATE INDEX "property_publishstatus_idx" ON "property"("publishstatus");
