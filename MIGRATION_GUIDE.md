# 🚀 Database Migration Guide

## Overview
This migration aligns your Supabase database with the frontend component expectations. All changes are **additive and safe** - no data will be lost.

---

## ⚡ Quick Start

### 1. Open Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Select your Ghadwa project
3. Navigate to **SQL Editor** in the left sidebar

### 2. Run Migration
1. Copy the entire contents of `supabase_migration.sql`
2. Paste into the SQL Editor
3. Click **Run** (or press Ctrl/Cmd + Enter)
4. Wait for "Success. No rows returned" message

### 3. Verify Migration
Run this verification query in SQL Editor:
```sql
-- Check new columns exist
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'products' AND column_name IN ('name', 'is_available', 'is_featured', 'is_offer', 'prep_time');

-- Check new tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('promo_codes', 'contact_settings');
```

You should see 5 columns for products and 2 tables.

---

## 📋 What Gets Changed

### ✅ Products Table
| Action | Column | Purpose |
|--------|--------|---------|
| **ADD** | `name` | Frontend uses this (synced with `title`) |
| **ADD** | `is_available` | Frontend uses this (synced with `is_active`) |
| **ADD** | `is_featured` | Best Sellers feature flag |
| **ADD** | `is_offer` | Weekly Offers feature flag |
| **ADD** | `offer_price` | Discounted price for offers |
| **ADD** | `prep_time` | Frontend uses this (synced with `preparation_time`) |

### ✅ Orders Table
| Action | Column | Purpose |
|--------|--------|---------|
| **ADD** | `promo_code` | Store applied promo code |
| **ADD** | `discount_amount` | Store discount value |
| **ADD** | `notes` | Frontend uses this field |

### ✅ Order Items Table
| Action | Column | Purpose |
|--------|--------|---------|
| **ADD** | `total_price` | Frontend uses this (synced with `subtotal`) |

### ✅ Boxes Table
| Action | Column | Purpose |
|--------|--------|---------|
| **ADD** | `image_url` | Frontend uses this (synced with `img`) |
| **ADD** | `description` | Box description text |
| **ADD** | `items_count` | Count of items in box |
| **ADD** | `is_active` | Availability flag |

### ✅ Profiles Table
| Action | Column | Purpose |
|--------|--------|---------|
| **ADD** | `email` | Email address (optional) |
| **ADD** | `phone` | Phone number (in addition to whatsapp_number) |

### ✅ New Tables Created
| Table | Purpose |
|-------|---------|
| **promo_codes** | Discount/promotional codes |
| **contact_settings** | Business contact info (phone, email, social media) |

---

## 🔍 Important Notes

### 1. **Boxes ID Type** 🚨
The boxes table uses `BIGINT` IDs (numbers), **not UUIDs**. The migration script keeps this as-is to avoid breaking existing data.

**Already fixed in code:**
```typescript
// types.ts - CORRECT
interface Box {
  id: number;  // ✅ BIGINT
}
```

All box operations will use numeric IDs.

### 2. **Dual Field Names**
The migration creates dual fields for compatibility:

| Frontend Field | Database Field | Sync |
|---------------|----------------|------|
| `name` | `title` | ✅ Auto-synced |
| `is_available` | `is_active` | ✅ Auto-synced |
| `prep_time` | `preparation_time` | ✅ Auto-synced |
| `image_url` (boxes) | `img` | ✅ Auto-synced |
| `total_price` (order_items) | `subtotal` | ✅ Auto-synced |
| `notes` (orders) | `delivery_notes` | ✅ Auto-synced |

The migration script populates the new fields from existing values.

### 3. **New Features Unlocked** 🎉
After migration, these features will work:
- ✅ Weekly Offers (with discount calculations)
- ✅ Best Sellers filtering
- ✅ Promo code application at checkout
- ✅ Contact settings management
- ✅ Order notes and discounts

---

## 🧪 Testing After Migration

### 1. Test Products
```sql
-- Check if is_offer and is_featured work
SELECT name, price, is_featured, is_offer, offer_price 
FROM products 
LIMIT 5;

-- Update a product to be featured
UPDATE products 
SET is_featured = true 
WHERE id = (SELECT id FROM products LIMIT 1);
```

