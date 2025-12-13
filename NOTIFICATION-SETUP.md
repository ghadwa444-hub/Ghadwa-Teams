# 📧 Notification System Setup Guide

## ✅ Implementation Complete!

The notification system has been fully integrated into your Ghadwa Teams app. Now you just need to configure at least one notification service.

---

## 🎯 What Was Added

### New Files Created:
1. **`config/env.ts`** - Environment variable configuration
2. **`services/notifications/`** - Notification service modules:
   - `freeNotificationService.ts` - Orchestrates all services
   - `emailNotificationService.ts` - EmailJS integration
   - `formspreeNotificationService.ts` - Formspree integration
   - `notificationService.ts` - Generic webhook support
   - `index.ts` - Exports all services

### Modified Files:
1. **`.env`** - Added notification configuration variables
2. **`services/api.ts`** - Integrated notifications into order submission

---

## 📝 How It Works

When a customer places an order:
1. Order is saved to Supabase ✅
2. Notification is sent **asynchronously** (non-blocking) 📧
3. If notification fails, order still succeeds ✅
4. System tries multiple services until one works 🔄

---

## 🚀 Setup Instructions

Choose **ONE** of the following free notification services:

### Option 1: Formspree (Recommended - Easiest) ⭐

**Free tier: 50 submissions/month**

**Steps:**
1. Go to https://formspree.io/
2. Sign up for free account
3. Click "New Form"
4. Copy your form endpoint (looks like: `https://formspree.io/f/xpzgxyz`)
5. Add to `.env`:
   ```env
   VITE_EMAIL_WEBHOOK_URL=https://formspree.io/f/YOUR_FORM_ID
   VITE_NOTIFICATION_EMAIL=your-email@gmail.com
   ```
6. **Done!** Orders will be sent to your email automatically

**Formspree Features:**
- ✅ Super easy setup (just 1 URL)
- ✅ Receives emails in your inbox
- ✅ No API keys needed
- ✅ 50 emails/month free
- ✅ Web dashboard to view submissions

---

### Option 2: EmailJS

**Free tier: 200 emails/month**

**Steps:**
1. Go to https://www.emailjs.com/
2. Sign up for free account
3. **Add Email Service:**
   - Go to "Email Services"
   - Click "Add New Service"
   - Choose Gmail/Outlook/etc
   - Connect your email account
   - Copy the **Service ID**

4. **Create Email Template:**
   - Go to "Email Templates"
   - Click "Create New Template"
   - Use this template:
   ```
   Subject: 🍽️ طلب جديد - New Order #{{order_id}}

   من: {{from_name}}
   
   معلومات العميل - Customer Information:
   👤 الاسم: {{customer_name}}
   📱 الهاتف: {{phone}}
   📍 العنوان: {{address}}
   
   تفاصيل الطلب - Order Details:
   🍲 الطلب: {{items}}
   💰 الإجمالي: {{price}} EGP
   
   📝 ملاحظات: {{notes}}
   🕐 الوقت: {{timestamp}}
   ```
   - Copy the **Template ID**

5. **Get Public Key:**
   - Go to "Account" → "General"
   - Copy your **Public Key** (User ID)

6. **Add to `.env`:**
   ```env
   VITE_EMAIL_WEBHOOK_URL=https://api.emailjs.com/api/v1.0/email/send
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_USER_ID=your_public_key
   VITE_NOTIFICATION_EMAIL=admin@ghadwa.com
   ```

**EmailJS Features:**
- ✅ 200 emails/month free
- ✅ Custom email templates
- ✅ Multiple email services
- ✅ Email analytics

---

### Option 3: Discord Webhook (For Team Notifications)

**Unlimited - Perfect for internal team notifications**

**Steps:**
1. Open your Discord server
2. Right-click on a text channel → "Edit Channel"
3. Go to "Integrations" → "Webhooks"
4. Click "New Webhook"
5. Give it a name (e.g., "Ghadwa Orders")
6. Copy the webhook URL
7. Add to `.env`:
   ```env
   VITE_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_URL
   ```

**Discord Features:**
- ✅ Unlimited notifications
- ✅ Real-time alerts
- ✅ Mobile notifications
- ✅ Team collaboration
- ✅ Rich formatting support

---

### Option 4: Slack Webhook (For Business)

**Steps:**
1. Go to https://api.slack.com/apps
2. Create new app
3. Enable "Incoming Webhooks"
4. Add new webhook to workspace
5. Copy the webhook URL
6. Add to `.env`:
   ```env
   VITE_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   ```

---

## 🧪 Testing Your Setup

After configuring a service:

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Create a test order:**
   - Add items to cart
   - Go to checkout
   - Fill in details
   - Submit order

3. **Check notifications:**
   - **Formspree/EmailJS:** Check your email inbox
   - **Discord:** Check your Discord channel
   - **Slack:** Check your Slack channel

4. **Check console logs:**
   ```
   [API_ORDERS] ✅ Order saved to Supabase
   [API_ORDERS] 📧 Notification sent via Formspree Email
   ```

---

## 📊 Multiple Services (Optional)

You can configure **multiple services** to receive notifications in different places:

**Example: Email + Discord**
```env
# Email notifications
VITE_EMAIL_WEBHOOK_URL=https://formspree.io/f/YOUR_FORM_ID
VITE_NOTIFICATION_EMAIL=admin@ghadwa.com

# Discord notifications  
VITE_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK
```

The system will send to **all configured services** automatically!

---

## 🔍 Troubleshooting

### "Notification not sent (service not configured)"
→ You haven't added any webhook URL to `.env`
→ This is **normal** and won't affect orders

### "Notification sending failed"
→ Check the webhook URL is correct
→ Verify the service is working (test on their website)
→ Check browser console for detailed error

### Email not received
→ Check spam folder
→ Verify `VITE_NOTIFICATION_EMAIL` is correct
→ For EmailJS: Verify template and service IDs

### Orders work but no notifications
→ **This is intentional!** Orders always succeed even if notifications fail
→ Notifications are non-blocking to ensure smooth user experience

---

## 🎯 Recommended Setup

**For Small Business (Free):**
```env
VITE_EMAIL_WEBHOOK_URL=https://formspree.io/f/YOUR_FORM_ID
VITE_NOTIFICATION_EMAIL=owner@business.com
```

**For Team Collaboration (Free):**
```env
VITE_EMAIL_WEBHOOK_URL=https://formspree.io/f/YOUR_FORM_ID
VITE_NOTIFICATION_EMAIL=admin@ghadwa.com
VITE_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK
```

**For Enterprise (Free):**
```env
VITE_EMAIL_WEBHOOK_URL=https://api.emailjs.com/api/v1.0/email/send
VITE_EMAILJS_SERVICE_ID=service_xyz
VITE_EMAILJS_TEMPLATE_ID=template_xyz
VITE_EMAILJS_USER_ID=user_xyz
VITE_NOTIFICATION_EMAIL=orders@company.com
VITE_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK
```

---

## 📈 Next Steps

1. ✅ Choose and configure **one** notification service
2. ✅ Test with a real order
3. ✅ Run the SQL script to fix RLS policies (if not done yet)
4. ✅ Deploy to production
5. ✅ Monitor notifications in your inbox/Discord/Slack

---

## 🆘 Need Help?

Check these:
1. Browser console for error messages
2. `.env` file syntax (no quotes, no spaces around `=`)
3. Restart dev server after changing `.env`
4. Service status pages (if webhook fails)

**Still stuck?** Share:
- Console logs
- Which service you're using
- Error message (if any)
