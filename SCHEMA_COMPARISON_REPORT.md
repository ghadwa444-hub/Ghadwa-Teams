# 🚨 CRITICAL: Schema Comparison Report

## Documented Schema vs Actual Supabase Database

**Date:** December 16, 2025  
**Status:** ⚠️ MAJOR MISMATCHES DETECTED

---

## Executive Summary

| Table | Status | Severity |
|-------|--------|----------|
| profiles | ⚠️ Mismatch | HIGH |
| chefs | ✅ Close Match | LOW |
| products | 🔴 CRITICAL | CRITICAL |
| orders | 🔴 CRITICAL | CRITICAL |
| order_items | ⚠️ Mismatch | MEDIUM |
| boxes | 🔴 CRITICAL | CRITICAL |
| promo_codes | 🔴 MISSING | CRITICAL |
| contact_settings | 🔴 MISSING | HIGH |

---

## 1. PROFILES Table

### Documented vs Actual

| Column | Our Docs | Actual DB | Match |
|--------|----------|-----------|-------|
| id | uuid | uuid | ✅ |
| email | TEXT | ❌ MISSING | 🔴 |
| full_name | TEXT (nullable) | TEXT NOT NULL | ⚠️ |
| phone | TEXT | ❌ MISSING | 🔴 |
| whatsapp_number | ❌ MISSING | TEXT NOT NULL | 🔴 |
| delivery_address | ❌ MISSING | TEXT | 🔴 |
| role | TEXT | TEXT | ✅ |
| is_active | ❌ MISSING | BOOLEAN | ⚠️ |
| avatar_url | TEXT | TEXT | ✅ |

### Required Changes:
```typescript
// ❌ WRONG (Our docs)
interface Profile {
  email?: string;
  phone?: string;
}

// ✅ CORRECT (Actual DB)
interface Profile {
  whatsapp_number: string;  // NOT NULL, with regex validation
  delivery_address?: string;
  is_active: boolean;
  // NO email column!
}
```

---

## 2. CHEFS Table ✅ (Close Match)

### Documented vs Actual

| Column | Our Docs | Actual DB | Match |
|--------|----------|-----------|-------|
| id | uuid | uuid | ✅ |
| profile_id | uuid | uuid | ✅ |
| chef_name | TEXT NOT NULL | TEXT NOT NULL | ✅ |
| specialty | TEXT (nullable) | TEXT NOT NULL | ⚠️ |
| description | TEXT | TEXT | ✅ |
| image_url | TEXT | TEXT | ✅ |
| rating | NUMERIC | NUMERIC (0-5 check) | ✅ |
| is_active | BOOLEAN | BOOLEAN | ✅ |

### Minor Fix Required:
```typescript
// specialty is NOT NULL in actual DB
specialty: string;  // Required, not optional
```

---

## 3. PRODUCTS Table 🔴 CRITICAL MISMATCH

### Documented vs Actual

| Column | Our Docs | Actual DB | Match |
|--------|----------|-----------|-------|
| id | uuid | uuid | ✅ |
| chef_id | uuid | uuid | ✅ |
| **name** | TEXT | ❌ MISSING | 🔴 |
| **title** | ❌ MISSING | TEXT NOT NULL | 🔴 |
| description | TEXT | TEXT | ✅ |
| price | NUMERIC | NUMERIC | ✅ |
| image_url | TEXT | TEXT | ✅ |
| category | TEXT | TEXT NOT NULL | ⚠️ |
| **is_available** | BOOLEAN | ❌ MISSING | 🔴 |
| **is_active** | ❌ MISSING | BOOLEAN | 🔴 |
| **is_featured** | BOOLEAN | ❌ MISSING | 🔴 |
| **is_offer** | BOOLEAN | ❌ MISSING | 🔴 |
| **offer_price** | NUMERIC | ❌ MISSING | 🔴 |
| **prep_time** | INTEGER | ❌ MISSING | 🔴 |
| **preparation_time** | ❌ MISSING | INTEGER | 🔴 |
| **stock_quantity** | ❌ MISSING | INTEGER | ⚠️ |

