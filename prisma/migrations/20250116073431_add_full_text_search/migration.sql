-- Create the necessary extensions
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Create the custom text search configuration
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_ts_config WHERE cfgname = 'property_search'
    ) THEN
        CREATE TEXT SEARCH CONFIGURATION property_search (COPY = english);
        ALTER TEXT SEARCH CONFIGURATION property_search
            ALTER MAPPING FOR hword, hword_part, word WITH unaccent, english_stem;
    END IF;
END
$$;

-- Add the search vector column if it doesn't exist
ALTER TABLE "property" ADD COLUMN IF NOT EXISTS "search_vector" tsvector;

-- Create the GIN index for the search vector
CREATE INDEX IF NOT EXISTS property_search_idx ON "property" USING GIN (search_vector);

-- Create the function to generate the search vector
CREATE OR REPLACE FUNCTION property_search_vector(
    title TEXT,
    description TEXT,
    location TEXT,
    city TEXT,
    state TEXT,
    features TEXT
) RETURNS tsvector AS $$
BEGIN
    RETURN (
        setweight(to_tsvector('property_search', COALESCE(title, '')), 'A') ||
        setweight(to_tsvector('property_search', COALESCE(description, '')), 'B') ||
        setweight(to_tsvector('property_search', COALESCE(location, '')), 'B') ||
        setweight(to_tsvector('property_search', COALESCE(city, '')), 'C') ||
        setweight(to_tsvector('property_search', COALESCE(state, '')), 'C') ||
        setweight(to_tsvector('property_search', COALESCE(features, '')), 'D')
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create the trigger function
CREATE OR REPLACE FUNCTION update_property_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := property_search_vector(
        NEW.title,
        NEW.description,
        NEW.location,
        NEW.city,
        NEW.state,
        (
            SELECT string_agg(name, ' ')
            FROM feature
            WHERE "propertyId" = NEW.id


        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS property_search_vector_update ON "property";
CREATE TRIGGER property_search_vector_update
    BEFORE INSERT OR UPDATE ON "property"
    FOR EACH ROW
    EXECUTE FUNCTION update_property_search_vector();

-- Update existing records
UPDATE "property" SET search_vector = property_search_vector(
    title,
    description,
    location,
    city,
    state,
    (
        SELECT string_agg(name, ' ')
        FROM feature
        WHERE "propertyId" = property.id

    )
);
