-- ================================
-- FIX RLS POLICIES FOR ORDERS TABLE
-- ================================
-- This script fixes the Row Level Security policies to allow:
-- 1. Anonymous users to CREATE orders
-- 2. Admin users to READ and UPDATE all orders
-- 3. Users to READ their own orders (optional for tracking)

-- First, drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "orders_insert_policy" ON orders;
DROP POLICY IF EXISTS "orders_select_policy" ON orders;
DROP POLICY IF EXISTS "orders_update_policy" ON orders;
DROP POLICY IF EXISTS "orders_delete_policy" ON orders;

-- ================================
-- POLICY 1: Allow anyone to INSERT orders
-- ================================
-- This allows guest users (not authenticated) to create orders
-- Critical for the checkout flow
CREATE POLICY "orders_insert_policy" 
ON orders 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- ================================
-- POLICY 2: Allow admins to SELECT all orders
-- ================================
-- Admins can see all orders regardless of who created them
CREATE POLICY "orders_select_admin_policy" 
ON orders 
FOR SELECT 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- ================================
-- POLICY 3: Allow anyone to SELECT their orders by order number
-- ================================
-- This enables the "Track Order" feature for guests
-- They can track by order_number without authentication
CREATE POLICY "orders_select_by_number_policy" 
ON orders 
FOR SELECT 
TO anon, authenticated
USING (true);  -- Anyone can read orders (for tracking by order number)

-- ================================
-- POLICY 4: Allow admins to UPDATE order status
-- ================================
-- Admins can update order status, delivery info, etc.
CREATE POLICY "orders_update_admin_policy" 
ON orders 
FOR UPDATE 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- ================================
-- POLICY 5: Only admins can DELETE orders
-- ================================
CREATE POLICY "orders_delete_admin_policy" 
ON orders 
FOR DELETE 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- ================================
-- STEP 2: Make customer_id optional for guest orders
-- ================================
ALTER TABLE orders 
ALTER COLUMN customer_id DROP NOT NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- ================================
-- VERIFY POLICIES
-- ================================
-- Run this to check all policies are created:
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'orders';