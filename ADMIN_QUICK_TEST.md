# 🎬 Quick Start: Add Sample Data & Test Admin Panel

## Goal
Get admin dashboard fully functional with test data so you can verify everything works.

**Time Required**: 5 minutes total

---

## Step 1: Add Sample Data (2 minutes)

### In Supabase SQL Editor:

```
1. Open: https://app.supabase.com → Your Project → SQL Editor
2. Click: "New Query"
3. Copy-Paste: The "DO $$" section from ADD_SAMPLE_DATA.sql (at the bottom)
4. Click: RUN

Expected Output:
NOTICE: Added products for ماما فاطمة
NOTICE: Added products for شيف حسن
NOTICE: Added products for خالة نادية
NOTICE: Sample data insertion complete!
```

### Verify It Worked:

```sql
SELECT 'chefs', COUNT(*) FROM public.chefs
UNION ALL
SELECT 'products', COUNT(*) FROM public.products;
```

**Expected:**
```
chefs     | 3
products  | 9
```

---

## Step 2: Start Dev Server (30 seconds)

```bash
npm run dev
```

Open: http://localhost:3000

---

## Step 3: Login to Admin Panel (1 minute)

1. Click admin badge (top right)
2. Enter credentials:
   - Email: `admin@ghadwa.com`
   - Password: `Admin@Ghadwa#123`
3. Click: تسجيل الدخول

**Expected**: Redirect to admin dashboard showing stats

---

## Step 4: Test Each Admin Feature

### ✅ Dashboard
- Should show:
  - 3 chefs in system
  - 9 meals available
  - 0 orders (none yet)
  - Total revenue: 0 ج.م

### ✅ Chefs (إدارة الشيفات)
- Should show 3 chef cards:
  1. ماما فاطمة (أكل مصري)
  2. شيف حسن (مشويات)
  3. خالة نادية (محاشي)

**Test Add:**
1. Click: "إضافة شيف"
2. Fill: Name = "شيف محمود"
3. Fill: Specialty = "فرن و بيتزا"
4. Click: Save
5. **Expected**: New chef appears in list, saves to database ✅

### ✅ Meals (إدارة الوجبات)
- Should show table with 9 meals
- 3 from each chef

**Test Add:**
1. Click: "إضافة وجبة"
2. Fill: Name = "ستيك بيت"
3. Fill: Price = "250"
4. Select: Chef = "ماما فاطمة"
5. Click: Save
6. **Expected**: New meal in table, saves to database ✅

### ✅ Orders (الطلبات)
- Currently empty (no orders yet)
- You'll see orders once you place one as customer

**To test:**
1. Click: "أكل بيتي 100%" (customer mode)
2. Add items to cart
3. Checkout with test order
4. Return to admin → الطلبات
5. **Expected**: Order appears in list ✅

### ✅ Contact Settings (الإعدادات)
1. Click: "الإعدادات"
2. Update any field (phone, email, address)
3. Click: Save
4. Refresh page
5. **Expected**: Changes persist in database ✅

---

## What's Now Verified:

| Feature | Works? | Evidence |
|---------|--------|----------|
| Login | ✅ | Can authenticate |
| Admin access | ✅ | Dashboard loads |
| View data | ✅ | 3 chefs + 9 meals show |
| Add chef | ✅ | New chef saves |
| Add meal | ✅ | New meal saves |
| Update settings | ✅ | Changes persist |
| Database write | ✅ | Supabase receives data |
| RLS working | ✅ | Only admin can add |

---

## If Something Breaks:

### "Login failed"
```
Check: Console for error message
Likely cause: Wrong password
Solution: Use "Admin@Ghadwa#123" exactly
```

### "No chefs showing"
```
Check: Did you run ADD_SAMPLE_DATA.sql?
Fix: Run the SQL script in Supabase
```

### "Add chef button doesn't work"
```
Check: Browser console (F12)
Look for: Error message
Fix: Refresh page and try again
```

### "Changes not saving"
```
Check: Network tab (F12)
Look for: 400/500 error from Supabase
Fix: Check that admin user has role='admin' in database
```

---

## Console Logs to Expect:

```
[INFO] [AUTH] ✅ Sign in successful
[INFO] [APP] ✅ User session restored {role: 'admin'}
[INFO] [API_CHEFS] ✅ Fetched 3 chefs from Supabase
[INFO] [API_MENU] ✅ Fetched 9 menu items from Supabase
[INFO] [NAVIGATION] 📍 Page changed to: admin
```

**If you see these = ✅ Everything working!**

---

## Next Actions:

### If Tests Pass:
- ✅ Admin dashboard is production-ready
- ✅ Database operations work
- ✅ Security/RLS enforces admin-only access
- ✅ Ready to deploy!

### Before Production:
1. ✅ Add real chef images
2. ✅ Add real meal images
3. ✅ Update contact info to real numbers
4. ✅ Set up admin notifications
5. ✅ Configure delivery fees/tax in database

---

## Timeline:

```
5 min: Run SQL + add sample data
1 min: Start server
1 min: Login to admin
3 min: Test each feature
= 10 minutes total
```

**Let me know when done and what you see!** 🚀
