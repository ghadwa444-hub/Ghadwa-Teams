-- ============================================================================
-- CHECK AND FIX ORDER_ITEMS DATA AND RLS POLICIES
-- ============================================================================
-- This script checks if order_items exist and fixes RLS policies
-- ============================================================================

-- 1. Check if order_items table has data
SELECT 
    COUNT(*) as total_order_items,
    COUNT(DISTINCT order_id) as orders_with_items
FROM public.order_items;

-- 2. Check order_items for specific orders
SELECT 
    o.id as order_id,
    o.order_number,
    o.customer_name,
    COUNT(oi.id) as items_count,
    STRING_AGG(oi.product_name || ' x' || oi.quantity, ', ') as items_list
FROM public.orders o
LEFT JOIN public.order_items oi ON oi.order_id = o.id
GROUP BY o.id, o.order_number, o.customer_name
ORDER BY o.created_at DESC
LIMIT 10;

-- 3. Drop ALL existing policies on order_items
DROP POLICY IF EXISTS "Customers can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Customers can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;

-- 4. Create new policies (admins first, then customers)
-- Policy 1: Admins can view ALL order_items
CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy 2: Admins can manage ALL order_items
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

-- Policy 3: Customers can view their own order_items
CREATE POLICY "Customers can view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.customer_id = auth.uid()
    )
  );

-- Policy 4: Customers can create order_items for their own orders
CREATE POLICY "Customers can create order items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.customer_id = auth.uid()
    )
  );

-- 5. Verify policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'order_items'
ORDER BY policyname;

-- 6. Test query as admin (should return all order_items)
SELECT 
    oi.id,
    oi.order_id,
    oi.product_name,
    oi.quantity,
    oi.unit_price,
    oi.total_price
FROM public.order_items oi
ORDER BY oi.created_at DESC
LIMIT 20;