### CRITICAL Changes Required:
```typescript
// ❌ WRONG (Our docs - DOES NOT MATCH DB!)
interface Product {
  name: string;           // ❌ Wrong! Use 'title'
  is_available: boolean;  // ❌ Wrong! Use 'is_active'
  is_featured: boolean;   // ❌ DOESN'T EXIST
  is_offer: boolean;      // ❌ DOESN'T EXIST
  offer_price?: number;   // ❌ DOESN'T EXIST
  prep_time?: number;     // ❌ Wrong! Use 'preparation_time'
}

// ✅ CORRECT (Actual DB)
interface Product {
  title: string;              // NOT 'name'
  is_active: boolean;         // NOT 'is_available'
  preparation_time?: number;  // NOT 'prep_time'
  stock_quantity: number;     // NEW field
  // NO is_featured, is_offer, offer_price!
}
```

### Impact on Components:
| Component | Field Used | Should Use |
|-----------|------------|------------|
| FullMenu | `item.name` | `item.title` |
| FullMenu | `item.is_available` | `item.is_active` |
| BestSellers | `item.is_featured` | ❌ DOESN'T EXIST |
| WeeklyOffers | `item.is_offer` | ❌ DOESN'T EXIST |
| WeeklyOffers | `item.offer_price` | ❌ DOESN'T EXIST |
| AdminMeals | `name` | `title` |

---

## 4. ORDERS Table 🔴 CRITICAL MISMATCH

### Documented vs Actual

| Column | Our Docs | Actual DB | Match |
|--------|----------|-----------|-------|
| id | uuid | uuid | ✅ |
| customer_id | uuid | uuid | ✅ |
| chef_id | uuid | uuid | ✅ |
| **order_number** | ❌ MISSING | TEXT NOT NULL UNIQUE | 🔴 |
| status | TEXT | TEXT | ⚠️ |
| **subtotal** | ❌ MISSING | NUMERIC NOT NULL | 🔴 |
| **delivery_fee** | ❌ MISSING | NUMERIC | 🔴 |
| **tax_amount** | ❌ MISSING | NUMERIC | 🔴 |
| total_amount | NUMERIC | NUMERIC | ✅ |
| delivery_address | TEXT | TEXT NOT NULL | ⚠️ |
| delivery_phone | TEXT | TEXT | ✅ |
| **notes** | TEXT | ❌ MISSING | 🔴 |
| **delivery_notes** | ❌ MISSING | TEXT | 🔴 |
| **payment_method** | ❌ MISSING | TEXT | 🔴 |
| **payment_status** | ❌ MISSING | TEXT | 🔴 |
| customer_name | TEXT | TEXT | ✅ |
| **customer_phone** | ❌ MISSING | TEXT | 🔴 |
| **promo_code** | TEXT | ❌ MISSING | 🔴 |
| **discount_amount** | NUMERIC | ❌ MISSING | 🔴 |
| **confirmed_at** | ❌ MISSING | TIMESTAMPTZ | 🔴 |
| **delivered_at** | ❌ MISSING | TIMESTAMPTZ | 🔴 |
| **cancelled_at** | ❌ MISSING | TIMESTAMPTZ | 🔴 |

### Status Values Mismatch:
```typescript
// ❌ Our docs:
status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';

// ✅ Actual DB:
status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
// NO 'ready', use 'out_for_delivery' NOT 'delivering'
```

### Payment Fields (NEW - Not in our docs):
```typescript
payment_method: 'cash' | 'card' | 'online';
payment_status: 'pending' | 'paid' | 'refunded';
```

### CRITICAL Changes Required:
```typescript
// ✅ CORRECT (Actual DB)
interface Order {
  order_number: string;       // NEW - Required unique order number
  subtotal: number;           // NEW - Before fees/discounts
  delivery_fee: number;       // NEW
  tax_amount: number;         // NEW
  delivery_notes?: string;    // NOT 'notes'
  payment_method: 'cash' | 'card' | 'online';
  payment_status: 'pending' | 'paid' | 'refunded';
  customer_phone?: string;    // Different from delivery_phone
  confirmed_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  // NO promo_code, discount_amount columns!
}
```

