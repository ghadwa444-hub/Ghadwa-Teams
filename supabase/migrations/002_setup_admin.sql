-- ============================================================================
-- ADMIN USER SETUP INSTRUCTIONS
-- ============================================================================
-- Run these queries AFTER running the main migration script
-- Replace 'YOUR_USER_ID_HERE' with the actual UUID from Authentication > Users
-- ============================================================================

-- Step 1: Find your admin user ID
-- Go to Authentication > Users in Supabase Dashboard
-- Copy the UUID of the user you want to make admin

-- Step 2: Update the profile to admin role
-- Replace 'YOUR_USER_ID_HERE' with the actual UUID
UPDATE public.profiles
SET 
  role = 'admin',
  full_name = 'Ghadwa Admin',
  whatsapp_number = '+201109318581'
WHERE id = 'YOUR_USER_ID_HERE';

-- Step 3: Verify the admin user was created
SELECT id, full_name, whatsapp_number, role, is_active
FROM public.profiles
WHERE role = 'admin';

-- ============================================================================
-- SEED SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Insert sample chefs
INSERT INTO public.chefs (chef_name, specialty, description, image_url, rating)
VALUES
  ('ماما فاطمة', 'أكل مصري تقليدي', 'أحلى أكل بيتي من مطبخ مصري أصيل', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c', 4.8),
  ('شيف حسن', 'مشويات ومندي', 'متخصص في المشويات والأرز البخاري', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1', 4.9),
  ('خالة نادية', 'محاشي وطواجن', 'محاشي وطواجن بنكهة البيت', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d', 4.7);

-- Get chef IDs to use in products
-- Run this and copy the IDs
SELECT id, chef_name FROM public.chefs;

-- Insert sample products (replace CHEF_ID_1, CHEF_ID_2 with actual IDs from above)
INSERT INTO public.products (chef_id, title, description, price, category, stock_quantity, preparation_time)
VALUES
  -- Chef 1 (Fatima) products
  ('CHEF_ID_1', 'محشي مشكل', 'باذنجان، كوسة، وفلفل بخلطة الرز السرية والبهارات', 150.00, 'main', 100, 45),
  ('CHEF_ID_1', 'ملوخية وفراخ', 'نص فرخة محمرة بالسمنة مع طبق ملوخية بطشة الكزبرة', 180.00, 'main', 50, 60),
  ('CHEF_ID_1', 'كشري مصري', 'عدس، رز، ومكرونة مع صلصة ودقة وشطة حسب الطلب', 60.00, 'main', 200, 20),
  
  -- Chef 2 (Hassan) products
  ('CHEF_ID_2', 'نص تيس مندي', 'لحم خروف طري مع رز مندي بخاري والسلطات', 450.00, 'main', 20, 120),
  ('CHEF_ID_2', 'كباب حلة', 'لحم بقري مفروم مع صلصة الطماطم والبصل', 120.00, 'main', 80, 40),
  ('CHEF_ID_2', 'فراخ مشوية', 'فرخة كاملة مشوية مع صلصة الثوم', 140.00, 'main', 60, 50),
  
  -- Chef 3 (Nadia) products
  ('CHEF_ID_3', 'مكرونة بشاميل', 'مكرونة قلم مع لحمة مفرومة بلدي وصوص بشاميل غني', 120.00, 'main', 100, 35),
  ('CHEF_ID_3', 'مسقعة باللحمة', 'باذنجان رومي مقلي مع عصاج وصلصة طماطم مسبكة', 90.00, 'main', 80, 40),
  ('CHEF_ID_3', 'فتة كوارع', 'فتة بالخل والثوم مع قطع كوارع مخلية ودايبة', 250.00, 'main', 30, 90);

-- Verify products were created
SELECT p.title, c.chef_name, p.price, p.category
FROM public.products p
LEFT JOIN public.chefs c ON p.chef_id = c.id
ORDER BY c.chef_name, p.title;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check all tables were created
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check triggers
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Check admin settings
SELECT * FROM public.admin_settings ORDER BY setting_key;

-- Count records in each table
SELECT 
  'profiles' as table_name, COUNT(*) as row_count FROM public.profiles
UNION ALL
SELECT 'chefs', COUNT(*) FROM public.chefs
UNION ALL
SELECT 'products', COUNT(*) FROM public.products
UNION ALL
SELECT 'orders', COUNT(*) FROM public.orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM public.order_items
UNION ALL
SELECT 'admin_settings', COUNT(*) FROM public.admin_settings;
