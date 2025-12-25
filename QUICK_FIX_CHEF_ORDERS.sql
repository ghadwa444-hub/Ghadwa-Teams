-- ============================================================================
-- إصلاح سريع: ربط الأوردرات بالشيفات
-- ============================================================================
-- شغّل هذا السكربت أولاً لربط الأوردرات الموجودة بالشيفات
-- ============================================================================

-- الخطوة 1: ربط الأوردرات بالشيفات بناءً على المنتجات
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

-- الخطوة 2: عرض النتائج
SELECT 
    c.id as chef_id,
    c.chef_name,
    COUNT(o.id) as total_orders,
    COALESCE(SUM(o.total_amount), 0) as total_revenue
FROM public.chefs c
LEFT JOIN public.orders o ON c.id = o.chef_id
GROUP BY c.id, c.chef_name
ORDER BY total_revenue DESC;