---

## 5. ORDER_ITEMS Table ⚠️ Mismatch

### Documented vs Actual

| Column | Our Docs | Actual DB | Match |
|--------|----------|-----------|-------|
| id | uuid | uuid | ✅ |
| order_id | uuid NOT NULL | uuid NOT NULL | ✅ |
| product_id | uuid (nullable) | uuid NOT NULL | ⚠️ |
| product_name | TEXT | TEXT | ✅ |
| quantity | INTEGER | INTEGER | ✅ |
| unit_price | NUMERIC | NUMERIC | ✅ |
| **total_price** | NUMERIC | ❌ MISSING | 🔴 |
| **subtotal** | ❌ MISSING | NUMERIC NOT NULL | 🔴 |
| notes | TEXT | TEXT | ✅ |

### Required Changes:
```typescript
// ❌ WRONG
total_price: number;

// ✅ CORRECT
subtotal: number;  // Use 'subtotal' not 'total_price'
product_id: string; // NOT NULL (required)
```

---

## 6. BOXES Table 🔴 CRITICAL MISMATCH

### Documented vs Actual

| Column | Our Docs | Actual DB | Match |
|--------|----------|-----------|-------|
| **id** | uuid | **BIGINT** | 🔴 |
| name | TEXT | TEXT | ✅ |
| **description** | TEXT | ❌ MISSING | 🔴 |
| price | NUMERIC | NUMERIC | ✅ |
| **image_url** | TEXT | ❌ MISSING | 🔴 |
| **img** | ❌ MISSING | TEXT | 🔴 |
| **items_count** | INTEGER | ❌ MISSING | 🔴 |
| **items** | ❌ MISSING | ARRAY NOT NULL | 🔴 |
| **is_active** | BOOLEAN | ❌ MISSING | 🔴 |
| **serves** | ❌ MISSING | TEXT NOT NULL | 🔴 |
| **chef** | ❌ MISSING | TEXT NOT NULL | 🔴 |
| **color** | ❌ MISSING | TEXT | 🔴 |
| **accent** | ❌ MISSING | TEXT | 🔴 |
| **badge** | ❌ MISSING | TEXT | 🔴 |
| **category** | ❌ MISSING | TEXT | 🔴 |

### CRITICAL - ID TYPE MISMATCH:
```typescript
// ❌ WRONG - Our docs
id: string;  // UUID

// ✅ CORRECT - Actual DB
id: number;  // BIGINT (integer)
```

### CRITICAL Changes Required:
```typescript
// ✅ CORRECT (Actual DB)
interface Box {
  id: number;         // BIGINT not UUID!
  name: string;
  price: number;
  serves: string;     // Required
  chef: string;       // Required
  items: string[];    // Array, not items_count
  img?: string;       // NOT 'image_url'
  color?: string;
  accent?: string;
  badge?: string;
  category?: string;
  // NO description, is_active, items_count!
}
```

---

## 7. PROMO_CODES Table 🔴 DOES NOT EXIST

**Our documentation defines a `promo_codes` table, but it DOES NOT EXIST in the actual database!**

### What Exists Instead:
The `admin_settings` table uses a key-value structure:
```sql
CREATE TABLE public.admin_settings (
  id uuid,
  setting_key text NOT NULL UNIQUE,
  setting_value text NOT NULL,
  setting_type text DEFAULT 'string',
  description text,
  is_public boolean DEFAULT false,
  created_at, updated_at
);
```

### Options:
1. **Create the promo_codes table** in Supabase
2. **Use admin_settings** for promo codes (key-value pairs)
3. **Remove promo code functionality** until table is created

---

## 8. CONTACT_SETTINGS Table 🔴 DOES NOT EXIST

**Our documentation defines a `contact_settings` table, but it DOES NOT EXIST!**

