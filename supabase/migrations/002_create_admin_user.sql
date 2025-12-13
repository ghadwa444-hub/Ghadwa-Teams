-- ============================================================================
-- Create Admin User Manually via SQL
-- ============================================================================
-- This script creates an admin user directly in the database
-- Use this if the Supabase UI "Add User" button gives errors

-- Step 1: Create user in auth.users table
-- Replace 'YOUR_PASSWORD_HERE' with your desired password
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at,
  is_anonymous
) VALUES (
  gen_random_uuid(), -- Generate a random UUID for the user
  '00000000-0000-0000-0000-000000000000', -- Default instance ID
  'admin@ghadwa.com', -- Admin email (change this if you want)
  crypt('Admin@123', gen_salt('bf')), -- Password: Admin@123 (CHANGE THIS!)
  NOW(), -- Email confirmed now
  NULL,
  '',
  NULL,
  '',
  NULL,
  '',
  '',
  NULL,
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Ghadwa Admin"}',
  false,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL,
  false,
  NULL,
  false
) RETURNING id;

-- The trigger should automatically create the profile, but let's verify
-- Wait a moment, then run this query to get the user ID:
SELECT id, email FROM auth.users WHERE email = 'admin@ghadwa.com';

-- Step 2: Update the profile to make this user an admin
-- Copy the ID from the previous query and use it in the WHERE clause
-- Or use this query that automatically finds the user:
UPDATE public.profiles
SET 
  role = 'admin',
  full_name = 'Ghadwa Admin',
  whatsapp_number = '+201109318581',
  delivery_address = 'طنطا، مصر',
  is_active = true
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@ghadwa.com');

-- Step 3: Verify the admin user was created
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  p.full_name,
  p.role,
  p.whatsapp_number,
  p.is_active
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@ghadwa.com';

-- Expected output:
-- id: (some UUID)
-- email: admin@ghadwa.com
-- email_confirmed_at: (current timestamp)
-- full_name: Ghadwa Admin
-- role: admin
-- whatsapp_number: +201109318581
-- is_active: true
