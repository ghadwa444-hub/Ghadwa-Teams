-- ============================================================================
-- VERIFY AND FIX ADMIN PROFILE
-- ============================================================================
-- Check if profile exists and fix it if needed
-- ============================================================================

-- Check user and profile
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  p.id as profile_id,
  p.role,
  p.is_active,
  p.full_name,
  CASE 
    WHEN u.id IS NULL THEN '❌ User not found'
    WHEN p.id IS NULL THEN '❌ Profile not found'
    WHEN p.role != 'admin' THEN '❌ Profile not admin'
    WHEN p.is_active != true THEN '❌ Profile not active'
    ELSE '✅ Everything looks good'
  END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@ghadwa.com';

-- Fix profile if it doesn't exist or is wrong
DO $$
DECLARE
  admin_user_id UUID;
  profile_exists BOOLEAN;
BEGIN
  -- Get user ID
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@ghadwa.com'
  LIMIT 1;

  IF admin_user_id IS NULL THEN
    RAISE NOTICE '❌ User not found!';
    RETURN;
  END IF;

  -- Check if profile exists
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = admin_user_id) INTO profile_exists;

  IF NOT profile_exists THEN
    -- Create profile
    INSERT INTO public.profiles (
      id,
      full_name,
      whatsapp_number,
      delivery_address,
      role,
      is_active,
      created_at,
      updated_at
    ) VALUES (
      admin_user_id,
      'Ghadwa Admin',
      '+201109318581',
      'طنطا، مصر',
      'admin',
      true,
      NOW(),
      NOW()
    );
    RAISE NOTICE '✅ Profile created';
  ELSE
    -- Update profile to ensure it's admin
    UPDATE public.profiles
    SET 
      role = 'admin',
      full_name = 'Ghadwa Admin',
      whatsapp_number = '+201109318581',
      delivery_address = 'طنطا، مصر',
      is_active = true,
      updated_at = NOW()
    WHERE id = admin_user_id;
    RAISE NOTICE '✅ Profile updated to admin';
  END IF;
END $$;

-- Verify again
SELECT 
  u.email,
  p.role,
  p.is_active,
  p.full_name,
  '✅ Ready to login' as status
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@ghadwa.com'
  AND p.role = 'admin'
  AND p.is_active = true;




