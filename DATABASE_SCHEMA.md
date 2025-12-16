# Ghadwa Database Schema Documentation

This document defines the **official Supabase database schema** for the Ghadwa application.
All components MUST use these exact column names when interacting with the database.

---

## 📊 Tables Overview

| Table | Description |
|-------|-------------|
| `profiles` | User profiles linked to Supabase Auth |
| `chefs` | Chef/Kitchen information |
| `products` | Menu items and meals |
| `orders` | Customer orders |
| `order_items` | Individual items within orders |
| `boxes` | Subscription/meal boxes |
| `promo_codes` | Discount codes |
| `contact_settings` | Business contact information |

---

## 👤 profiles Table

Stores user profile information linked to Supabase Auth users.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | - | Primary key, references auth.users |
| `email` | TEXT | YES | - | User email |
| `full_name` | TEXT | YES | - | User's full name |
| `phone` | TEXT | YES | - | Phone number |
| `role` | TEXT | YES | 'customer' | User role: 'admin', 'chef', 'customer' |
| `avatar_url` | TEXT | YES | - | Profile image URL |
| `created_at` | TIMESTAMPTZ | YES | now() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | YES | now() | Last update timestamp |

**TypeScript Interface:**
```typescript
interface Profile {
  id: string;          // UUID
  email?: string;
  full_name?: string;
  phone?: string;
  role: 'admin' | 'chef' | 'customer';
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}
```

---

## 👨‍🍳 chefs Table

Stores chef/kitchen information.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `profile_id` | UUID | YES | - | References profiles.id |
| `chef_name` | TEXT | NO | - | Chef/Kitchen display name |
| `specialty` | TEXT | YES | - | Chef's specialty cuisine |
| `description` | TEXT | YES | - | Chef bio/description |
| `image_url` | TEXT | YES | - | Profile image URL |
| `rating` | NUMERIC(2,1) | YES | 5.0 | Average rating (0.0-5.0) |
| `is_active` | BOOLEAN | YES | true | Whether chef is accepting orders |
| `created_at` | TIMESTAMPTZ | YES | now() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | YES | now() | Last update timestamp |

**TypeScript Interface:**
```typescript
interface Chef {
  id: string;           // UUID
  profile_id?: string;  // UUID
  chef_name: string;
  specialty?: string;
  description?: string;
  image_url?: string;
  rating: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
```

**Form Field to Database Column Mapping:**
| Form Field | Database Column |
|------------|-----------------|
| name | chef_name |
| bio | description |
| img | image_url |
| isOpen | is_active |

---

## 🍽️ products Table

Stores menu items (meals, dishes).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `chef_id` | UUID | YES | - | References chefs.id |
| `name` | TEXT | NO | - | Product name |
| `description` | TEXT | YES | - | Product description |
| `price` | NUMERIC(10,2) | NO | - | Price in currency |
| `image_url` | TEXT | YES | - | Product image URL |
| `category` | TEXT | YES | - | Product category |
| `is_available` | BOOLEAN | YES | true | Availability status |
| `is_featured` | BOOLEAN | YES | false | Featured/best seller flag |
| `is_offer` | BOOLEAN | YES | false | Special offer flag |
| `offer_price` | NUMERIC(10,2) | YES | - | Discounted price if on offer |
| `prep_time` | INTEGER | YES | - | Preparation time in minutes |
| `created_at` | TIMESTAMPTZ | YES | now() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | YES | now() | Last update timestamp |

**TypeScript Interface:**
```typescript
interface Product {
  id: string;           // UUID
  chef_id?: string;     // UUID
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  is_available: boolean;
  is_featured: boolean;
  is_offer: boolean;
  offer_price?: number;
  prep_time?: number;
  created_at?: string;
  updated_at?: string;
}
```

**Form Field to Database Column Mapping:**
| Form Field | Database Column |
|------------|-----------------|
| name | name |
| description | description |
| price | price |
| img | image_url |
| category | category |
| chefId | chef_id |
| prepTime | prep_time |

