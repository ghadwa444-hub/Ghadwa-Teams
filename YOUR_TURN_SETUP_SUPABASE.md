# 🎯 YOUR TURN: Supabase Setup Instructions

## ✅ What Has Been Completed

I've successfully implemented the following:

### 1. Database Schema & Migration Script ✓
- Created comprehensive SQL migration: `supabase/migrations/001_initial_schema.sql`
- Includes all tables: profiles, chefs, products, orders, order_items, admin_settings
- Row Level Security (RLS) enabled on all tables
- Automated triggers for timestamps and profile creation

### 2. Authentication System ✓
- Supabase Auth integration: `services/auth.service.ts`
- Session management with auto-refresh
- Login modal updated to use real authentication
- Logout functionality with session cleanup

### 3. Data Services ✓
- Complete CRUD operations: `services/supabase.data.service.ts`
- Methods for chefs, products, orders, and settings
- Proper error handling and logging

### 4. Security ✓
- Protected routes component created
- RLS policies for customer/admin separation
- Secure password storage via Supabase

### 5. Dependencies ✓
- `@supabase/supabase-js` installed and configured
- TypeScript types defined for all database models

---

## 🚀 NOW IT'S YOUR TURN - Run These SQL Queries

Follow these steps **in order** in your Supabase Dashboard:

### Step 1: Open Supabase SQL Editor

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your **Ghadwa** project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

---

### Step 2: Run Main Migration Script

**Copy this entire script and paste it into SQL Editor, then click RUN:**

```sql
-- ============================================================================
-- COPY THE ENTIRE CONTENTS OF:
-- supabase/migrations/001_initial_schema.sql
-- ============================================================================
-- (This file is in your project at: e:\Programming\Ghadwa-Teams\supabase\migrations\001_initial_schema.sql)
-- Open that file, copy ALL the SQL code, paste it here, and click RUN
```

**Expected Result:**
```
Success. No rows returned
```

**What this does:**
- Creates 6 tables (profiles, chefs, products, orders, order_items, admin_settings)
- Enables RLS on all tables
- Creates security policies
- Sets up automated triggers
- Seeds initial admin settings

---

### Step 3: Verify Tables Were Created

Run this query to check:

```sql
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected Output:** You should see 6 tables:
```
public | admin_settings | true
public | chefs         | true
public | order_items   | true
public | orders        | true
public | products      | true
public | profiles      | true
```

---

### Step 4: Create Your First Admin User

#### 4.1 - Create User in Authentication Panel

1. Go to **Authentication → Users** (left sidebar)
2. Click **Add User** → **Create new user**
3. Fill in:
   - **Email**: `admin@ghadwa.com` (or your email)
   - **Password**: Choose a strong password (min 6 characters)
   - **Auto Confirm User**: ✅ **CHECK THIS BOX**
4. Click **Create User**
5. **COPY THE USER ID** (the UUID that appears in the list)

#### 4.2 - Make User Admin

Go back to SQL Editor and run this (replace `YOUR_USER_ID`):

```sql
UPDATE public.profiles
SET 
  role = 'admin',
  full_name = 'Ghadwa Admin',
  whatsapp_number = '+201109318581',
  delivery_address = 'طنطا، مصر'
