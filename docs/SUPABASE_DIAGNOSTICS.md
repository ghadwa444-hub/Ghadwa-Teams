# Supabase Diagnostics Guide

## 🔍 Issue Detected

Your test results show:
```
Auth Service: ✅ Connected
Database Service: ❌ Failed - ERR_NAME_NOT_RESOLVED
```

**What this means:** The authentication system works, but the database connection fails because the Supabase URL cannot be resolved.

---

## 🧪 Run Full Diagnostic

Open browser console (F12 → Console) and run:

```javascript
window.GhadwaSupabaseDiag.fullReport().then(report => {
  console.log('=== DIAGNOSTIC REPORT ===');
  console.log(report);
  console.log('========================');
});
```

This will check:
1. ✅ Environment variables are set
2. ✅ URL format is valid
3. ✅ URL is accessible
4. ✅ Provide recommendations

---

## 🔧 Quick Diagnostic Commands

### 1. Check Environment Variables
```javascript
window.GhadwaSupabaseDiag.checkEnvVars();
```

Expected output:
```
{
  VITE_SUPABASE_URL: {
    exists: true,
    value: "https://sfvslhcylilnydnhhgnc...",
    format: "✅ Valid format"
  },
  VITE_SUPABASE_ANON_KEY: {
    exists: true,
    value: "sb_publishable_ShN9AjTOa...",
    format: "✅ Valid format"
  }
}
```

### 2. Test URL Accessibility
```javascript
window.GhadwaSupabaseDiag.testURLAccessibility().then(result => {
  console.log(result);
});
```

### 3. Get Recommendations
After running full report, check the `recommendations` array for specific actions.

---

## ⚠️ Common Issues & Fixes

### Issue 1: "ERR_NAME_NOT_RESOLVED"

**Cause:** DNS cannot resolve the Supabase domain

**Solutions:**
1. **Verify URL in `.env` file**
   ```
   VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   ```

2. **Check if Supabase Project is Active**
   - Go to https://supabase.com/dashboard
   - Click on your project
   - Ensure it's not "paused"
   - Click "Resume" if paused

3. **Verify the Project ID**
   - In Supabase dashboard, go to Project Settings
   - Find "API" section
   - Copy the project URL (should be the domain part)
   - Example: `https://abc123def456.supabase.co`

4. **Check Internet Connection**
   - Open https://google.com in new tab
   - If it works, your connection is fine
   - If not, fix your internet

### Issue 2: "Missing Supabase credentials"

**Cause:** `.env` file not loaded or variables not set

**Solutions:**
1. **Verify `.env` file exists**
   ```bash
   # In terminal
   cat .env
   ```

2. **Check `.env` format**
   ```
   # ✅ CORRECT
   VITE_SUPABASE_URL=https://xyz.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_key_123
   
   # ❌ WRONG (with quotes)
   VITE_SUPABASE_URL="https://xyz.supabase.co"
   
   # ❌ WRONG (with spaces)
   VITE_SUPABASE_URL = https://xyz.supabase.co
   ```

3. **Restart Dev Server**
   - Press `Ctrl+C` in terminal running `npm run dev`
   - Run `npm run dev` again
   - Hard refresh browser (Ctrl+Shift+R)

### Issue 3: "Cannot read properties of undefined"

**Cause:** Supabase client not initialized

**Solutions:**
1. **Verify imports in index.tsx**
   - Should include: `import './services/supabase';`
   - Should include: `import './services/supabase-diagnostics';`

2. **Check console for initialization logs**
   - Look for: `[INFO] [SUPABASE] 🔌 Initializing Supabase client`
   - If missing, restart dev server

3. **Verify supabase.ts exists**
   ```bash
   ls services/supabase.ts
   ```

---

## 📋 Supabase Setup Checklist

Before running the health check, verify:

- [ ] You have a Supabase account (https://supabase.com)
- [ ] You created a project
- [ ] Project is **active** (not paused)
- [ ] You copied the **Project URL** from dashboard
- [ ] You copied the **Public API Key** (anon key)
- [ ] `.env` file has both values
- [ ] `.env` format is correct (no quotes, no spaces)
- [ ] Dev server restarted after creating `.env`
- [ ] Browser hard-refreshed (Ctrl+Shift+R)

---

## 🆘 Still Having Issues?

### Step 1: Verify Supabase Project Exists

1. Go to https://supabase.com/dashboard
2. Login to your account
3. You should see your project listed
4. Click on it to open
5. Copy the URL from the top or from Settings → API

### Step 2: Verify Credentials Format

The credentials you provided should look like:
```
URL: https://PROJECTID.supabase.co
Anon Key: sb_publishable_XXXXX
Secret Key: sb_secret_XXXXX
```

**Not like:**
```
URL: supabase.co (missing https:// and project ID)
Anon Key: shN9AjTOa_YM4xd85d_VQw_v3SNV0qC (missing sb_publishable_ prefix)
```

### Step 3: Update `.env` Correctly

```bash
# Linux/Mac
nano .env

# Windows PowerShell
notepad .env
```

Add/update these lines:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_YOUR_KEY_HERE
VITE_SUPABASE_SECRET_KEY=sb_secret_YOUR_KEY_HERE
VITE_ENV=development
```

### Step 4: Restart Everything

```bash
# Stop dev server
# Press Ctrl+C in the terminal running npm run dev

# Start dev server
npm run dev

# In browser
# Press Ctrl+Shift+R to hard refresh
```

### Step 5: Test Again

```javascript
window.GhadwaSupabaseDiag.fullReport().then(report => console.log(report));
```

---

## 📊 Expected Successful Output

When everything is working:

**Console Logs:**
```
✅ [SUPABASE] 🔌 Initializing Supabase client
✅ [SUPABASE] 🪟 Supabase exposed on window.GhadwaSupabase
✅ [SUPABASE_DIAG] 🪟 Diagnostics exposed on window.GhadwaSupabaseDiag
✅ [SUPABASE] ✅ Supabase connection successful
✅ [SUPABASE] ✅ Database connection successful
```

**Health Check Result:**
```json
{
  "connected": true,
  "auth": true,
  "database": true,
  "timestamp": "2025-12-10T12:30:45.123Z"
}
```

**Diagnostic Report:**
```json
{
  "timestamp": "2025-12-10T12:30:45.123Z",
  "environmentVariables": {
    "VITE_SUPABASE_URL": {
      "exists": true,
      "format": "✅ Valid format"
    },
    "VITE_SUPABASE_ANON_KEY": {
      "exists": true,
      "format": "✅ Valid format"
    }
  },
  "urlAccessibility": {
    "accessible": true,
    "status": 200
  },
  "recommendations": [
    "✅ All checks passed! Your Supabase setup looks good."
  ]
}
```

---

## 🔗 Helpful Resources

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Project Settings**: In dashboard, click ⚙️ icon → API
- **API Keys**: Under Settings → API → Project API keys
- **Status Page**: https://status.supabase.com

---

## 💬 Need More Help?

If you still can't connect after following all steps:

1. **Share the diagnostic report**
   - Run: `window.GhadwaSupabaseDiag.fullReport().then(r => console.log(JSON.stringify(r, null, 2)))`
   - Copy the full output

2. **Check the specific error**
   - Look in the Debug Console (🐛 icon)
   - Filter by "SUPABASE" module
   - Find the exact error message

3. **Verify your Supabase project**
   - Visit https://supabase.com/dashboard
   - Check project exists
   - Check it's not paused
   - Check API section for correct credentials

4. **Contact Supabase Support**
   - Supabase Discord: https://discord.supabase.com
   - Email: support@supabase.com

---

## ⏱️ Typical Resolution Time

- **Environment variables issue**: 2-3 minutes (restart needed)
- **URL format issue**: 1-2 minutes (copy correct URL)
- **Project paused**: 30 seconds (click resume)
- **Network issue**: 5+ minutes (wait or check internet)

**Once fixed, health check will return `connected: true` ✅**

---

**Last Updated:** December 10, 2025
**Status**: Diagnostic tools deployed ✅
