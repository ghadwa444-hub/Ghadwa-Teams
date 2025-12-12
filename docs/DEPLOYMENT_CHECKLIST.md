# VERCEL DEPLOYMENT CHECKLIST
## Ghadwa Food Delivery App - Step-by-Step Guide

---

## 🎯 PRE-DEPLOYMENT (Must Complete Before Pushing)

### Security & Credentials (15 minutes)

- [ ] **Remove SECRET_KEY from .env**
  ```bash
  # Edit .env file and REMOVE this line:
  # VITE_SUPABASE_SECRET_KEY=sb_secret_...
  ```
  **Why**: Frontend should never have write access to database

- [ ] **Remove .env from Git tracking**
  ```bash
  git rm --cached .env
  echo ".env" >> .gitignore
  git commit -m "Remove .env from version control"
  ```

- [ ] **Create .env.example** (template for developers)
  ```dotenv
  # .env.example (DO NOT include real values)
  VITE_SUPABASE_URL=your_supabase_url
  VITE_SUPABASE_ANON_KEY=your_publishable_key
  VITE_ENV=development
  ```

- [ ] **Verify .gitignore includes .env**
  ```bash
  grep ".env" .gitignore
  ```

### Local Testing (10 minutes)

- [ ] **Clean install dependencies**
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

- [ ] **Run production build locally**
  ```bash
  npm run build
  # Should complete with: ✅ Built in 3.6s
  ```

- [ ] **Test preview build**
  ```bash
  npm run preview
  # Visit http://localhost:4173
  # Test cart, checkout, and navigation
  ```

- [ ] **Check browser console for errors**
  - F12 → Console tab
  - Should show only info/debug logs
  - No red error messages

- [ ] **Verify environment variables loaded**
  ```javascript
  // In browser console:
  console.log(import.meta.env.VITE_SUPABASE_URL)
  // Should print the URL, not undefined
  ```

### Git Verification (5 minutes)

- [ ] **Check Git status**
  ```bash
  git status
  # .env should NOT be listed
  ```

- [ ] **Review commits before push**
  ```bash
  git log --oneline -n 5
  # Verify last commit message is clear
  ```

- [ ] **Ensure branch is clean**
  ```bash
  git diff --name-only
  # Should be empty (no uncommitted changes)
  ```

---

## 🚀 DEPLOYMENT TO VERCEL

### Initial Setup (One-time)

- [ ] **Create Vercel account** (if needed)
  - Visit: https://vercel.com/signup
  - Sign up with GitHub

- [ ] **Connect GitHub repository**
  - Vercel Dashboard → New Project
  - Select your Ghadwa repository
  - Accept default settings (Vite detects automatically)

### Environment Variables in Vercel

- [ ] **Go to Vercel Project Settings**
  - URL: https://vercel.com/dashboard/projects
  - Click your project name
  - Click "Settings" tab

- [ ] **Navigate to Environment Variables**
  - Left sidebar → Environment Variables

- [ ] **Add Production Variables**
  ```
  Name: VITE_SUPABASE_URL
  Value: https://yncbyxxkvexraceqvnwr.supabase.co
  Environments: ✅ Production, Preview
  
  Name: VITE_SUPABASE_ANON_KEY
  Value: sb_publishable_ShN9AjTOa_YM4xd85d_VQw_v3SNV0qC
  Environments: ✅ Production, Preview
  
  Name: VITE_ENV
  Value: production
  Environments: ✅ Production
  ```

- [ ] **Skip these variables** (DO NOT add)
  ```
  ❌ VITE_SUPABASE_SECRET_KEY
  ❌ CALLMEBOT_API_KEY (until you have it)
  ```

### Deploy Code

- [ ] **Push code to GitHub**
  ```bash
  git push origin main
  # Vercel auto-deploys on push
  ```

- [ ] **Monitor deployment in Vercel**
  - Vercel Dashboard → Select project
  - Watch build progress
  - Should complete in 30-60 seconds

- [ ] **Wait for deployment to complete**
  - Status should change to: ✅ Ready
  - Vercel provides deployment URL (e.g., `ghadwa-ai.vercel.app`)

---

## ✅ POST-DEPLOYMENT VERIFICATION

### Test Deployment URL (10 minutes)

- [ ] **Visit deployment URL**
  - Open URL provided by Vercel
  - Page should load in 2-3 seconds

- [ ] **Check console for errors**
  - F12 → Console tab
  - No red error messages
  - Should see "🚀 Ghadwa Application Starting"

- [ ] **Test core functionality**
  - [ ] Homepage loads
  - [ ] Click "All Chefs" works
  - [ ] Click chef card opens details
  - [ ] Add item to cart works
  - [ ] Cart drawer opens/closes
  - [ ] Search filters items
  - [ ] Categories filter works

- [ ] **Verify Supabase connection**
  ```javascript
  // In browser console:
  window.GhadwaSupabase.healthCheck().then(r => console.log(r))
  // Should show: "✅ Supabase connection successful"
  ```

- [ ] **Check responsive design**
  - Resize browser window
  - Mobile view (320px) works
  - Tablet view (768px) works
  - Desktop view (1280px) works

### Performance Verification

