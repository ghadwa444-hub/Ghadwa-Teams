-- ============================================================================
-- Migration: Add New Chef Fields and Product Original Price
-- ============================================================================
-- This script adds new fields to support enhanced chef profiles and offers
-- ============================================================================

-- ============================================================================
-- PART 1: Add new fields to chefs table
-- ============================================================================

-- Add cover_image_url for chef profile banner
ALTER TABLE public.chefs 
ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- Add working_hours to display chef's operating hours
ALTER TABLE public.chefs 
ADD COLUMN IF NOT EXISTS working_hours TEXT;

-- Add delivery_time to display estimated delivery duration
ALTER TABLE public.chefs 
ADD COLUMN IF NOT EXISTS delivery_time TEXT;

COMMENT ON COLUMN public.chefs.cover_image_url IS 'Cover/banner image URL for chef profile page';
COMMENT ON COLUMN public.chefs.working_hours IS 'Chef operating hours (e.g., "يوميًا 10ص - 10م")';
COMMENT ON COLUMN public.chefs.delivery_time IS 'Estimated delivery time (e.g., "30-45 دقيقة")';

-- ============================================================================
-- PART 2: Add original_price to products table for offers
-- ============================================================================

-- Add original_price to show discount amount in offers
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS original_price NUMERIC(10, 2);

COMMENT ON COLUMN public.products.original_price IS 'Original price before discount (only for offers/is_offer=true)';

-- ============================================================================
-- PART 3: Update existing data (optional defaults)
-- ============================================================================

-- Set default delivery time for existing active chefs
UPDATE public.chefs 
SET delivery_time = '30-45 دقيقة'
WHERE delivery_time IS NULL AND is_active = true;

-- Set default working hours for existing active chefs
UPDATE public.chefs 
SET working_hours = 'يوميًا 10ص - 10م'
WHERE working_hours IS NULL AND is_active = true;

-- ============================================================================
-- PART 4: Verify the changes
-- ============================================================================

-- Check chefs table structure
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

-- Check products table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'products'
  AND column_name = 'original_price';

-- View sample chef data with new fields
SELECT 
    id,
    chef_name,
    is_active,
    working_hours,
    delivery_time,
    CASE 
        WHEN cover_image_url IS NOT NULL THEN 'YES'
        ELSE 'NO'
    END as has_cover
FROM public.chefs
LIMIT 5;

-- ============================================================================
-- Expected Output:
-- ============================================================================
-- 
-- chefs table should now have:
-- - cover_image_url (TEXT, nullable)
-- - working_hours (TEXT, nullable)
-- - delivery_time (TEXT, nullable)
--
-- products table should now have:
-- - original_price (NUMERIC, nullable)
--
-- ============================================================================

