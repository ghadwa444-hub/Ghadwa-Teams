-- ============================================================================
-- CRITICAL FIX: RLS POLICIES & ADMIN USER
-- ============================================================================
-- Run this ENTIRE script in Supabase SQL Editor to fix:
-- 1. 500 errors on admin_settings, orders, products, chefs queries
-- 2. "Invalid login credentials" for admin user
-- ============================================================================

-- STEP 1: DROP problematic RLS policies and recreate correctly
-- ============================================================================

-- Drop problematic profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;

-- Create CORRECT profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Authenticated users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- STEP 2: Fix CHEFS policies - Allow public read, admin full access
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view active chefs" ON public.chefs;
DROP POLICY IF EXISTS "Admins can manage chefs" ON public.chefs;

-- Public can view active chefs (no auth required)
CREATE POLICY "Anyone can view active chefs"
  ON public.chefs FOR SELECT
  USING (is_active = true);

-- Admins can manage all chefs
CREATE POLICY "Admins can manage chefs"
  ON public.chefs FOR ALL
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- STEP 3: Fix PRODUCTS policies - Allow public read, admin full access
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

-- Public can view active products (no auth required)
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = true);

-- Admins can manage all products
CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- STEP 4: Fix ORDERS policies - Users can view own, admins can view all
-- ============================================================================

DROP POLICY IF EXISTS "Customers can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage orders" ON public.orders;

-- Customers can view their own orders
CREATE POLICY "Customers can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = customer_id);

-- Customers can insert their own orders
CREATE POLICY "Customers can insert own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update all orders
CREATE POLICY "Admins can update all orders"
  ON public.orders FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- STEP 5: Fix ORDER_ITEMS policies
-- ============================================================================

DROP POLICY IF EXISTS "Customers can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Customers can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;

-- Customers can view items in their own orders
CREATE POLICY "Customers can view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND customer_id = auth.uid()
    )
  );

-- Customers can insert order items
CREATE POLICY "Customers can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND customer_id = auth.uid()
    )
  );

-- Admins can manage all order items
CREATE POLICY "Admins can manage order items"
  ON public.order_items FOR ALL
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- STEP 6: Fix ADMIN_SETTINGS policies
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view public settings" ON public.admin_settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.admin_settings;

-- Anyone (including anonymous) can view public settings
CREATE POLICY "Anyone can view public settings"
  ON public.admin_settings FOR SELECT
  USING (is_public = true);

-- Admins can view all settings and manage them
CREATE POLICY "Admins can view all settings"
  ON public.admin_settings FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage settings"
  ON public.admin_settings FOR ALL
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- STEP 7: Create ADMIN USER - If Not Exists
-- ============================================================================

DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@ghadwa.com'
  LIMIT 1;

  -- If admin doesn't exist, create them
  IF admin_user_id IS NULL THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      is_super_admin,
      last_sign_in_at
    ) VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'admin@ghadwa.com',
      crypt('Admin@Ghadwa#123', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Ghadwa Admin","whatsapp_number":"+201109318581","role":"admin"}'::jsonb,
      NOW(),
      NOW(),
      '',
      '',
      '',
      false,
      NOW()
    ) RETURNING id INTO admin_user_id;

    -- Create corresponding admin profile
    INSERT INTO public.profiles (
      id,
      full_name,
      whatsapp_number,
      role,
      is_active,
      created_at,
      updated_at
    ) VALUES (
      admin_user_id,
      'Ghadwa Admin',
      '+201109318581',
      'admin',
      true,
      NOW(),
      NOW()
    );

    RAISE NOTICE '✅ Admin user created successfully: admin@ghadwa.com';
  ELSE
    -- Admin exists, verify profile exists
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = admin_user_id AND role = 'admin'
    ) THEN
      -- Create missing admin profile
      INSERT INTO public.profiles (
        id,
        full_name,
        whatsapp_number,
        role,
        is_active,
        created_at,
        updated_at
      ) VALUES (
        admin_user_id,
        'Ghadwa Admin',
        '+201109318581',
        'admin',
        true,
        NOW(),
        NOW()
      );
      RAISE NOTICE '✅ Admin profile created for existing user';
    ELSE
      RAISE NOTICE '✅ Admin user already exists with profile';
    END IF;
  END IF;
END $$;

-- STEP 8: Verify everything is working
-- ============================================================================

RAISE NOTICE '';
RAISE NOTICE '=== VERIFICATION REPORT ===';
RAISE NOTICE 'Checking admin user...';

SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Admin user exists in auth.users'
    ELSE '❌ Admin user NOT found'
  END as admin_auth_check
FROM auth.users
WHERE email = 'admin@ghadwa.com';

SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Admin profile exists'
    ELSE '❌ Admin profile NOT found'
  END as admin_profile_check
FROM public.profiles
WHERE role = 'admin';

RAISE NOTICE '';
RAISE NOTICE '=== RLS POLICIES VERIFICATION ===';

SELECT 
  schemaname,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;

RAISE NOTICE '';
RAISE NOTICE '🎉 All fixes applied! You can now:';
RAISE NOTICE '1. Try logging in with: admin@ghadwa.com / Admin@Ghadwa#123';
RAISE NOTICE '2. Products should load (public read access enabled)';
RAISE NOTICE '3. Admin dashboard should work (full admin access enabled)';
RAISE NOTICE '';
