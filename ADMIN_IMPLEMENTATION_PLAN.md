# 📋 Admin Dashboard Implementation Plan

## ✅ Status: AdminChefs COMPLETED

This document tracks the progress of updating all admin components to match the official database schema documented in `DATABASE_SCHEMA.md`.

---

## 🎯 Goal
Ensure all admin components use the correct Supabase database schema with proper field mappings, UUID IDs, and database operations.

---

## ✅ Completed Components

### 1. AdminChefs ✅
**Status:** FULLY IMPLEMENTED  
**Database Table:** `chefs`  
**Last Updated:** December 16, 2025

**Schema Mapping:**
| Form Field | Database Column | Type |
|------------|-----------------|------|
| name | chef_name | TEXT |
| specialty | specialty | TEXT |
| bio | description | TEXT |
| img | image_url | TEXT |
| N/A | is_active | BOOLEAN |
| N/A | rating | NUMERIC(2,1) |
| N/A | id | UUID |

**Implemented Features:**
- ✅ Add new chef with image upload
- ✅ Edit existing chef
- ✅ Delete chef
- ✅ Toggle chef active status
- ✅ Display chef list with proper schema fields
- ✅ Form validation
- ✅ Error handling
- ✅ Success notifications
- ✅ Image preview
- ✅ UUID-based IDs

**Removed Fields:**
- ❌ cover (no longer in schema)
- ❌ workingHours (no longer in schema)
- ❌ deliveryTime (no longer in schema)
- ❌ badges (no longer in schema)
- ❌ isOpen (replaced with is_active)
- ❌ reviews (no longer in schema)
- ❌ orders (no longer in schema)

**Files Updated:**
- `components/admin/AdminChefs.tsx` - Complete rewrite
- `types.ts` - Chef interface updated
- `services/api.ts` - Chef CRUD operations updated
- `App.tsx` - Handler functions updated

---

## ⏳ Pending Components

### 2. AdminMeals ⏳
**Status:** NEEDS UPDATE  
**Database Table:** `products`  
**Priority:** HIGH

**Required Schema Mapping:**
| Old Field | New Database Column | Type |
|-----------|---------------------|------|
| id | id | UUID |
| name | name | TEXT |
| description | description | TEXT |
| price | price | NUMERIC(10,2) |
| img | image_url | TEXT |
| chefId | chef_id | UUID |
| category | category | TEXT |
| N/A | is_available | BOOLEAN |
| N/A | is_featured | BOOLEAN |
| N/A | is_offer | BOOLEAN |
| N/A | offer_price | NUMERIC(10,2) |
| N/A | prep_time | INTEGER |

**Required Changes:**
1. Update Product interface imports
2. Change ID type from number to string (UUID)
3. Map form fields to database columns
4. Update CRUD operations in AdminMeals component
5. Update props in App.tsx
6. Test image upload for products

---

### 3. AdminOrders ⏳
**Status:** NEEDS UPDATE  
**Database Table:** `orders`, `order_items`  
**Priority:** HIGH

**Required Schema Mapping:**

**Orders Table:**
| Old Field | New Database Column | Type |
|-----------|---------------------|------|
| id | id | UUID |
| customer | customer_name | TEXT |
| phone | delivery_phone | TEXT |
| address | delivery_address | TEXT |
| total | total_amount | NUMERIC(10,2) |
| date | created_at | TIMESTAMPTZ |
| N/A | customer_id | UUID |
| N/A | chef_id | UUID |
| N/A | discount_amount | NUMERIC(10,2) |
| N/A | promo_code | TEXT |
| N/A | notes | TEXT |

**Order Status Values:**
- pending
- confirmed
- preparing
- ready
- delivering
- delivered
- cancelled

**Required Changes:**
1. Update Order interface
2. Change ID type from number to string
3. Map order fields to database columns
4. Update order items handling
5. Fix status dropdown to use correct values
6. Update order display to show proper fields

---

### 4. AdminBoxes ⏳
**Status:** RECENTLY UPDATED, NEEDS TESTING  
**Database Table:** `boxes`  
**Priority:** MEDIUM

**Current Schema:**
| Field | Database Column | Type |
|-------|-----------------|------|
| id | id | UUID |
| name | name | TEXT |
| description | description | TEXT |
| price | price | NUMERIC(10,2) |
| img | image_url | TEXT |
| N/A | items_count | INTEGER |
| N/A | is_active | BOOLEAN |

**Required Changes:**
1. Test current implementation
2. Verify UUID handling
3. Test CRUD operations
4. Ensure proper error handling

---

### 5. AdminOffers ⏳
**Status:** NEEDS UPDATE  
**Database Table:** `products` (WHERE is_offer=true)  
**Priority:** MEDIUM

**Schema Note:**
Offers are just products with `is_offer=true` and an `offer_price` set.

**Required Changes:**
1. Filter products where is_offer=true
2. Update form to set is_offer flag
3. Add offer_price field to form
4. Use Product interface
5. Map to correct database columns

