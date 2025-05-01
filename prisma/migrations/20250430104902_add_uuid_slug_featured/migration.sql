-- Create new Property table with UUID and slug
CREATE TABLE new_Property (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR NOT NULL,
  price FLOAT NOT NULL,
  type VARCHAR NOT NULL,
  availability BOOLEAN DEFAULT true,
  area FLOAT,
  bathrooms INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL,
  bq INTEGER NOT NULL,
  city VARCHAR NOT NULL,
  state VARCHAR NOT NULL,
  status VARCHAR NOT NULL,
  toilets INTEGER NOT NULL,
  latitude FLOAT,
  longitude FLOAT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  isFeatured BOOLEAN DEFAULT false,
  agentId VARCHAR NOT NULL,
  search_vector TSVECTOR
);

-- Create new Feature table (without createdAt, updatedAt)
CREATE TABLE new_Feature (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  propertyId UUID NOT NULL
);

-- Create new Image table
CREATE TABLE new_Image (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url VARCHAR NOT NULL,
  filePath VARCHAR,
  imageType VARCHAR,
  createdAt TIMESTAMP NOT NULL,
  propertyId UUID NOT NULL,
  isMain BOOLEAN DEFAULT false
);

-- Create new Inquiry table
CREATE TABLE new_Inquiry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  phone VARCHAR NOT NULL,
  status VARCHAR NOT NULL,
  createdAt TIMESTAMP NOT NULL,
  propertyId UUID NOT NULL,
  userId VARCHAR NOT NULL
);

-- Drop old constraints (if they exist)
ALTER TABLE feature DROP CONSTRAINT IF EXISTS feature_propertyId_fkey;
ALTER TABLE image DROP CONSTRAINT IF EXISTS image_propertyId_fkey;
ALTER TABLE inquiry DROP CONSTRAINT IF EXISTS inquiry_propertyId_fkey;

-- Drop old tables (if they exist)
DROP TABLE IF EXISTS inquiry;
DROP TABLE IF EXISTS image;
DROP TABLE IF EXISTS feature;
DROP TABLE IF EXISTS property;

-- Rename new tables
ALTER TABLE new_Property RENAME TO property;
ALTER TABLE new_Feature RENAME TO feature;
ALTER TABLE new_Image RENAME TO image;
ALTER TABLE new_Inquiry RENAME TO inquiry;

-- Recreate foreign keys
ALTER TABLE feature
ADD CONSTRAINT feature_propertyId_fkey
FOREIGN KEY (propertyId) REFERENCES property(id) ON DELETE CASCADE;

ALTER TABLE image
ADD CONSTRAINT image_propertyId_fkey
FOREIGN KEY (propertyId) REFERENCES property(id) ON DELETE CASCADE;

ALTER TABLE inquiry
ADD CONSTRAINT inquiry_propertyId_fkey
FOREIGN KEY (propertyId) REFERENCES property(id) ON DELETE CASCADE;

ALTER TABLE inquiry
ADD CONSTRAINT inquiry_userId_fkey
FOREIGN KEY (userId) REFERENCES users(id);

-- Recreate indexes
CREATE INDEX feature_propertyId_idx ON feature (propertyId);
CREATE INDEX feature_name_idx ON feature (name);
CREATE INDEX image_propertyId_idx ON image (propertyId);
CREATE INDEX image_isMain_idx ON image (isMain);
CREATE INDEX inquiry_propertyId_idx ON inquiry (propertyId);
CREATE INDEX inquiry_userId_idx ON inquiry (userId);
CREATE INDEX inquiry_status_idx ON inquiry (status);
CREATE INDEX property_type_idx ON property (type);
CREATE INDEX property_status_idx ON property (status);
CREATE INDEX property_price_idx ON property (price);
CREATE INDEX property_bedrooms_idx ON property (bedrooms);
CREATE INDEX property_bathrooms_idx ON property (bathrooms);
CREATE INDEX property_city_idx ON property (city);
CREATE INDEX property_state_idx ON property (state);
CREATE INDEX property_availability_idx ON property (availability);
CREATE INDEX property_search_vector_idx ON property USING GIN (search_vector);

-- Add unique constraint to slug
CREATE UNIQUE INDEX property_slug_key ON property (slug);