-- AlterTable
ALTER TABLE "image" ADD COLUMN     "isMain" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "contact_email_idx" ON "contact"("email");

-- CreateIndex
CREATE INDEX "contact_status_idx" ON "contact"("status");

-- CreateIndex
CREATE INDEX "feature_name_idx" ON "feature"("name");

-- CreateIndex
CREATE INDEX "image_isMain_idx" ON "image"("isMain");

-- CreateIndex
CREATE INDEX "inquiry_status_idx" ON "inquiry"("status");

-- CreateIndex
CREATE INDEX "property_type_idx" ON "property"("type");

-- CreateIndex
CREATE INDEX "property_status_idx" ON "property"("status");

-- CreateIndex
CREATE INDEX "property_price_idx" ON "property"("price");

-- CreateIndex
CREATE INDEX "property_bedrooms_idx" ON "property"("bedrooms");

-- CreateIndex
CREATE INDEX "property_bathrooms_idx" ON "property"("bathrooms");

-- CreateIndex
CREATE INDEX "property_city_idx" ON "property"("city");

-- CreateIndex
CREATE INDEX "property_state_idx" ON "property"("state");

-- CreateIndex
CREATE INDEX "property_availability_idx" ON "property"("availability");

-- RenameIndex
ALTER INDEX "property_search_idx" RENAME TO "property_search_vector_idx";
