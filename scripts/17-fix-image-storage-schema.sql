-- Fix the featured_image column to handle longer URLs (base64 images)
ALTER TABLE blog_posts ALTER COLUMN featured_image TYPE TEXT;

-- Also update other URL fields that might be too short
ALTER TABLE contacts ALTER COLUMN website TYPE TEXT;

-- Add a new column for image storage type to track how images are stored
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image_storage_type VARCHAR(20) DEFAULT 'url';

-- Update existing records
UPDATE blog_posts SET image_storage_type = 'url' WHERE featured_image IS NOT NULL AND featured_image != '';

-- Verify the changes
SELECT 'Schema Updated Successfully!' as message;
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'blog_posts' AND column_name = 'featured_image';
