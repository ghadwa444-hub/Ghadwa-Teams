# Supabase Integration Setup Guide

## ✅ Setup Complete!

Your Ghadwa application is now configured to connect with Supabase for managing orders and admin accounts.

---

## 📋 What Was Set Up

### 1. Environment Variables (`.env`)
Located in the root directory with your Supabase credentials:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Public API key for client-side operations
- `VITE_SUPABASE_SECRET_KEY` - Secret key for server-side operations (use with caution!)

### 2. Supabase Client (`services/supabase.ts`)
- Initialized Supabase client with credentials
- Three connection test functions:
  - `checkSupabaseConnection()` - Tests auth service
  - `testDatabaseConnection()` - Tests database connectivity
  - `supabaseHealthCheck()` - Comprehensive health check
- Exposed on `window.GhadwaSupabase` for easy testing

### 3. Test Component (`components/SupabaseTest.tsx`)
- Visual React component to display connection status
- Shows authentication and database status
- Real-time test results with timestamps

### 4. NPM Package
- Installed `@supabase/supabase-js` (v2.x)
- Ready for authentication and database operations

---

## 🧪 Testing Supabase Connection

### Method 1: Using Browser Console (Recommended)

1. Open your app: **http://localhost:3000**
2. Open Developer Tools: **F12** or **Ctrl+Shift+I**
3. Go to **Console** tab
4. Run the health check:

```javascript
// Test all connections
window.GhadwaSupabase.healthCheck().then(result => {
  console.log('Health Check Result:', result);
});

// Or test individual components
window.GhadwaSupabase.testConnection().then(result => {
  console.log('Auth connected:', result);
});

window.GhadwaSupabase.testDatabase().then(result => {
  console.log('Database connected:', result);
});
```

### Method 2: Using UI Component

Toggle the Supabase test UI in the app (see Navbar/Admin section).

### Method 3: Check Logs

Look for these log messages in the Debug Console (🐛 icon):

```
✅ [SUPABASE] 🔌 Initializing Supabase client
✅ [SUPABASE] ✅ Supabase connection successful
✅ [SUPABASE] ✅ Database connection successful
✅ [SUPABASE] 🏥 Health check complete
```

---

## 📊 Expected Test Results

### Successful Connection

```javascript
{
  connected: true,
  auth: true,
  database: true,
  timestamp: "2025-12-10T12:30:45.123Z"
}
```

### Troubleshooting Connection Issues

If you see `connected: false`:

1. **Check `.env` file**
   ```bash
   # Verify file exists
   cat .env
   ```

2. **Verify credentials**
   - Ensure `VITE_SUPABASE_URL` starts with `https://`
   - Ensure `VITE_SUPABASE_ANON_KEY` is not empty
   - Check no extra spaces or quotes

3. **Check Network Connection**
   - Open DevTools → Network tab
   - Look for requests to `supabase.co`
   - Verify they're not blocked

4. **Check Server Status**
   - Visit Supabase dashboard
   - Verify project is active and not paused
   - Check for any service alerts

5. **Browser Console Errors**
   - Look for CORS errors
   - Check the Debug Console (🐛) for detailed error messages

---

## 🔐 Security Considerations

### Never commit secrets!

Your `.env` file contains sensitive credentials:

1. ✅ Already in `.gitignore` (if not, add it):
   ```
   .env
   .env.local
   .env.*.local
   ```

2. 🔓 **Public Key** (`VITE_SUPABASE_ANON_KEY`)
   - Safe to expose in client code (prefixed with `VITE_`)
   - Only has RLS (Row-Level Security) permissions
   - Should be used for client-side operations

3. 🔐 **Secret Key** (`VITE_SUPABASE_SECRET_KEY`)
   - Should NEVER be exposed in client code
   - Should be used in backend/server only
   - Currently in client for initial testing only
   - Remove before production deployment

### In Production:

Remove `VITE_SUPABASE_SECRET_KEY` from client and move to backend server:

```typescript
// ❌ DON'T DO THIS IN PRODUCTION
const secretKey = import.meta.env.VITE_SUPABASE_SECRET_KEY;

// ✅ DO THIS INSTEAD - Call your backend API
const response = await fetch('/api/admin-operation', {
  method: 'POST',
  body: JSON.stringify({ data })
});
```

---

## 🗂️ Database Schema Setup

You need to create tables for orders and admin accounts:

### 1. Orders Table

```sql
CREATE TABLE orders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chef_name TEXT NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, cooking, out_for_delivery, delivered
  delivery_address TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### 2. Admin Table

```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin', -- admin, super_admin, moderator
  permissions JSONB,
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view all admins"
  ON admins FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM admins WHERE id = auth.uid() AND is_active = true
  ));
```

### 3. Menu Items Table

```sql
CREATE TABLE menu_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  chef_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chef_name TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  old_price DECIMAL(10, 2),
  image_url TEXT,
  category TEXT,
  rating DECIMAL(2, 1) DEFAULT 0,
  reviews_count INT DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Next Steps

1. **Create Supabase Tables**
   - Log into Supabase dashboard
   - Go to SQL Editor
   - Run the SQL scripts above
   - Or use Supabase VS Code extension

2. **Migrate from localStorage to Supabase**
   - Update `services/api.ts` to use Supabase client
   - Migrate existing data from localStorage
   - Set up authentication flows

3. **Implement Admin Authentication**
   - Create admin signup/login
   - Store admin sessions in Supabase
   - Implement role-based access control (RBAC)

4. **Implement Order Management**
   - Save new orders to Supabase
   - Update order status from admin dashboard
   - Fetch orders for tracking

5. **Set Up Realtime Updates** (Optional)
   - Subscribe to order status changes
   - Push notifications when order status updates
   - Live order tracking

---

## 📚 Useful Resources

- **Supabase Documentation**: https://supabase.com/docs
- **JavaScript Client Library**: https://supabase.com/docs/reference/javascript
- **Row Level Security**: https://supabase.com/docs/guides/auth/row-level-security
- **Authentication**: https://supabase.com/docs/guides/auth
- **Realtime Subscriptions**: https://supabase.com/docs/guides/realtime

---

## 🐛 Debugging

### Check Logs in Supabase Dashboard

1. Go to Supabase project dashboard
2. Click on "Logs" in left sidebar
3. Filter by your app's requests
4. Look for error details

### Check App Logs

1. Open Debug Console (🐛 icon)
2. Filter by "SUPABASE" module
3. See all Supabase operations and errors

### Test API Manually

```javascript
// Test public schema access
const { data, error } = await window.GhadwaSupabase.client
  .from('orders')
  .select('*')
  .limit(1);

console.log('Orders:', data, error);
```

---

## ✅ Checklist

- ✅ Supabase credentials in `.env`
- ✅ Supabase client initialized
- ✅ Test functions available
- ✅ `@supabase/supabase-js` installed
- ✅ Connection test working
- ⏳ Database tables created (next step)
- ⏳ Migrate from localStorage (next step)
- ⏳ Implement authentication (next step)
- ⏳ Deploy to production (final step)

---

## 🆘 Getting Help

If you encounter issues:

1. Check the Debug Console (🐛) for detailed error messages
2. Review browser console (F12)
3. Check Supabase dashboard logs
4. Visit Supabase Discord: https://discord.supabase.com
5. File an issue on GitHub

---

**Status**: ✅ Connected and Ready for Development!

Current setup allows you to:
- Test Supabase connectivity
- Write queries for orders and admins
- Implement authentication
- Build real-time features

Next: Create database tables and migrate from localStorage.
