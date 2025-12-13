-- ============================================================================
-- VERIFY ADMIN USER SETUP
-- ============================================================================
-- Run this query to confirm admin user is ready to use

-- Check 1: Admin user in auth.users
SELECT 
  id,
  email,
  email_confirmed_at as confirmed,
  created_at
FROM auth.users 
WHERE email = 'admin@ghadwa.com';

-- Expected output:
-- id: (some UUID)
-- email: admin@ghadwa.com
-- confirmed: (timestamp)
-- created_at: (timestamp)

---

-- Check 2: Admin profile with correct role
SELECT 
  p.id,
  p.full_name,
  p.whatsapp_number,
  p.role,
  p.is_active,
  u.email
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin';

-- Expected output:
-- id: (UUID)
-- full_name: Ghadwa Admin
-- whatsapp_number: +201109318581
-- role: admin
-- is_active: true
-- email: admin@ghadwa.com

---

-- Check 3: Sample data (chefs and products)
SELECT 
  'chefs' as entity,
  COUNT(*) as count,
  MAX(created_at) as latest
FROM public.chefs
WHERE is_active = true

UNION ALL

SELECT 
  'products',
  COUNT(*),
  MAX(created_at)
FROM public.products
WHERE is_active = true;

-- Expected output:
-- chefs     | 3 | (recent timestamp)
-- products  | 9 | (recent timestamp)

-- If any of these show 0, you need to run ADD_SAMPLE_DATA.sql
