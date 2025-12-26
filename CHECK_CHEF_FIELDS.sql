-- ============================================================================
-- Check if chef fields exist in database
-- ============================================================================
-- Run this script to verify that cover_image_url, working_hours, and delivery_time
-- columns exist in the chefs table
-- ============================================================================

-- Check if columns exist
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'chefs'
  AND column_name IN ('cover_image_url', 'working_hours', 'delivery_time')
ORDER BY column_name;

-- If the above query returns 0 rows, run the migration:
-- Run: ADD_CHEF_FIELDS_MIGRATION.sql

-- Check current chef data
SELECT 
    id,
    chef_name,
    image_url IS NOT NULL as has_profile_image,
    cover_image_url IS NOT NULL as has_cover_image,
    working_hours,
    delivery_time
FROM public.chefs
LIMIT 10;