---

### 6. AdminBestSellers ⏳
**Status:** NEEDS UPDATE  
**Database Table:** `products` (WHERE is_featured=true)  
**Priority:** LOW

**Schema Note:**
Best sellers are products with `is_featured=true`.

**Required Changes:**
1. Filter products where is_featured=true
2. Update form to set is_featured flag
3. Use Product interface
4. Map to correct database columns

---

### 7. AdminPromoCodes ⏳
**Status:** NEEDS MIGRATION TO SUPABASE  
**Database Table:** `promo_codes`  
**Priority:** LOW

**Current:** localStorage  
**Target:** Supabase `promo_codes` table

**Required Schema Mapping:**
| Old Field | New Database Column | Type |
|-----------|---------------------|------|
| id | id | UUID |
| code | code | TEXT (UNIQUE) |
| value | discount_value | NUMERIC(10,2) |
| type | discount_type | TEXT |
| N/A | min_order_amount | NUMERIC(10,2) |
| N/A | max_uses | INTEGER |
| N/A | current_uses | INTEGER |
| N/A | valid_from | TIMESTAMPTZ |
| N/A | valid_until | TIMESTAMPTZ |
| N/A | is_active | BOOLEAN |

**Required Changes:**
1. Migrate from localStorage to Supabase
2. Update PromoCode interface
3. Implement Supabase CRUD operations
4. Add expiration date handling
5. Add usage tracking

---

### 8. AdminContactSettings ⏳
**Status:** NEEDS UPDATE  
**Database Table:** `contact_settings`  
**Priority:** LOW

**Required Schema Mapping:**
| Old Field | New Database Column | Type |
|-----------|---------------------|------|
| phone | phone | TEXT |
| email | email | TEXT |
| address | address | TEXT |
| whatsapp | whatsapp | TEXT |
| facebookUrl | facebook | TEXT |
| instagramUrl | instagram | TEXT |
| N/A | working_hours | TEXT |

**Required Changes:**
1. Update ContactSettings interface
2. Remove tiktokUrl (not in schema)
3. Add working_hours field
4. Update save operation

---

## 📊 Progress Tracking

### Overall Status
- **Completed:** 1/8 (12.5%)
- **In Progress:** 0/8  
- **Pending:** 7/8 (87.5%)

### Priority Breakdown
- **HIGH Priority:** 2 components (AdminMeals, AdminOrders)
- **MEDIUM Priority:** 2 components (AdminBoxes, AdminOffers)
- **LOW Priority:** 3 components (AdminBestSellers, AdminPromoCodes, AdminContactSettings)

---

## 🔧 Testing Checklist

For each completed component, verify:

- [ ] Build succeeds without TypeScript errors
- [ ] Component renders without console errors
- [ ] CREATE operation works
- [ ] READ operation displays correct data
- [ ] UPDATE operation saves changes
- [ ] DELETE operation removes data
- [ ] Form validation works
- [ ] Error handling displays user-friendly messages
- [ ] Success notifications appear
- [ ] Image uploads work (if applicable)
- [ ] Database constraints are respected
- [ ] UUIDs are handled correctly
- [ ] No hardcoded test data remains

---

## 🚀 Next Steps

1. **Fix AdminMeals** (HIGH PRIORITY)
   - Update to use Product interface
   - Map fields to database schema
   - Test CRUD operations

2. **Fix AdminOrders** (HIGH PRIORITY)
   - Update Order interface
   - Handle order_items properly
   - Test order workflow

3. **Test AdminBoxes** (MEDIUM PRIORITY)
   - Verify recent updates work
   - Test all CRUD operations

4. **Update Remaining Components** (MEDIUM/LOW PRIORITY)
   - AdminOffers
   - AdminBestSellers
   - AdminPromoCodes
   - AdminContactSettings

---

## 📝 Notes

### Common Issues to Watch For:
1. **ID Type Mismatch:** All IDs are UUIDs (strings), not numbers
2. **Field Name Mismatches:** Old code uses different names than database
3. **Missing Required Fields:** Database may require fields not in old forms
4. **Type Conversions:** Numeric fields need proper parsing
5. **Image URLs:** Ensure storage bucket exists and policies are set

### Reference Documentation:
- **Database Schema:** `DATABASE_SCHEMA.md`
- **Type Definitions:** `types.ts`
- **API Service:** `services/api.ts`
- **Supabase Service:** `services/supabase.data.service.ts`

---

## ✨ Success Criteria

The implementation is complete when:
1. ✅ All components use correct database schema
2. ✅ All CRUD operations work without errors
3. ✅ Build succeeds with 0 TypeScript errors
4. ✅ Console shows no runtime errors
5. ✅ All forms validate properly
6. ✅ Images upload successfully
7. ✅ Data persists to Supabase correctly
8. ✅ Admin dashboard is production-ready

---

**Last Updated:** December 16, 2025
