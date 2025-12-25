-- ============================================================================
-- ربط الأوردرات القديمة بالشيفات بناءً على المنتجات في order_items
-- ============================================================================
-- هذا السكربت يربط الأوردرات التي لا تحتوي على chef_id بالشيفات
-- بناءً على المنتجات الموجودة في order_items
-- ============================================================================

-- الخطوة 1: ربط الأوردرات التي لا تحتوي على chef_id
UPDATE public.orders o
SET chef_id = (
    SELECT p.chef_id 
    FROM public.order_items oi
    JOIN public.products p ON oi.product_id = p.id
    WHERE oi.order_id = o.id
      AND p.chef_id IS NOT NULL
    GROUP BY p.chef_id
    ORDER BY COUNT(*) DESC
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

-- الخطوة 2: التحقق من النتائج
DO $$
DECLARE
    total_orders INTEGER;
    orders_with_chef_id INTEGER;
    orders_without_chef_id INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_orders FROM public.orders;
    SELECT COUNT(*) INTO orders_with_chef_id FROM public.orders WHERE chef_id IS NOT NULL;
    SELECT COUNT(*) INTO orders_without_chef_id FROM public.orders WHERE chef_id IS NULL;
    
    RAISE NOTICE '📊 إحصائيات الأوردرات:';
    RAISE NOTICE '   إجمالي الأوردرات: %', total_orders;
    RAISE NOTICE '   أوردرات مرتبطة بشيف: %', orders_with_chef_id;
    RAISE NOTICE '   أوردرات بدون شيف: %', orders_without_chef_id;
    
    IF orders_with_chef_id > 0 THEN
        RAISE NOTICE '✅ تم ربط % أوردرات بالشيفات بنجاح!', orders_with_chef_id;
    ELSE
        RAISE NOTICE '⚠️ لا توجد أوردرات مرتبطة بشيفات';
    END IF;
END $$;

-- الخطوة 3: عرض عينة من الأوردرات المرتبطة
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

