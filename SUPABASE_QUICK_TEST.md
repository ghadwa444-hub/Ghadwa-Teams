# Supabase Connection Test - Quick Reference

## 🧪 Test Supabase Connection Right Now

### Step 1: Open Browser Console
- Press **F12** or **Ctrl+Shift+I**
- Click on **Console** tab

### Step 2: Run Health Check

Copy and paste this into the console:

```javascript
window.GhadwaSupabase.healthCheck().then(result => {
  console.log('=== SUPABASE HEALTH CHECK ===');
  console.log('Connected:', result.connected);
  console.log('Auth Service:', result.auth ? '✅' : '❌');
  console.log('Database Service:', result.database ? '✅' : '❌');
  console.log('Timestamp:', result.timestamp);
  console.log('==============================');
});
```

### Step 3: Check Expected Output

**Success:**
```
=== SUPABASE HEALTH CHECK ===
Connected: true
Auth Service: ✅
Database Service: ✅
Timestamp: 2025-12-10T12:30:45.123Z
==============================
```

**Failure:**
```
=== SUPABASE HEALTH CHECK ===
Connected: false
Auth Service: ❌
Database Service: ❌
```

---

## 📝 Manual Test Functions

### Test Auth Connection Only
```javascript
window.GhadwaSupabase.testConnection().then(result => {
  console.log('Auth Connected:', result);
});
```

### Test Database Connection Only
```javascript
window.GhadwaSupabase.testDatabase().then(result => {
  console.log('DB Connected:', result);
});
```

### Access Supabase Client Directly
```javascript
const client = window.GhadwaSupabase.client;
console.log('Supabase Client:', client);

// Try a simple query
const { data, error } = await client.auth.getSession();
console.log('Session:', data.session, 'Error:', error);
```

---

## ✅ What Success Looks Like

When the connection test passes, you should see in the console:

```
[INFO] [SUPABASE] 🔌 Initializing Supabase client
[INFO] [SUPABASE] 🪟 Supabase exposed on window.GhadwaSupabase for testing
[INFO] [SUPABASE] 🔍 Testing Supabase connection...
[INFO] [SUPABASE] ✅ Supabase connection successful
[INFO] [SUPABASE] 🗄️ Testing database connection...
[INFO] [SUPABASE] ⚠️ Users table not found (expected for fresh projects)
[INFO] [SUPABASE] 🏥 Health check complete
```

---

## ❌ Troubleshooting

### Error: "Cannot read properties of undefined"

**Cause:** `.env` file not loaded properly

**Fix:**
1. Verify `.env` file exists in root directory
2. Restart dev server (`npm run dev`)
3. Hard refresh browser (Ctrl+Shift+R)

### Error: "Missing Supabase credentials"

**Cause:** Environment variables not set

**Fix:**
1. Check `.env` file has these lines:
   ```
   VITE_SUPABASE_URL=https://sfvslhcylilnydnhhgnc.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_ShN9AjTOa_YM4xd85d_VQw_v3SNV0qC
   ```
2. Restart dev server

### Error: "WebSocket connection failed"

**Cause:** Network issue or Supabase service down

**Fix:**
1. Check internet connection
2. Visit https://status.supabase.com to check service status
3. Try again in a few minutes

### Error: "Table does not exist"

**Cause:** Database tables not created yet

**Fix:**
This is NORMAL for a fresh Supabase project. You need to:
1. Create tables in Supabase dashboard
2. Or run SQL migrations (see `SUPABASE_SETUP.md`)

---

## 📊 Connection Status Indicators

### In Debug Console (🐛 icon)

Look for these modules:
- **SUPABASE** - Main Supabase logs
- **SUPABASE_TEST** - Test component logs
- **API_STORAGE** - Storage operations

Filter to see only Supabase-related logs.

### Color Codes
- 🟢 **GREEN** - Success
- 🟡 **YELLOW** - Warning (expected)
- 🔴 **RED** - Error
- 🔵 **BLUE** - Debug info

---

## 🎯 Next Steps After Successful Connection

1. **Create Database Tables**
   - Orders table
   - Admin accounts table
   - Menu items table
   - See `SUPABASE_SETUP.md` for SQL

2. **Migrate Data**
   - Move orders from localStorage → Supabase
   - Move menu items → Supabase
   - Keep customer data in localStorage for now

3. **Implement Authentication**
   - Admin signup/login
   - Session management
   - Role-based permissions

4. **Real-time Features**
   - Order status updates
   - Live notifications
   - Live tracking

---

## 🔗 Important Files

- **Configuration**: `.env`
- **Client Code**: `services/supabase.ts`
- **Test Component**: `components/SupabaseTest.tsx`
- **Setup Guide**: `SUPABASE_SETUP.md`
- **This File**: `SUPABASE_QUICK_TEST.md`

---

## ⏱️ Typical Test Time

- Opening console: ~5 seconds
- Running test: ~2-3 seconds
- Getting results: ~1-2 seconds

**Total: ~10 seconds** ⚡

---

## 🎉 Success!

Once your health check returns `connected: true`, you're ready to:
- Save orders to Supabase
- Manage admin accounts
- Track order status in database
- Build real-time features

Celebrate! 🎊
