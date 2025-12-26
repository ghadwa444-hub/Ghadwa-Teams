-- ============================================================================
-- FIX ORDER_ITEMS INSERT - COMPLETE FIX
-- ============================================================================
-- This script fixes RLS policies to allow inserting order_items
-- ============================================================================

-- 1. Disable RLS temporarily to check if that's the issue
-- ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Customers can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;
DROP POLICY IF EXISTS "Customers can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow insert order items for existing orders" ON public.order_items;

-- 3. Re-enable RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 4. Create policy: ANYONE can INSERT order_items (for guest orders)
-- This is the most permissive policy for INSERT
CREATE POLICY "Allow anyone to insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (true);

-- 5. Create policy: Admins can view ALL order_items
CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 6. Create policy: Customers can view their own order_items
CREATE POLICY "Customers can view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.customer_id = auth.uid() OR orders.customer_id IS NULL)
    )
  );

-- 7. Create policy: Admins can manage all order_items
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

-- 8. Verify policies
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
WHERE tablename = 'order_items'
ORDER BY policyname;

-- 9. Test INSERT (this should work now)
-- Try inserting a test order item (replace with actual order_id)
/*
INSERT INTO public.order_items (
    order_id,
    product_id,
    product_name,
    quantity,
    unit_price,
    total_price,
    product_price,
    subtotal
) VALUES (
    'YOUR_ORDER_ID_HERE',
    NULL,
    'Test Product',
    1,
    100.00,
    100.00,
    100.00,
    100.00
);
*/

-- 10. Check current order_items count
SELECT COUNT(*) as total_order_items FROM public.order_items;

-- 11. Check orders without items
SELECT 
    o.id,
    o.order_number,
    o.customer_name,
    o.created_at,
    COUNT(oi.id) as items_count
FROM public.orders o
LEFT JOIN public.order_items oi ON oi.order_id = o.id
GROUP BY o.id, o.order_number, o.customer_name, o.created_at
HAVING COUNT(oi.id) = 0
ORDER BY o.created_at DESC
LIMIT 10;