### 2. Test Promo Codes
```sql
-- Create a test promo code
INSERT INTO promo_codes (code, discount_type, discount_value, min_order_amount)
VALUES ('WELCOME10', 'percentage', 10, 50);

-- Verify it exists
SELECT * FROM promo_codes WHERE code = 'WELCOME10';
```

### 3. Test Contact Settings
```sql
-- Update contact settings
UPDATE contact_settings 
SET phone = '+20123456789',
    email = 'info@ghadwa.com',
    whatsapp = '+20123456789'
WHERE id = (SELECT id FROM contact_settings LIMIT 1);

-- Verify
SELECT * FROM contact_settings;
```

---

## 🐛 Rollback (If Needed)

If something goes wrong, you can remove the added columns:

```sql
-- ⚠️ ROLLBACK SCRIPT - USE ONLY IF NEEDED
BEGIN;

-- Remove added columns from products
ALTER TABLE products 
  DROP COLUMN IF EXISTS name,
  DROP COLUMN IF EXISTS is_available,
  DROP COLUMN IF EXISTS is_featured,
  DROP COLUMN IF EXISTS is_offer,
  DROP COLUMN IF EXISTS offer_price,
  DROP COLUMN IF EXISTS prep_time;

-- Remove added columns from orders
ALTER TABLE orders 
  DROP COLUMN IF EXISTS promo_code,
  DROP COLUMN IF EXISTS discount_amount,
  DROP COLUMN IF EXISTS notes;

-- Remove added columns from order_items
ALTER TABLE order_items 
  DROP COLUMN IF EXISTS total_price;

-- Remove added columns from boxes
ALTER TABLE boxes 
  DROP COLUMN IF EXISTS image_url,
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS items_count,
  DROP COLUMN IF EXISTS is_active;

-- Remove added columns from profiles
ALTER TABLE profiles 
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS phone;

-- Drop new tables
DROP TABLE IF EXISTS promo_codes;
DROP TABLE IF EXISTS contact_settings;

COMMIT;
```

---

## 📊 Before & After Comparison

### Products Table
**Before:**
```
id, chef_id, title, description, price, image_url, category, 
is_active, stock_quantity, preparation_time
```

**After:**
```
id, chef_id, title, name, description, price, image_url, category,
is_active, is_available, is_featured, is_offer, offer_price,
stock_quantity, preparation_time, prep_time
```

### Orders Table
**Before:**
```
id, customer_id, chef_id, order_number, status, subtotal, delivery_fee,
tax_amount, total_amount, delivery_address, delivery_phone, delivery_notes,
payment_method, payment_status, customer_name, customer_phone
```

**After:**
```
[all above fields] + promo_code, discount_amount, notes
```

---

## ✅ Success Checklist

After running the migration, verify:

- [ ] Migration completed without errors
- [ ] `promo_codes` table exists
- [ ] `contact_settings` table exists with 1 row
- [ ] Products table has `is_featured`, `is_offer` columns
- [ ] Orders table has `promo_code`, `discount_amount` columns
- [ ] Frontend build still succeeds: `npm run build`
- [ ] Admin dashboard loads without errors
- [ ] Can create a featured product
- [ ] Can create a promo code
- [ ] Can update contact settings

---

## 🆘 Support

If you encounter issues:

1. **Check Supabase Logs**: Dashboard → Database → Logs
2. **Verify RLS Policies**: Dashboard → Authentication → Policies
3. **Check Foreign Keys**: Ensure no conflicts with existing data
4. **Review Error Messages**: Copy full error for debugging

---

## 🎯 Next Steps After Migration

1. **Test Admin Dashboard**: Log in as admin, verify all CRUD operations work
2. **Create Sample Data**: Add a featured product, create a promo code
3. **Test User Flow**: Browse products, apply promo code, place order
4. **Monitor Performance**: Check if new indexes improve query speed
5. **Update Admin Access**: Ensure admin users have proper role in profiles table

---

## 📝 Migration Log Template

Keep a record of your migration:

```
Migration Date: _______________
Supabase Project: _______________
Performed By: _______________
Duration: _______________
Status: [ ] Success [ ] Failed [ ] Rolled Back
Notes: _______________________________
```

---

**🎉 Once migration is complete, your application will be fully functional with all features enabled!**