---

## 📦 orders Table

Stores customer orders.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `customer_id` | UUID | YES | - | References profiles.id |
| `chef_id` | UUID | YES | - | References chefs.id |
| `status` | TEXT | YES | 'pending' | Order status |
| `total_amount` | NUMERIC(10,2) | NO | - | Total order amount |
| `delivery_address` | TEXT | YES | - | Delivery address |
| `delivery_phone` | TEXT | YES | - | Contact phone |
| `customer_name` | TEXT | YES | - | Customer name |
| `notes` | TEXT | YES | - | Special instructions |
| `promo_code` | TEXT | YES | - | Applied promo code |
| `discount_amount` | NUMERIC(10,2) | YES | 0 | Discount applied |
| `created_at` | TIMESTAMPTZ | YES | now() | Order creation time |
| `updated_at` | TIMESTAMPTZ | YES | now() | Last update timestamp |

**Order Status Values:**
- `pending` - Order placed, awaiting confirmation
- `confirmed` - Order confirmed by chef
- `preparing` - Being prepared
- `ready` - Ready for pickup/delivery
- `delivering` - Out for delivery
- `delivered` - Successfully delivered
- `cancelled` - Order cancelled

**TypeScript Interface:**
```typescript
interface Order {
  id: string;           // UUID
  customer_id?: string; // UUID
  chef_id?: string;     // UUID
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  total_amount: number;
  delivery_address?: string;
  delivery_phone?: string;
  customer_name?: string;
  notes?: string;
  promo_code?: string;
  discount_amount: number;
  created_at?: string;
  updated_at?: string;
  items?: OrderItem[];  // Joined from order_items
}
```

---

## 🛒 order_items Table

Stores individual items within an order.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `order_id` | UUID | NO | - | References orders.id |
| `product_id` | UUID | YES | - | References products.id |
| `product_name` | TEXT | NO | - | Product name snapshot |
| `quantity` | INTEGER | NO | 1 | Quantity ordered |
| `unit_price` | NUMERIC(10,2) | NO | - | Price per unit |
| `total_price` | NUMERIC(10,2) | NO | - | quantity * unit_price |
| `notes` | TEXT | YES | - | Item-specific notes |
| `created_at` | TIMESTAMPTZ | YES | now() | Creation timestamp |

**TypeScript Interface:**
```typescript
interface OrderItem {
  id: string;           // UUID
  order_id: string;     // UUID
  product_id?: string;  // UUID
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
  created_at?: string;
}
```

---

## 📦 boxes Table

Stores subscription/meal box offerings.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `name` | TEXT | NO | - | Box name |
| `description` | TEXT | YES | - | Box description |
| `price` | NUMERIC(10,2) | NO | - | Box price |
| `image_url` | TEXT | YES | - | Box image URL |
| `items_count` | INTEGER | YES | - | Number of items in box |
| `is_active` | BOOLEAN | YES | true | Availability status |
| `created_at` | TIMESTAMPTZ | YES | now() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | YES | now() | Last update timestamp |

**TypeScript Interface:**
```typescript
interface Box {
  id: string;           // UUID
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  items_count?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
```

---

## 🎫 promo_codes Table

Stores discount/promotional codes.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `code` | TEXT | NO | - | Promo code (unique) |
| `discount_type` | TEXT | NO | 'percentage' | 'percentage' or 'fixed' |
| `discount_value` | NUMERIC(10,2) | NO | - | Discount amount |
| `min_order_amount` | NUMERIC(10,2) | YES | 0 | Minimum order to apply |
| `max_uses` | INTEGER | YES | - | Maximum usage count |
| `current_uses` | INTEGER | YES | 0 | Current usage count |
| `valid_from` | TIMESTAMPTZ | YES | now() | Start date |
| `valid_until` | TIMESTAMPTZ | YES | - | Expiration date |
| `is_active` | BOOLEAN | YES | true | Active status |
| `created_at` | TIMESTAMPTZ | YES | now() | Creation timestamp |

