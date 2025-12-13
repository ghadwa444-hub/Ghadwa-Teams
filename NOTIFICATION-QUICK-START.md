# 📧 Quick Start - Notifications

## ⚡ Fastest Setup (2 minutes)

### Step 1: Choose Service
**Formspree** (Easiest) - https://formspree.io/

### Step 2: Get URL
1. Sign up free
2. Create form
3. Copy URL: `https://formspree.io/f/xpzgxyz`

### Step 3: Configure
Open `.env` and add:
```env
VITE_EMAIL_WEBHOOK_URL=https://formspree.io/f/YOUR_FORM_ID
VITE_NOTIFICATION_EMAIL=your-email@gmail.com
```

### Step 4: Restart
```bash
npm run dev
```

### Step 5: Test
- Place an order
- Check your email inbox
- Look for: "🍽️ طلب جديد - New Order"

**✅ Done! Orders will email you automatically.**

---

## 🎯 Service Comparison

| Service | Free Tier | Setup Time | Best For |
|---------|-----------|------------|----------|
| **Formspree** | 50/month | 2 min | Beginners, Email |
| **EmailJS** | 200/month | 5 min | Custom templates |
| **Discord** | Unlimited | 3 min | Teams, Real-time |
| **Slack** | Unlimited | 5 min | Business |

---

## 🔧 Configuration Variables

```env
# Required (choose ONE):
VITE_EMAIL_WEBHOOK_URL=          # Formspree or EmailJS URL
VITE_WEBHOOK_URL=                # Discord/Slack webhook

# Required for EmailJS only:
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_USER_ID=

# Required for email notifications:
VITE_NOTIFICATION_EMAIL=admin@ghadwa.com
```

---

## 📝 What Happens When Order is Placed

1. ✅ Order saved to Supabase
2. 📧 Notification sent (async, non-blocking)
3. 🎉 User sees success message
4. 📬 You receive notification

**If notification fails: Order still succeeds** ✅

---

## 🆘 Common Issues

### No notifications received?
```bash
# Check console logs - should see:
[API_ORDERS] 📧 Notification sent via Formspree Email

# If you see:
[API_ORDERS] ⚠️ Notification not sent (service not configured)
# → Add webhook URL to .env and restart
```

### Email goes to spam?
- Add sender to contacts
- Mark as "Not Spam"
- Check Formspree verified sender

### Wrong email address?
- Check `VITE_NOTIFICATION_EMAIL` in `.env`
- Must match your account email

---

## 📖 Full Documentation
See: [NOTIFICATION-SETUP.md](NOTIFICATION-SETUP.md)
