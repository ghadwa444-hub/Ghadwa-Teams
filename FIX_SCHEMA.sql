-- ============================================================================
-- FIX SCHEMA MISMATCH - Add Missing Columns
-- ============================================================================
-- This script adds columns that the frontend code expects but are missing in the schema
-- Run this in Supabase SQL Editor BEFORE running any other queries

-- Fix orders table - add customer_name and customer_phone
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_name TEXT,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- Make delivery_phone nullable since we now have customer_phone
ALTER TABLE public.orders
  ALTER COLUMN delivery_phone DROP NOT NULL;

-- Update existing orders to have customer info from profiles
UPDATE public.orders o
SET 
  customer_name = p.full_name,
  customer_phone = p.whatsapp_number
FROM public.profiles p
WHERE o.customer_id = p.id
  AND o.customer_name IS NULL;

-- Fix order_items table - rename columns to match frontend expectations
ALTER TABLE public.order_items
  RENAME COLUMN product_price TO unit_price;

-- Verify changes
SELECT 
  'orders table' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'orders'
  AND column_name IN ('customer_name', 'customer_phone', 'delivery_phone')
UNION ALL
SELECT 
  'order_items table',
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'order_items'
  AND column_name IN ('unit_price', 'product_name', 'quantity');

-- Expected output:
-- orders table       | customer_name   | text | YES
-- orders table       | customer_phone  | text | YES
-- orders table       | delivery_phone  | text | YES
-- order_items table  | unit_price      | numeric | NO
-- order_items table  | product_name    | text | NO
-- order_items table  | quantity        | integer | NO
