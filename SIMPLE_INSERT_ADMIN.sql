-- ============================================================================
-- SIMPLE INSERT ADMIN USER - SQL SCRIPT
-- ============================================================================
-- ⚠️ WARNING: This will create the user, but LOGIN WILL LIKELY FAIL
-- because SQL password hash format doesn't match Supabase Auth format.
-- 
-- If login fails, you MUST use create-admin-via-api.js
-- ============================================================================

-- Delete old user
DELETE FROM public.profiles WHERE id IN (SELECT id FROM auth.users WHERE email = 'admin@ghadwa.com');
DELETE FROM auth.users WHERE email = 'admin@ghadwa.com';

-- Insert new user (set role in metadata so trigger uses it)
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
  aud,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@ghadwa.com',
  crypt('Admin@Ghadwa#123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Ghadwa Admin","role":"admin"}'::jsonb, -- Set role here for trigger
  NOW(),
  NOW(),
  'authenticated',
  'authenticated'
) RETURNING id;

-- Update profile created by trigger (trigger should have created it with role from metadata)
-- If trigger didn't create it, this will create it
INSERT INTO public.profiles (
  id,
  full_name,
  whatsapp_number,
  delivery_address,
  role,
  is_active,
  created_at,
  updated_at
)
SELECT 
  u.id,
  'Ghadwa Admin',
  '+201109318581',
  'طنطا، مصر',
  'admin', -- Must be one of: 'customer', 'admin', 'chef'
  true,
  NOW(),
  NOW()
FROM auth.users u
WHERE u.email = 'admin@ghadwa.com'
ON CONFLICT (id) DO UPDATE
SET 
  role = 'admin', -- Update to admin if trigger created it with wrong role
  full_name = 'Ghadwa Admin',
  whatsapp_number = '+201109318581',
  delivery_address = 'طنطا، مصر',
  is_active = true,
  updated_at = NOW();

-- Verify
SELECT 
  u.email,
  u.email_confirmed_at IS NOT NULL as confirmed,
  p.role,
  p.is_active
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@ghadwa.com';

-- ============================================================================
-- ⚠️ IF LOGIN FAILS (which it probably will):
-- ============================================================================
-- Use create-admin-via-api.js - it's the only reliable method!
-- ============================================================================