WHERE id = 'YOUR_USER_ID';
```

**Example (with a real UUID):**
```sql
UPDATE public.profiles
SET 
  role = 'admin',
  full_name = 'Ghadwa Admin',
  whatsapp_number = '+201109318581',
  delivery_address = 'طنطا، مصر'
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
```

#### 4.3 - Verify Admin Was Created

```sql
SELECT id, full_name, whatsapp_number, role, is_active
FROM public.profiles
WHERE role = 'admin';
```

**Expected Output:**
```
id                                   | full_name    | whatsapp_number | role  | is_active
-------------------------------------|--------------|-----------------|-------|----------
your-uuid-here                       | Ghadwa Admin | +201109318581   | admin | true
```

---

### Step 5: (OPTIONAL) Add Sample Test Data

If you want to test with sample chefs and products:

#### 5.1 - Insert Sample Chefs

```sql
INSERT INTO public.chefs (chef_name, specialty, description, image_url, rating)
VALUES
  ('ماما فاطمة', 'أكل مصري تقليدي', 'أحلى أكل بيتي من مطبخ مصري أصيل', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c', 4.8),
  ('شيف حسن', 'مشويات ومندي', 'متخصص في المشويات والأرز البخاري', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1', 4.9),
  ('خالة نادية', 'محاشي وطواجن', 'محاشي وطواجن بنكهة البيت', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d', 4.7);
```

#### 5.2 - Get Chef IDs

```sql
SELECT id, chef_name FROM public.chefs;
```

**Copy the IDs from the output** - you'll need them for the next step.

#### 5.3 - Insert Sample Products

Replace `CHEF_ID_1`, `CHEF_ID_2`, `CHEF_ID_3` with the actual UUIDs from Step 5.2:

```sql
INSERT INTO public.products (chef_id, title, description, price, category, stock_quantity, preparation_time)
VALUES
  -- Chef 1 products (Fatima)
  ('CHEF_ID_1', 'محشي مشكل', 'باذنجان، كوسة، وفلفل بخلطة الرز السرية', 150.00, 'main', 100, 45),
  ('CHEF_ID_1', 'ملوخية وفراخ', 'نص فرخة محمرة مع ملوخية بطشة الكزبرة', 180.00, 'main', 50, 60),
  ('CHEF_ID_1', 'كشري مصري', 'عدس، رز، ومكرونة مع صلصة', 60.00, 'main', 200, 20),
  
  -- Chef 2 products (Hassan)
  ('CHEF_ID_2', 'نص تيس مندي', 'لحم خروف طري مع رز مندي بخاري', 450.00, 'main', 20, 120),
  ('CHEF_ID_2', 'فراخ مشوية', 'فرخة كاملة مشوية مع صلصة الثوم', 140.00, 'main', 60, 50),
  ('CHEF_ID_2', 'كباب حلة', 'لحم بقري مفروم مع صلصة', 120.00, 'main', 80, 40),
  
  -- Chef 3 products (Nadia)
  ('CHEF_ID_3', 'مكرونة بشاميل', 'مكرونة مع لحمة وبشاميل غني', 120.00, 'main', 100, 35),
  ('CHEF_ID_3', 'مسقعة باللحمة', 'باذنجان رومي مع صلصة طماطم', 90.00, 'main', 80, 40),
  ('CHEF_ID_3', 'فتة كوارع', 'فتة بالخل والثوم مع كوارع مخلية', 250.00, 'main', 30, 90);
```

---

### Step 6: Final Verification

Run this to see your data:

```sql
-- Check all tables have data
SELECT 
  'profiles' as table_name, COUNT(*) as count FROM public.profiles
UNION ALL
SELECT 'chefs', COUNT(*) FROM public.chefs
UNION ALL
SELECT 'products', COUNT(*) FROM public.products
UNION ALL
SELECT 'admin_settings', COUNT(*) FROM public.admin_settings;
```

**Expected Output:**
```
table_name      | count
----------------|------
profiles        | 1
chefs           | 3 (if you added sample data)
products        | 9 (if you added sample data)
admin_settings  | 7
```

---

## 🧪 Test Your Setup

### Test 1: Login to Your App

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Open your app** in the browser

3. **Click the admin badge** (أكل بيتي 100% at the top)

4. **Enter credentials:**
   - Email: `admin@ghadwa.com` (or whatever you used)
   - Password: (the password you set)

5. **Click تسجيل الدخول**

**Expected Result:**
- ✅ Should redirect to admin dashboard
- ✅ No errors in browser console
- ✅ You should see "Ghadwa Admin" or your name

---

## 🎯 What Happens After This

Once you've completed these steps:

1. **Authentication is LIVE** ✓
   - Login/logout works with real Supabase Auth
   - Sessions are persisted
   - Admin access is protected

2. **Database is READY** ✓
   - All tables created
   - RLS security enabled
   - Sample data loaded (optional)

3. **Next Steps**:
   - I'll update the API service to fetch data from Supabase instead of localStorage
   - Orders will be saved to the real database
   - Admin panel will manage real data

---

## 🆘 Troubleshooting

### Problem: "Invalid API key"
**Check:** Your `.env` file has the correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Problem: Login says "بيانات الدخول غير صحيحة"
**Check:** 
1. User was created in Authentication → Users
2. Profile was updated to `role = 'admin'`
3. Password is correct

### Problem: Tables not created
**Check:** You ran the full migration script from `001_initial_schema.sql`

---

## 📞 When You're Done

**Reply with:** "✅ Done" or "✅ SQL queries completed"

Then I'll:
1. Update the data fetching to use Supabase
2. Make admin panel work with real database
3. Implement order creation in Supabase

---

**Full migration guide also available in:** `SUPABASE_MIGRATION_GUIDE.md`