- [ ] **Check bundle size**
  ```javascript
  // In browser DevTools Network tab:
  // index-*.js should be ~150-200 kB (gzipped)
  ```

- [ ] **Test page load time**
  - Network tab → Throttle to "Slow 3G"
  - Refresh page
  - Should load within 5-8 seconds

- [ ] **Verify images load**
  - All chef images visible
  - All menu item images visible
  - No broken image icons

- [ ] **Check favicon loads**
  - Browser tab should show Ghadwa logo
  - Not a generic icon

---

## 🔧 CUSTOM DOMAIN SETUP (Requirement #7)

### Register Domain (if needed)

- [ ] **Register domain** (or use existing)
  - Popular registrars: Namecheap, GoDaddy, Google Domains
  - Domain example: `ghadwa.app`

### Connect Domain to Vercel

- [ ] **Go to Vercel Project Settings**
  - Settings → Domains

- [ ] **Add domain**
  - Click "Add Domain"
  - Enter: `ghadwa.app`
  - Vercel shows DNS configuration

- [ ] **Configure DNS records**
  - Go to domain registrar
  - Add DNS records:
    ```
    Type: A
    Name: @
    Value: 76.76.19.165
    
    Type: CNAME
    Name: www
    Value: cname.vercel-dns.com
    ```

- [ ] **Wait for DNS propagation**
  - Can take 5 minutes to 48 hours
  - Check progress in Vercel dashboard

- [ ] **Verify domain works**
  - Visit `ghadwa.app`
  - Should show your deployed app
  - HTTPS should work automatically

---

## 📊 MONITORING & MAINTENANCE

### Daily (First Week)

- [ ] **Check Vercel Analytics**
  - Any build failures?
  - Any deployment errors?
  - Performance metrics normal?

- [ ] **Monitor application logs**
  - Console tab for runtime errors
  - Browser network tab for failed requests
  - Supabase for connection issues

- [ ] **Test key user flows**
  - Browse menu
  - Add to cart
  - Checkout flow
  - Order tracking

### Weekly

- [ ] **Review Vercel metrics**
  - Build time
  - Function execution time
  - Error rate

- [ ] **Check for TypeScript errors**
  - Build logs for compilation warnings
  - Any new dependency conflicts?

- [ ] **Monitor Supabase**
  - Check API quota usage
  - Database performance
  - Connection status

### Monthly

- [ ] **Dependency updates**
  ```bash
  npm outdated
  npm update
  ```

- [ ] **Security audit**
  ```bash
  npm audit
  ```

- [ ] **Performance review**
  - Run Lighthouse audit
  - Check bundle size changes
  - Review slow endpoints

---

## 🆘 TROUBLESHOOTING

### Build Fails

**Error**: "Cannot find module..."
```bash
# Solution:
npm install
npm run build
```

**Error**: "TypeScript compilation error"
```bash
# Check for syntax errors:
npx tsc --noEmit
```

### Environment Variables Not Found

**Problem**: `VITE_SUPABASE_URL is undefined`

**Solution**:
1. Check Vercel dashboard for variables
2. Redeploy after adding variables
3. Wait 2-3 minutes for values to propagate

### Blank Page After Deploy

**Problem**: App loads but shows blank screen

**Solution**:
1. Check console (F12) for JavaScript errors
2. Verify all environment variables set
3. Check Supabase connection

### Slow Performance

**Problem**: App takes 5+ seconds to load

**Solutions**:
1. Check network tab for slow requests
2. Verify Supabase URL is correct
3. Check if API is responding slowly
4. Monitor Vercel analytics

### CORS Errors

**Problem**: API calls fail with CORS error

**Solution**: Supabase handles CORS automatically
- Verify VITE_SUPABASE_URL is correct
- Check browser console for actual error
- Verify API key is valid

---

## 📞 SUPPORT RESOURCES

| Issue | Resource |
|-------|----------|
| Vercel deployment | https://vercel.com/help |
| Supabase connection | https://supabase.com/docs |
| Build errors | Check Vercel build logs |
| Runtime errors | Browser console (F12) |
| DNS issues | Domain registrar support |

---

## ✨ SUCCESS CRITERIA

You've successfully deployed when:

- ✅ Vercel shows "✅ Ready" status
- ✅ Deployment URL works in browser
- ✅ No red errors in console
- ✅ All pages load (home, chefs, checkout)
- ✅ Supabase health check passes
- ✅ Images load correctly
- ✅ Responsive design works
- ✅ Performance is acceptable (~2-3s load)
- ✅ Custom domain works (if configured)

---

## 🎉 POST-SUCCESS

Once deployed successfully:

- [ ] Share deployment URL with team
- [ ] Update documentation with live URL
- [ ] Set up error monitoring (optional)
- [ ] Plan Requirement #7 (domain setup)
- [ ] Schedule next feature planning

---

## 📝 NOTES

- Save this checklist for future reference
- Update URLs/credentials as needed
- Document any custom configurations
- Keep deployment notes for troubleshooting

---

**Last Updated**: December 9, 2025  
**Status**: ✅ Ready for Deployment  
**Est. Time**: 30-45 minutes (including all steps)

**Good luck with deployment! 🚀**
