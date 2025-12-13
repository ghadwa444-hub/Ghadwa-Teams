# 🚀 Supabase Migration Guide for Ghadwa

## ✅ Prerequisites Checklist

Before starting, make sure you have:

- [ ] Supabase account created
- [ ] Ghadwa project created in Supabase
- [ ] `.env` file updated with Supabase credentials:
  ```env
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key-here
  ```
- [ ] `@supabase/supabase-js` installed (already done ✓)

---

## 📋 Step-by-Step Migration Instructions

### Step 1: Open Supabase SQL Editor

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your **Ghadwa** project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

---

### Step 2: Run Main Migration Script

1. Open the file: `supabase/migrations/001_initial_schema.sql`
2. **Copy the entire contents** of that file
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press `Ctrl/Cmd + Enter`)
5. Wait for the query to complete (should take 5-10 seconds)

**Expected Result:**
```
Success. No rows returned
```

---

### Step 3: Verify Tables Created

Run this verification query in SQL Editor:

```sql
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected Output:** You should see 6 tables, all with `rowsecurity = true`:
- `admin_settings`
- `chefs`
- `order_items`
- `orders`
- `products`
- `profiles`

---

### Step 4: Create First Admin User

#### 4.1: Create User in Authentication

1. Go to **Authentication → Users** in Supabase Dashboard
2. Click **Add User** → **Create new user**
3. Fill in:
   - **Email**: `admin@ghadwa.com` (or your preferred admin email)
   - **Password**: Create a strong password (minimum 6 characters)
   - **Auto Confirm User**: ✅ Check this box
4. Click **Create User**
5. **Copy the User ID** (UUID) that appears in the users list

#### 4.2: Make User Admin

1. Go back to **SQL Editor**
2. Run this query (replace `YOUR_USER_ID` with the UUID you copied):

```sql
UPDATE public.profiles
SET 
  role = 'admin',
  full_name = 'Ghadwa Admin',
  whatsapp_number = '+201109318581',
  delivery_address = 'طنطا، مصر'
WHERE id = 'YOUR_USER_ID';
```

#### 4.3: Verify Admin Created

```sql
SELECT id, full_name, whatsapp_number, role, is_active
FROM public.profiles
WHERE role = 'admin';
```

**Expected Output:**
```
id                                   | full_name    | whatsapp_number  | role  | is_active
-------------------------------------|--------------|------------------|-------|----------
your-uuid-here                       | Ghadwa Admin | +201109318581    | admin | true
```

---

### Step 5: Seed Sample Data (Optional)

If you want to add test chefs and products:

#### 5.1: Insert Sample Chefs

```sql
INSERT INTO public.chefs (chef_name, specialty, description, image_url, rating)
VALUES
  ('ماما فاطمة', 'أكل مصري تقليدي', 'أحلى أكل بيتي من مطبخ مصري أصيل', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c', 4.8),
  ('شيف حسن', 'مشويات ومندي', 'متخصص في المشويات والأرز البخاري', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1', 4.9),
  ('خالة نادية', 'محاشي وطواجن', 'محاشي وطواجن بنكهة البيت', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d', 4.7);
```

#### 5.2: Get Chef IDs

```sql
SELECT id, chef_name FROM public.chefs;
```

Copy the IDs for the next step.

#### 5.3: Insert Sample Products

Replace `CHEF_ID_1`, `CHEF_ID_2`, `CHEF_ID_3` with actual IDs from the previous query:

```sql
INSERT INTO public.products (chef_id, title, description, price, category, stock_quantity, preparation_time)
VALUES
  -- Chef 1 products
  ('CHEF_ID_1', 'محشي مشكل', 'باذنجان، كوسة، وفلفل بخلطة الرز السرية', 150.00, 'main', 100, 45),
  ('CHEF_ID_1', 'ملوخية وفراخ', 'نص فرخة محمرة مع ملوخية', 180.00, 'main', 50, 60),
  
  -- Chef 2 products
  ('CHEF_ID_2', 'نص تيس مندي', 'لحم خروف مع رز مندي', 450.00, 'main', 20, 120),
  ('CHEF_ID_2', 'فراخ مشوية', 'فرخة كاملة مشوية', 140.00, 'main', 60, 50),
  
  -- Chef 3 products
  ('CHEF_ID_3', 'مكرونة بشاميل', 'مكرونة مع لحمة وبشاميل', 120.00, 'main', 100, 35),
  ('CHEF_ID_3', 'مسقعة باللحمة', 'باذنجان رومي مع صلصة', 90.00, 'main', 80, 40);
```

---

### Step 6: Verify Everything Works

#### Check Row Level Security

```sql
SELECT 
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

You should see multiple policies for each table.

#### Check Data Counts

```sql
SELECT 
  'profiles' as table_name, COUNT(*) as row_count FROM public.profiles
UNION ALL
SELECT 'chefs', COUNT(*) FROM public.chefs
UNION ALL
SELECT 'products', COUNT(*) FROM public.products
UNION ALL
SELECT 'admin_settings', COUNT(*) FROM public.admin_settings;
```

---

### Step 7: Test Login in Your App

1. Make sure your `.env` file is correct
2. Restart your dev server:
   ```bash
   npm run dev
   ```
3. Open the app in your browser
4. Click the **Admin Login** badge (أكل بيتي 100%)
5. Enter the admin email and password you created
6. Click **تسجيل الدخول**

**Expected Result:**
- Should redirect to admin dashboard
- No errors in console
- User session persisted

---

## 🔧 Troubleshooting

### Problem: "Invalid API key" error

**Solution:** Check your `.env` file:
- Make sure `VITE_SUPABASE_URL` starts with `https://`
- Make sure `VITE_SUPABASE_ANON_KEY` is the **anon/public** key, not the service key

### Problem: "Row Level Security policy violation"

**Solution:** Make sure RLS policies were created correctly:
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

All tables should have `rowsecurity = true`.

### Problem: Login says "بيانات الدخول غير صحيحة"

**Solution:**
1. Make sure the user was created in Authentication → Users
2. Make sure the profile was updated to `role = 'admin'`
3. Check browser console for detailed error messages

### Problem: Profile not created automatically

**Solution:** Check if the trigger exists:
```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name = 'on_auth_user_created';
```

If missing, re-run the migration script.

---

## 🎯 Next Steps After Migration

1. **Update API calls** - The app currently uses localStorage, we need to switch to Supabase
2. **Add real-time subscriptions** - Listen to order status changes
3. **Implement file uploads** - Use Supabase Storage for product images
4. **Add email templates** - Configure Supabase Auth email templates
5. **Deploy to production** - Update Vercel environment variables

---

## 📞 Support

If you encounter any issues:

1. Check Supabase Dashboard → Logs for detailed error messages
2. Check browser console for client-side errors
3. Verify your `.env` file is correct
4. Make sure you ran all migration scripts in order

---

## ✅ Migration Complete!

Once all steps are done, you have:

- ✅ Secure database with RLS enabled
- ✅ Admin user created and verified
- ✅ Sample data seeded (optional)
- ✅ Authentication working
- ✅ Ready to replace localStorage with real database

**You're ready to proceed with updating the API calls to use Supabase!**
