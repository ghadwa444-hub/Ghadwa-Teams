-- ============================================================================
-- ADD chef_id COLUMN TO boxes TABLE
-- ============================================================================
-- This migration adds chef_id (UUID) to boxes table to enable chef conflict
-- detection when adding boxes to cart, and to display chef names in box cards.
-- ============================================================================

-- Add chef_id column to boxes table
ALTER TABLE public.boxes 
  ADD COLUMN IF NOT EXISTS chef_id UUID;

-- Add foreign key constraint (optional, but recommended for data integrity)
-- Note: This will fail if there are boxes with chef_id values that don't exist in chefs table
-- ALTER TABLE public.boxes
--   ADD CONSTRAINT fk_boxes_chef_id 
--   FOREIGN KEY (chef_id) 
--   REFERENCES public.chefs(id) 
--   ON DELETE SET NULL;

-- Add comment
COMMENT ON COLUMN public.boxes.chef_id IS 'UUID reference to chefs table - used for chef conflict detection and displaying chef names';

-- Optional: Populate chef_id from chef name (if chef names match exactly)
-- This will try to match existing boxes.chef (TEXT) with chefs.chef_name
-- UPDATE public.boxes b
-- SET chef_id = c.id
-- FROM public.chefs c
-- WHERE b.chef = c.chef_name
--   AND b.chef_id IS NULL;

-- Verify the column was added
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'boxes'
  AND column_name = 'chef_id';