Should use `admin_settings` table with key-value pairs instead:
```sql
-- Example entries:
INSERT INTO admin_settings (setting_key, setting_value, setting_type) VALUES
  ('contact_phone', '+20123456789', 'string'),
  ('contact_email', 'info@ghadwa.com', 'string'),
  ('contact_whatsapp', '+20123456789', 'string');
```

---

## 📋 Summary of Required Actions

### Option A: Update Frontend to Match Actual DB
Update all TypeScript interfaces and components to use actual database column names.

### Option B: Run Migration to Match Our Docs
Create missing columns in the database.

---

## 🔧 Recommended Database Migration (Option B)

If you want the database to match our documentation, run these migrations:

```sql
-- 1. Add missing columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Fix products table
ALTER TABLE public.products
  RENAME COLUMN title TO name;
  
ALTER TABLE public.products
  RENAME COLUMN is_active TO is_available;
  
ALTER TABLE public.products
  RENAME COLUMN preparation_time TO prep_time;
  
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_offer BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS offer_price NUMERIC(10,2);

-- 3. Fix orders table
ALTER TABLE public.orders
  RENAME COLUMN delivery_notes TO notes;
  
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS promo_code TEXT,
  ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10,2) DEFAULT 0;

-- 4. Fix order_items table
ALTER TABLE public.order_items
  RENAME COLUMN subtotal TO total_price;

-- 5. Fix boxes table (COMPLEX - needs ID type change)
-- WARNING: This requires data migration
ALTER TABLE public.boxes
  RENAME COLUMN img TO image_url;
  
ALTER TABLE public.boxes
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS items_count INTEGER;

-- 6. Create promo_codes table
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC(10,2) NOT NULL,
  min_order_amount NUMERIC(10,2) DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT now(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Create contact_settings table
CREATE TABLE IF NOT EXISTS public.contact_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT,
  email TEXT,
  address TEXT,
  whatsapp TEXT,
  instagram TEXT,
  facebook TEXT,
  working_hours TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default contact settings
INSERT INTO public.contact_settings (phone, email, address)
VALUES ('', '', '')
ON CONFLICT DO NOTHING;
```

---

## 🔧 Alternative: Update Frontend (Option A)

Update the following files to match actual DB:

### 1. types.ts
```typescript
// Change Product interface
interface Product {
  id: string;
  chef_id?: string;
  title: string;           // Was 'name'
  description?: string;
  price: number;
  image_url?: string;
  category: string;        // NOT NULL
  is_active: boolean;      // Was 'is_available'
  stock_quantity: number;
  preparation_time?: number; // Was 'prep_time'
  // REMOVE: is_featured, is_offer, offer_price
}

// Change Box interface
interface Box {
  id: number;              // BIGINT not UUID!
  name: string;
  price: number;
  serves: string;
  chef: string;
  items: string[];
  img?: string;            // Was 'image_url'
  // REMOVE: description, is_active, items_count
}

// Change Order interface
interface Order {
  order_number: string;    // NEW required
  subtotal: number;        // NEW required
  delivery_fee: number;
  tax_amount: number;
  delivery_notes?: string; // Was 'notes'
  payment_method: 'cash' | 'card' | 'online';
  payment_status: 'pending' | 'paid' | 'refunded';
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  // REMOVE: promo_code, discount_amount
}
```

---

## 📊 Decision Matrix

| Approach | Pros | Cons |
|----------|------|------|
| **Update DB (Option B)** | Frontend code works, features like offers/featured exist | Requires SQL migration, potential data issues |
| **Update Frontend (Option A)** | No DB changes needed | Lose offer/featured functionality, extensive code changes |
| **Hybrid** | Best of both | More complex to implement |

---

## 🎯 Recommended Path Forward

1. **Immediate:** Run the database migration to add missing columns
2. **Then:** Keep frontend code as-is (already using correct documented schema)
3. **Verify:** Test all admin and user-facing components

The migration SQL above will bring the actual database in line with our documented schema.

