## 🚨 CRITICAL FIX - 500 Errors & Login Issues

Your app is getting 500 errors on all Supabase queries and can't log in. This is caused by **broken RLS (Row Level Security) policies** in the database.

---

## ✅ STEP 1: Run the Critical Fix Script

**THIS IS ESSENTIAL TO GET EVERYTHING WORKING**

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Go to your **Ghadwa** project
3. Navigate to **SQL Editor** (left sidebar)
4. Click **"New Query"** (or **"+"** button)
5. **Copy the ENTIRE content** of this file:
   - `CRITICAL_FIX_RLS_AND_ADMIN.sql`

6. **Paste it** into the SQL Editor
7. Click **"Run"** (green button at bottom-right)
8. **Wait for it to complete** (should show ✅ success messages)

---

## 🔍 What This Script Does

```
✅ Drops broken RLS policies
✅ Creates CORRECT RLS policies that:
   - Allow customers to browse products & chefs (public read)
   - Allow admins to manage everything
   - Protect private data with proper checks
✅ Creates admin user (admin@ghadwa.com / Admin@Ghadwa#123)
✅ Creates admin profile with correct role
✅ Verifies everything is working
```

---

## 🧪 STEP 2: Verify It Worked

After running the script, you should see in the SQL output:

```
✅ Admin user exists in auth.users
✅ Admin profile exists

RLS Policies:
 schemaname | tablename    | policy_count
 public     | profiles     | 5
 public     | chefs        | 2
 public     | products     | 2
 public     | orders       | 4
 public     | order_items  | 3
 public     | admin_settings | 3

🎉 All fixes applied!
```

---

## 🚀 STEP 3: Test in Your App

1. Stop your dev server (Ctrl+C if running)
2. Clear browser cache:
   - Press F12 → Application tab
   - Delete all localStorage and cookies
   - Close dev tools

3. Start the app: `npm run dev`

4. You should see:
   - ✅ Chefs loading (now with real data from database)
   - ✅ Products/Menu loading (no 500 errors)
   - ✅ Contact settings loading
   - ❌ **Still showing 0 chefs/products?** That's OK - you need to add sample data (see Step 4)

5. Click **Login** button:
   - Email: `admin@ghadwa.com`
   - Password: `Admin@Ghadwa#123`
   - Should work now! ✅

---

## 📊 STEP 4: Add Sample Data (Optional, Makes App Look Better)

The app works, but it looks empty. Let's add sample data:

1. **Stay in SQL Editor** in Supabase
2. **Create new query**
3. **Copy content** from: `ADD_SAMPLE_DATA.sql`
4. **Paste & Run** it
5. Should show:
   - ✅ Created 3 chefs
   - ✅ Created 9 menu items
   - ✅ All data inserted successfully

6. **Refresh your app** - now you'll see chefs and products! 🎉

---

## 📋 What Changed & Why

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| 500 errors on products, chefs, orders | RLS policies were blocking all queries | Created proper policies that allow public read for browsing |
| "Invalid login credentials" | Admin user didn't exist in auth.users table | Script creates admin user with bcrypt-hashed password |
| Admin dashboard not working | No admin profile with correct role | Script creates admin profile with role='admin' |
| 0 chefs/products showing | Database empty (no sample data) | Run ADD_SAMPLE_DATA.sql to populate |

---

## ⚠️ If It Still Doesn't Work

### If you see "Cannot find column X" errors:
Run `FIX_SCHEMA.sql` - this adds missing columns to your tables

### If you see "Duplicate key violation" for admin:
It means the admin already exists. That's OK - the script handles it gracefully.

### If login still fails:
1. Check you're using correct credentials: `admin@ghadwa.com` / `Admin@Ghadwa#123`
2. Look at browser console (F12) for exact error message
3. Report the error message

### If you still see 500 errors:
1. Open Supabase SQL Editor
2. Run this diagnostic query:
```sql
SELECT tablename FROM pg_policies GROUP BY tablename;
```
Should return: admin_settings, chefs, order_items, orders, products, profiles

If any table is missing policies, RLS is still broken.

---

## 🎯 Summary of Steps

1. ✅ Open Supabase SQL Editor
2. ✅ Run `CRITICAL_FIX_RLS_AND_ADMIN.sql`
3. ✅ Verify output shows success
4. ✅ Refresh your app
5. ✅ Test login with admin@ghadwa.com / Admin@Ghadwa#123
6. ✅ (Optional) Run ADD_SAMPLE_DATA.sql for sample data
7. ✅ Refresh app again to see chefs/products

---

## 📞 Quick Reference

**Credentials:**
- Email: admin@ghadwa.com
- Password: Admin@Ghadwa#123

**Files to run (in order):**
1. CRITICAL_FIX_RLS_AND_ADMIN.sql ← **DO THIS FIRST**
2. ADD_SAMPLE_DATA.sql ← Optional but recommended
3. FIX_SCHEMA.sql ← Only if you get "cannot find column" errors

---

✅ **After running the fix script, your app should be fully functional!**
