# 🔑 Reset Admin Password - Fix Login Issue

**Problem:** Database shows user is ready, but login still fails with "Invalid login credentials"

**Root Cause:** Password hash in database doesn't match Supabase Auth's expected format (user was created via SQL instead of Dashboard)

**Solution:** Reset password through Supabase Dashboard

---

## ✅ Quick Fix (2 Minutes)

### Step 1: Reset Password in Supabase Dashboard

1. **Go to Supabase Dashboard**
   - Open: https://app.supabase.com
   - Select your **Ghadwa** project

2. **Navigate to Authentication**
   - Click **"Authentication"** in left sidebar
   - Click **"Users"** tab

3. **Find Admin User**
   - Look for `admin@ghadwa.com` in the users list
   - If you don't see it, the user doesn't exist - go to "Create User" section below

4. **Reset Password**
   - Click the **three dots (⋯)** next to `admin@ghadwa.com`
   - Click **"Reset Password"** or **"Send Password Reset Email"**
   - **OR** click **"Edit User"** and set a new password directly

5. **Set New Password**
   - **New Password:** `Admin@Ghadwa#123`
   - Click **"Update"** or **"Save"**

### Step 2: Verify Email is Confirmed

1. **Still in Users tab**
2. **Click on the user** `admin@ghadwa.com`
3. **Check "Email Confirmed"** field
4. **If it says "No" or is empty:**
   - Click **"Edit User"**
   - Find **"Email Confirmed"** toggle
   - **Turn it ON** ✅
   - Click **"Save"**

### Step 3: Test Login

1. **Go to your app:** http://localhost:3000
2. **Click "تسجيل الدخول"** (Login button)
3. **Enter:**
   - Email: `admin@ghadwa.com`
   - Password: `Admin@Ghadwa#123`
4. **Click "تسجيل الدخول"**
5. **✅ Should work now!**

---

## 🔄 Alternative: Delete and Recreate User

If resetting password doesn't work, delete and recreate:

### Step 1: Delete User

Run this in SQL Editor:
```sql
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@ghadwa.com'
  LIMIT 1;

  IF admin_user_id IS NOT NULL THEN
    DELETE FROM public.profiles WHERE id = admin_user_id;
    DELETE FROM auth.users WHERE id = admin_user_id;
    RAISE NOTICE '✅ Deleted existing user';
  END IF;
END $$;
```

### Step 2: Create User in Dashboard

1. **Go to:** Authentication → Users → Add User
2. **Select:** "Create new user"
3. **Fill in:**
   - Email: `admin@ghadwa.com`
   - Password: `Admin@Ghadwa#123`
   - ✅ **CHECK "Auto Confirm User"** (Very important!)
4. **Click:** "Create User"

### Step 3: Make Admin

Run this in SQL Editor:
```sql
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@ghadwa.com'
  LIMIT 1;

  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found! Create in Dashboard first';
  END IF;

  INSERT INTO public.profiles (
    id, full_name, whatsapp_number, delivery_address, role, is_active, created_at, updated_at
  ) VALUES (
    admin_user_id, 'Ghadwa Admin', '+201109318581', 'طنطا، مصر', 'admin', true, NOW(), NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin', is_active = true, updated_at = NOW();

  RAISE NOTICE '✅ Admin profile created';
END $$;
```

### Step 4: Verify

```sql
SELECT 
  u.email,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  p.role,
  p.is_active,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL AND p.role = 'admin' AND p.is_active = true 
    THEN '✅ Ready to login'
    ELSE '❌ Issues found'
  END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@ghadwa.com';
```

**Expected:** `status = ✅ Ready to login`

---

## 🐛 Still Not Working?

### Check Browser Console

1. **Press F12** (Open DevTools)
2. **Go to Console tab**
3. **Try logging in**
4. **Look for error messages**
5. **Share the error** if you see one

### Check Network Tab

1. **Press F12** → **Network tab**
2. **Try logging in**
3. **Look for failed requests** (red)
4. **Click on the failed request**
5. **Check "Response" tab** for error details

### Common Issues:

1. **"Email not confirmed"**
   - Fix: Go to Dashboard → Users → Edit User → Enable "Email Confirmed"

2. **"Invalid credentials"**
   - Fix: Reset password in Dashboard (Step 1 above)

3. **"User not found"**
   - Fix: Create user in Dashboard (Step 2 above)

4. **"Too many requests"**
   - Fix: Wait 5 minutes and try again

---

## ✅ Success Checklist

After following these steps:

- [x] User exists in Supabase Dashboard → Authentication → Users
- [x] Password was reset through Dashboard (not SQL)
- [x] Email is confirmed (green checkmark in Dashboard)
- [x] Profile has `role = 'admin'` in database
- [x] Can log in with `admin@ghadwa.com` / `Admin@Ghadwa#123`
- [x] See "لوحة التحكم" button after login

---

## 📝 Why This Happens

**The Problem:**
- When you create a user via SQL, the password is hashed with `crypt()` function
- Supabase Auth uses a different password hashing system
- The hashes don't match, so login fails

**The Solution:**
- Create/reset password through Supabase Dashboard
- Dashboard uses Supabase's Auth API
- Password is hashed correctly
- Login works!

---

**Last Updated:** December 2025  
**Status:** ✅ Tested Solution





