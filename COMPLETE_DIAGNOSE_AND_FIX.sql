-- ============================================================================
-- تشخيص وإصلاح شامل لمشكلة المبيعات وعدد الأوردرات
-- ============================================================================

-- ============================================================================
-- الجزء 1: فحص الوضع الحالي
-- ============================================================================

-- 1.1: فحص الأوردرات
SELECT 
    'الأوردرات' as category,
    COUNT(*) as total_count,
    COUNT(chef_id) as with_chef_id,
    COUNT(*) - COUNT(chef_id) as without_chef_id
FROM public.orders;

-- 1.2: فحص المنتجات
SELECT 
    'المنتجات' as category,
    COUNT(*) as total_count,
    COUNT(chef_id) as with_chef_id,
    COUNT(*) - COUNT(chef_id) as without_chef_id
FROM public.products;

-- 1.3: فحص order_items
SELECT 
    'عناصر الأوردرات' as category,
    COUNT(*) as total_count,
    COUNT(oi.product_id) as with_product_id
FROM public.order_items oi;

-- 1.4: فحص الشيفات
SELECT 
    'الشيفات' as category,
    COUNT(*) as total_count,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_chefs
FROM public.chefs;

-- ============================================================================
-- الجزء 2: عرض الأوردرات بدون chef_id
-- ============================================================================

SELECT 
    o.id,
    o.order_number,
    o.chef_id,
    o.total_amount,
    o.status,
    o.created_at,
    (SELECT COUNT(*) FROM public.order_items oi WHERE oi.order_id = o.id) as items_count
FROM public.orders o
WHERE o.chef_id IS NULL
ORDER BY o.created_at DESC
LIMIT 10;

-- ============================================================================
-- الجزء 3: ربط الأوردرات بالشيفات بناءً على المنتجات
-- ============================================================================

-- 3.1: ربط الأوردرات التي تحتوي على order_items
UPDATE public.orders o
SET chef_id = (
    SELECT p.chef_id 
    FROM public.order_items oi
    JOIN public.products p ON oi.product_id = p.id
    WHERE oi.order_id = o.id
      AND p.chef_id IS NOT NULL
    GROUP BY p.chef_id
    ORDER BY SUM(oi.quantity) DESC, COUNT(*) DESC
    LIMIT 1
)
WHERE o.chef_id IS NULL
  AND EXISTS (
      SELECT 1 
      FROM public.order_items oi
      JOIN public.products p ON oi.product_id = p.id
      WHERE oi.order_id = o.id
        AND p.chef_id IS NOT NULL
  );

-- ============================================================================
-- الجزء 4: التحقق من النتائج
-- ============================================================================

-- 4.1: إحصائيات بعد الإصلاح
SELECT 
    'بعد الإصلاح' as status,
    COUNT(*) as total_orders,
    COUNT(chef_id) as orders_with_chef_id,
    COUNT(*) - COUNT(chef_id) as orders_without_chef_id
FROM public.orders;

-- 4.2: إحصائيات لكل شيف
SELECT 
    c.id as chef_id,
    c.chef_name,
    COUNT(o.id) as total_orders,
    COALESCE(SUM(o.total_amount), 0) as total_revenue,
    COALESCE(AVG(o.total_amount), 0) as avg_order_value
FROM public.chefs c
LEFT JOIN public.orders o ON c.id = o.chef_id
GROUP BY c.id, c.chef_name
ORDER BY total_revenue DESC;

-- 4.3: عرض الأوردرات المرتبطة بالشيفات
SELECT 
    o.id,
    o.order_number,
    o.chef_id,
    c.chef_name,
    o.total_amount,
    o.status,
    o.created_at
FROM public.orders o
LEFT JOIN public.chefs c ON o.chef_id = c.id
WHERE o.chef_id IS NOT NULL
ORDER BY o.created_at DESC
LIMIT 20;

-- ============================================================================
-- الجزء 5: فحص المنتجات غير المرتبطة بشيفات
-- ============================================================================

SELECT 
    p.id,
    p.name,
    p.chef_id,
    p.price,
    p.is_active
FROM public.products p
WHERE p.chef_id IS NULL
LIMIT 10;

-- ============================================================================
-- ملخص نهائي
-- ============================================================================

DO $$
DECLARE
    total_orders INTEGER;
    orders_with_chef INTEGER;
    total_products INTEGER;
    products_with_chef INTEGER;
    total_chefs INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_orders FROM public.orders;
    SELECT COUNT(*) INTO orders_with_chef FROM public.orders WHERE chef_id IS NOT NULL;
    SELECT COUNT(*) INTO total_products FROM public.products;
    SELECT COUNT(*) INTO products_with_chef FROM public.products WHERE chef_id IS NOT NULL;
    SELECT COUNT(*) INTO total_chefs FROM public.chefs;
    
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '📊 ملخص شامل:';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '   الشيفات: %', total_chefs;
    RAISE NOTICE '   المنتجات: % (مرتبطة بشيف: %)', total_products, products_with_chef;
    RAISE NOTICE '   الأوردرات: % (مرتبطة بشيف: %)', total_orders, orders_with_chef;
    RAISE NOTICE '';
    
    IF orders_with_chef = 0 AND total_orders > 0 THEN
        RAISE NOTICE '⚠️  المشكلة: لا توجد أوردرات مرتبطة بشيفات!';
        RAISE NOTICE '   الحل: تأكد من أن المنتجات مرتبطة بشيفات';
    ELSIF orders_with_chef > 0 THEN
        RAISE NOTICE '✅ تم ربط % أوردرات بالشيفات', orders_with_chef;
    ELSE
        RAISE NOTICE '⚠️  لا توجد أوردرات في قاعدة البيانات';
    END IF;
    
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
END $$;




