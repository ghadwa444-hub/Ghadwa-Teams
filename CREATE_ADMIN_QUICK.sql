-- ============================================================================
-- QUICK ADMIN USER CREATION
-- ============================================================================
-- Copy and paste this ENTIRE script into Supabase SQL Editor and click RUN
-- ⚠️ CHANGE THE PASSWORD BEFORE RUNNING!

-- Create admin user with email: admin@ghadwa.com
-- Default password: Admin@123 (CHANGE THIS!)

DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Insert user into auth.users
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
    crypt('Admin@Ghadwa#123', gen_salt('bf')), -- ⚠️ CHANGE PASSWORD HERE!
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
  ) RETURNING id INTO new_user_id;

  RAISE NOTICE 'User created with ID: %', new_user_id;

  -- Update profile to admin role
  UPDATE public.profiles
  SET 
    role = 'admin',
    full_name = 'Ghadwa Admin',
    whatsapp_number = '+201109318581',
    delivery_address = 'طنطا، مصر',
    is_active = true
  WHERE id = new_user_id;

  RAISE NOTICE 'Profile updated to admin role';

END $$;

-- Verify the user was created
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at as confirmed,
  p.full_name,
  p.role,
  p.whatsapp_number,
  p.is_active as active
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@ghadwa.com';

-- ============================================================================
-- LOGIN CREDENTIALS:
-- Email: admin@ghadwa.com
-- Password: Admin@123 (or whatever you changed it to above)
-- ============================================================================
