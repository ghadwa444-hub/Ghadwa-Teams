-- ============================================================================
-- SIMPLE DELETE USER - Fixed for correct schema
-- ============================================================================
-- This deletes the corrupted admin user
-- Run this, wait 10 seconds, then create user via API
-- ============================================================================

-- Delete corrupted user
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Find the user
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@ghadwa.com' 
  LIMIT 1;

  IF admin_user_id IS NOT NULL THEN
    -- Delete from profiles
    DELETE FROM public.profiles WHERE id = admin_user_id;
    
    -- Delete order_items for this user's orders
    DELETE FROM public.order_items WHERE order_id IN (
      SELECT id FROM public.orders WHERE customer_id = admin_user_id
    );
    
    -- Delete orders for this user (uses customer_id)
    DELETE FROM public.orders WHERE customer_id = admin_user_id;
    
    -- Delete from auth.users
    DELETE FROM auth.users WHERE id = admin_user_id;
    
    RAISE NOTICE '✅ User deleted successfully!';
    RAISE NOTICE '';
    RAISE NOTICE 'Now wait 10 seconds, then create user via API';
  ELSE
    RAISE NOTICE 'ℹ️ No user found';
  END IF;
END $$;

-- Verify deletion
SELECT COUNT(*) as remaining 
FROM auth.users 
WHERE email = 'admin@ghadwa.com';
-- Should return 0




