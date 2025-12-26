-- ============================================================================
-- ADD IMAGE_URL COLUMN TO ORDER_ITEMS TABLE
-- ============================================================================
-- This script adds image_url column to order_items to store product images
-- ============================================================================

-- Add image_url column if it doesn't exist
ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add unit_price and total_price columns if they don't exist (for compatibility)
ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS unit_price NUMERIC(10, 2);

ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS total_price NUMERIC(10, 2);

-- Migrate existing data: copy product_price to unit_price if unit_price is null
UPDATE public.order_items
SET unit_price = product_price
WHERE unit_price IS NULL AND product_price IS NOT NULL;

-- Migrate existing data: copy subtotal to total_price if total_price is null
UPDATE public.order_items
SET total_price = subtotal
WHERE total_price IS NULL AND subtotal IS NOT NULL;

-- Update image_url from products table for existing order_items
UPDATE public.order_items oi
SET image_url = p.image_url
FROM public.products p
WHERE oi.product_id = p.id
  AND oi.image_url IS NULL
  AND p.image_url IS NOT NULL;

-- Add comment
COMMENT ON COLUMN public.order_items.image_url IS 'URL to the product image at the time of order';
COMMENT ON COLUMN public.order_items.unit_price IS 'Price per unit at the time of order (alias for product_price)';
COMMENT ON COLUMN public.order_items.total_price IS 'Total price for this item (alias for subtotal)';

-- Verify the changes
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'order_items'
  AND column_name IN ('image_url', 'unit_price', 'total_price', 'product_price', 'subtotal')
ORDER BY column_name;

