-- ============================================================================
-- فحص وإصلاح ربط الأوردرات بالشيفات
-- ============================================================================
-- هذا السكربت يفحص الأوردرات ويربطها بالشيفات بناءً على المنتجات
-- ============================================================================

-- الخطوة 1: فحص الوضع الحالي
DO $$
DECLARE
    total_orders INTEGER;
    orders_with_chef_id INTEGER;
    orders_without_chef_id INTEGER;
    orders_with_items INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_orders FROM public.orders;
    SELECT COUNT(*) INTO orders_with_chef_id FROM public.orders WHERE chef_id IS NOT NULL;
    SELECT COUNT(*) INTO orders_without_chef_id FROM public.orders WHERE chef_id IS NULL;
    SELECT COUNT(DISTINCT o.id) INTO orders_with_items 
    FROM public.orders o
    INNER JOIN public.order_items oi ON o.id = oi.order_id
    INNER JOIN public.products p ON oi.product_id = p.id
    WHERE p.chef_id IS NOT NULL;
    
    RAISE NOTICE '📊 الوضع الحالي:';
    RAISE NOTICE '   إجمالي الأوردرات: %', total_orders;
    RAISE NOTICE '   أوردرات مرتبطة بشيف: %', orders_with_chef_id;
    RAISE NOTICE '   أوردرات بدون شيف: %', orders_without_chef_id;
    RAISE NOTICE '   أوردرات يمكن ربطها (لديها منتجات مع chef_id): %', orders_with_items;
END $$;

-- الخطوة 2: ربط الأوردرات التي لا تحتوي على chef_id
-- نستخدم chef_id الأكثر تكراراً في منتجات الطلب
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

-- الخطوة 3: التحقق من النتائج بعد الإصلاح
DO $$
DECLARE
    total_orders INTEGER;
    orders_with_chef_id INTEGER;
    orders_without_chef_id INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_orders FROM public.orders;
    SELECT COUNT(*) INTO orders_with_chef_id FROM public.orders WHERE chef_id IS NOT NULL;
    SELECT COUNT(*) INTO orders_without_chef_id FROM public.orders WHERE chef_id IS NULL;
    
    RAISE NOTICE '';
    RAISE NOTICE '📊 بعد الإصلاح:';
    RAISE NOTICE '   إجمالي الأوردرات: %', total_orders;
    RAISE NOTICE '   أوردرات مرتبطة بشيف: %', orders_with_chef_id;
    RAISE NOTICE '   أوردرات بدون شيف: %', orders_without_chef_id;
    
    IF orders_with_chef_id > 0 THEN
        RAISE NOTICE '✅ تم ربط % أوردرات بالشيفات بنجاح!', orders_with_chef_id;
    ELSE
        RAISE NOTICE '⚠️ لا توجد أوردرات مرتبطة بشيفات';
        RAISE NOTICE '   السبب المحتمل: المنتجات لا تحتوي على chef_id';
    END IF;
END $$;

-- الخطوة 4: عرض عينة من الأوردرات المرتبطة بالشيفات
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
LIMIT 10;

-- الخطوة 5: عرض إحصائيات لكل شيف
SELECT 
    c.id as chef_id,
    c.chef_name,
    COUNT(o.id) as total_orders,
    COALESCE(SUM(o.total_amount), 0) as total_revenue
FROM public.chefs c
LEFT JOIN public.orders o ON c.id = o.chef_id
GROUP BY c.id, c.chef_name
ORDER BY total_revenue DESC;