**TypeScript Interface:**
```typescript
interface PromoCode {
  id: string;           // UUID
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_uses?: number;
  current_uses: number;
  valid_from?: string;
  valid_until?: string;
  is_active: boolean;
  created_at?: string;
}
```

---

## 📞 contact_settings Table

Stores business contact information (single row).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `phone` | TEXT | YES | - | Business phone |
| `email` | TEXT | YES | - | Business email |
| `address` | TEXT | YES | - | Business address |
| `whatsapp` | TEXT | YES | - | WhatsApp number |
| `instagram` | TEXT | YES | - | Instagram handle |
| `facebook` | TEXT | YES | - | Facebook page |
| `working_hours` | TEXT | YES | - | Business hours |
| `updated_at` | TIMESTAMPTZ | YES | now() | Last update timestamp |

**TypeScript Interface:**
```typescript
interface ContactSettings {
  id: string;           // UUID
  phone?: string;
  email?: string;
  address?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  working_hours?: string;
  updated_at?: string;
}
```

---

## 🔑 ID Convention

**IMPORTANT:** All IDs in Supabase are UUIDs (strings), NOT integers.

```typescript
// ❌ WRONG
id: number;
toggleChefStatus: (id: number) => void;

// ✅ CORRECT
id: string;
toggleChefStatus: (id: string) => void;
```

---

## 🗄️ SQL Schema Creation

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chefs table
CREATE TABLE IF NOT EXISTS public.chefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  chef_name TEXT NOT NULL,
  specialty TEXT,
  description TEXT,
  image_url TEXT,
  rating NUMERIC(2,1) DEFAULT 5.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chef_id UUID REFERENCES public.chefs(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_offer BOOLEAN DEFAULT false,
  offer_price NUMERIC(10,2),
  prep_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  chef_id UUID REFERENCES public.chefs(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending',
  total_amount NUMERIC(10,2) NOT NULL,
  delivery_address TEXT,
  delivery_phone TEXT,
  customer_name TEXT,
  notes TEXT,
  promo_code TEXT,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Boxes table
CREATE TABLE IF NOT EXISTS public.boxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  items_count INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Promo codes table
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

-- Contact settings table
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

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chefs_updated_at BEFORE UPDATE ON chefs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_boxes_updated_at BEFORE UPDATE ON boxes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_settings_updated_at BEFORE UPDATE ON contact_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read chefs" ON chefs FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read boxes" ON boxes FOR SELECT USING (true);
CREATE POLICY "Public read promo_codes" ON promo_codes FOR SELECT USING (true);
CREATE POLICY "Public read contact_settings" ON contact_settings FOR SELECT USING (true);

-- Authenticated user policies
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can read own orders" ON orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Admin policies (requires role check)
CREATE POLICY "Admins can do everything on chefs" ON chefs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can do everything on products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can do everything on orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can do everything on boxes" ON boxes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can do everything on promo_codes" ON promo_codes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can do everything on contact_settings" ON contact_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
```

---

## 📋 Component to Schema Mapping Checklist

| Component | Table | Status |
|-----------|-------|--------|
| AdminChefs | chefs | ✅ Complete |
| AdminMeals | products | ✅ Complete |
| AdminOrders | orders, order_items | ✅ Complete |
| AdminBoxes | boxes | ✅ Complete |
| AdminOffers | products (is_offer=true) | ✅ Complete |
| AdminBestSellers | products (is_featured=true) | ✅ Complete |
| AdminPromoCodes | promo_codes | ✅ Complete |
| AdminContactSettings | contact_settings | ✅ Complete |
| ChefsSection | chefs | ⏳ Needs Update |
| FullMenu | products | ⏳ Needs Update |
| BoxesSection | boxes | ⏳ Needs Update |
| WeeklyOffers | products | ⏳ Needs Update |
| BestSellers | products | ⏳ Needs Update |

---

## 🔄 Last Updated
- **Date:** December 16, 2025
- **Version:** 1.0.0
