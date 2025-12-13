-- ============================================================================
-- ADD SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================================================
-- This script adds sample chefs and products to test the app
-- Run this in Supabase SQL Editor after creating your admin user

-- Step 1: Insert Sample Chefs
INSERT INTO public.chefs (chef_name, specialty, description, image_url, rating, is_active)
VALUES
  ('ماما فاطمة', 'أكل مصري تقليدي', 'أحلى أكل بيتي من مطبخ مصري أصيل', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c', 4.8, true),
  ('شيف حسن', 'مشويات ومندي', 'متخصص في المشويات والأرز البخاري', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1', 4.9, true),
  ('خالة نادية', 'محاشي وطواجن', 'محاشي وطواجن بنكهة البيت', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d', 4.7, true)
RETURNING id, chef_name;

-- ⚠️ IMPORTANT: Copy the IDs from the output above!
-- You'll need them for the next step

-- Step 2: Get Chef IDs (if you missed them above)
SELECT id, chef_name, specialty FROM public.chefs ORDER BY created_at DESC LIMIT 3;

-- Step 3: Insert Products
-- Replace CHEF_ID_1, CHEF_ID_2, CHEF_ID_3 with actual UUIDs from Step 2

-- Example (REPLACE THE UUIDs):
/*
INSERT INTO public.products (chef_id, title, description, price, category, stock_quantity, preparation_time, image_url, is_available)
VALUES
  -- Chef 1 products (ماما فاطمة)
  ('YOUR-CHEF-1-UUID-HERE', 'محشي مشكل', 'باذنجان، كوسة، وفلفل بخلطة الرز السرية', '150.00', 'main', 100, 45, 'https://images.unsplash.com/photo-1574484284002-952d92456975', true),
  ('YOUR-CHEF-1-UUID-HERE', 'ملوخية وفراخ', 'نص فرخة محمرة مع ملوخية بطشة الكزبرة', '180.00', 'main', 50, 60, 'https://images.unsplash.com/photo-1544025162-d76694265947', true),
  ('YOUR-CHEF-1-UUID-HERE', 'كشري مصري', 'عدس، رز، ومكرونة مع صلصة حارة وبصل محمر', '60.00', 'main', 200, 20, 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41', true),
  
  -- Chef 2 products (شيف حسن)
  ('YOUR-CHEF-2-UUID-HERE', 'نص تيس مندي', 'لحم خروف طري مع رز مندي بخاري', '450.00', 'main', 20, 120, 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143', true),
  ('YOUR-CHEF-2-UUID-HERE', 'فراخ مشوية', 'فرخة كاملة مشوية مع صلصة الثوم', '140.00', 'main', 60, 50, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6', true),
  ('YOUR-CHEF-2-UUID-HERE', 'كباب حلة', 'لحم بقري مفروم مع صلصة طماطم', '120.00', 'main', 80, 40, 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba', true),
  
  -- Chef 3 products (خالة نادية)
  ('YOUR-CHEF-3-UUID-HERE', 'مكرونة بشاميل', 'مكرونة مع لحمة وبشاميل غني', '120.00', 'main', 100, 35, 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9', true),
  ('YOUR-CHEF-3-UUID-HERE', 'مسقعة باللحمة', 'باذنجان رومي مع صلصة طماطم ولحمة مفرومة', '90.00', 'main', 80, 40, 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3', true),
  ('YOUR-CHEF-3-UUID-HERE', 'فتة كوارع', 'فتة بالخل والثوم مع كوارع مخلية', '250.00', 'main', 30, 90, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8', true);
*/

-- Step 4: Verify Data
SELECT 
  'chefs' as table_name, COUNT(*) as count 
FROM public.chefs
UNION ALL
SELECT 'products', COUNT(*) FROM public.products
UNION ALL
SELECT 'orders', COUNT(*) FROM public.orders;

-- Expected Output:
-- chefs     | 3
-- products  | 9 (after you add them)
-- orders    | 0 (will increase when customers order)

-- ============================================================================
-- QUICK INSERT WITH DYNAMIC IDs (EASIER METHOD)
-- ============================================================================
-- This automatically gets chef IDs and inserts products in one go

DO $$
DECLARE
  chef1_id UUID;
  chef2_id UUID;
  chef3_id UUID;
BEGIN
  -- Get chef IDs
  SELECT id INTO chef1_id FROM public.chefs WHERE chef_name = 'ماما فاطمة' LIMIT 1;
  SELECT id INTO chef2_id FROM public.chefs WHERE chef_name = 'شيف حسن' LIMIT 1;
  SELECT id INTO chef3_id FROM public.chefs WHERE chef_name = 'خالة نادية' LIMIT 1;
  
  -- Insert products for Chef 1 (ماما فاطمة)
  IF chef1_id IS NOT NULL THEN
    INSERT INTO public.products (chef_id, title, description, price, category, stock_quantity, preparation_time, image_url, is_available)
    VALUES
      (chef1_id, 'محشي مشكل', 'باذنجان، كوسة، وفلفل بخلطة الرز السرية', '150.00', 'main', 100, 45, 'https://images.unsplash.com/photo-1574484284002-952d92456975', true),
      (chef1_id, 'ملوخية وفراخ', 'نص فرخة محمرة مع ملوخية بطشة الكزبرة', '180.00', 'main', 50, 60, 'https://images.unsplash.com/photo-1544025162-d76694265947', true),
      (chef1_id, 'كشري مصري', 'عدس، رز، ومكرونة مع صلصة حارة وبصل محمر', '60.00', 'main', 200, 20, 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41', true);
    RAISE NOTICE 'Added products for ماما فاطمة';
  END IF;
  
  -- Insert products for Chef 2 (شيف حسن)
  IF chef2_id IS NOT NULL THEN
    INSERT INTO public.products (chef_id, title, description, price, category, stock_quantity, preparation_time, image_url, is_available)
    VALUES
      (chef2_id, 'نص تيس مندي', 'لحم خروف طري مع رز مندي بخاري', '450.00', 'main', 20, 120, 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143', true),
      (chef2_id, 'فراخ مشوية', 'فرخة كاملة مشوية مع صلصة الثوم', '140.00', 'main', 60, 50, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6', true),
      (chef2_id, 'كباب حلة', 'لحم بقري مفروم مع صلصة طماطم', '120.00', 'main', 80, 40, 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba', true);
    RAISE NOTICE 'Added products for شيف حسن';
  END IF;
  
  -- Insert products for Chef 3 (خالة نادية)
  IF chef3_id IS NOT NULL THEN
    INSERT INTO public.products (chef_id, title, description, price, category, stock_quantity, preparation_time, image_url, is_available)
    VALUES
      (chef3_id, 'مكرونة بشاميل', 'مكرونة مع لحمة وبشاميل غني', '120.00', 'main', 100, 35, 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9', true),
      (chef3_id, 'مسقعة باللحمة', 'باذنجان رومي مع صلصة طماطم ولحمة مفرومة', '90.00', 'main', 80, 40, 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3', true),
      (chef3_id, 'فتة كوارع', 'فتة بالخل والثوم مع كوارع مخلية', '250.00', 'main', 30, 90, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8', true);
    RAISE NOTICE 'Added products for خالة نادية';
  END IF;
  
  RAISE NOTICE 'Sample data insertion complete!';
END $$;

-- Verify products were added
SELECT 
  c.chef_name,
  COUNT(p.id) as product_count
FROM public.chefs c
LEFT JOIN public.products p ON c.id = p.chef_id
GROUP BY c.chef_name, c.created_at
ORDER BY c.created_at;

-- Expected Output:
-- ماما فاطمة    | 3
-- شيف حسن      | 3
-- خالة نادية    | 3
