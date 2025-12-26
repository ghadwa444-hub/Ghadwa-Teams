-- ============================================================================
-- FIX ORDER_ITEMS RLS POLICIES FOR ADMIN ACCESS
-- ============================================================================
-- This script ensures admins can view all order_items, even for orders
-- that don't belong to them (for admin dashboard functionality).
-- ============================================================================

-- Check current policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'order_items';

-- Drop existing policies if needed (optional - comment out if you want to keep them)
-- DROP POLICY IF EXISTS "Customers can view own order items" ON public.order_items;
-- DROP POLICY IF EXISTS "Customers can create order items" ON public.order_items;
-- DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;

-- Drop existing policies first
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Customers can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;
DROP POLICY IF EXISTS "Customers can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;

-- Create policy: Admins can view ALL order_items
CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policy: Customers can view their own order_items
CREATE POLICY "Customers can view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.customer_id = auth.uid()
    )
  );

-- Create policy: Admins can manage all order_items
CREATE POLICY "Admins can manage all order items"
  ON public.order_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Verify policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'order_items';

-- Test query: Check if order_items can be joined with orders
-- Run this as an admin user to verify
SELECT 
    o.id as order_id,
    o.order_number,
    o.customer_name,
    COUNT(oi.id) as items_count
FROM public.orders o
LEFT JOIN public.order_items oi ON oi.order_id = o.id
GROUP BY o.id, o.order_number, o.customer_name
ORDER BY o.created_at DESC
LIMIT 10;

