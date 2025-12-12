# WhatsApp Integration - Quick Start

**Time to activate**: ~5 minutes  
**Requirements**: CallMeBot API key (free)  
**Status**: ✅ All code implemented and ready

## 1️⃣ Get Your API Key (2 minutes)

1. **Open WhatsApp** on your phone
2. **Search for contact**: `+34 644 91 40 40` (CallMeBot)
3. **Send message**: `I want to use CallMeBot`
4. **Receive API key** in response
5. **Copy the key**

Example response:
```
Your API key is: abc123def456
```

## 2️⃣ Configure Environment (1 minute)

**Edit `.env` file:**

```env
CALLMEBOT_PHONE=+201109318581
CALLMEBOT_API_KEY=YOUR_KEY_HERE     ← Replace with actual key
CALLMEBOT_BASE_URL=https://api.callmebot.com/whatsapp.php
DEBUG_WHATSAPP=true                 ← Set to false in production
```

## 3️⃣ Test It Works (1 minute)

**Terminal**:
```bash
cd e:\Programming\Ghadwa-Teams
npm run dev
```

**Browser DevTools Console** (F12):
```javascript
fetch('/api/test-whatsapp')
  .then(r => r.json())
  .then(console.log)
```

**Expected Output**:
```json
{
  "success": true,
  "message": "WhatsApp service is configured",
  "config": {
    "phone": "+201109****81",
    "apiKey": "abc****xyz",
    "ready": true
  },
  "status": "connected"
}
```

## 4️⃣ Send First Message (1 minute)

**Browser DevTools Console**:
```javascript
fetch('/api/notify-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderId: 1,
    customerName: 'Test User',
    total: 100,
    chefName: 'Test Chef',
    deliveryAddress: 'Cairo, Egypt',
    items: [
      { name: 'Koshari', quantity: 1, price: 100 }
    ]
  })
})
.then(r => r.json())
.then(console.log)
```

**Your phone will receive WhatsApp message** ✅

## Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `api/lib/whatsapp/index.ts` | 300+ | Main sendWhatsAppMessage function |
| `api/lib/whatsapp/types.ts` | 150 | TypeScript interfaces |
| `api/lib/whatsapp/config.ts` | 100 | Configuration & validation |
| `api/lib/whatsapp/formatter.ts` | 250 | Message formatting |
| `api/notify-admin.ts` | 80 | Admin notification endpoint |
| `api/notify-customer.ts` | 95 | Customer status updates |
| `api/test-whatsapp.ts` | 100 | Testing & diagnostics |

## Usage Examples

### Send Admin Notification

```javascript
// From React component or API route
const response = await fetch('/api/notify-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderId: 123,
    customerName: 'Ahmed Hassan',
    customerPhone: '+201234567890',
    total: 150,
    chefName: 'Umm Fatima',
    deliveryAddress: 'Downtown Cairo',
    items: [
      { name: 'Koshari', quantity: 2, price: 75 },
      { name: 'Fresh Juice', quantity: 1, price: 15 }
    ],
    notes: 'No onions'
  })
})

const data = await response.json()
console.log(data) // { success: true, ... }
```

### Send Customer Status Update

```javascript
const response = await fetch('/api/notify-customer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone: '+201234567890',
    orderId: 123,
    status: 'preparing',      // or 'out_for_delivery', 'delivered'
    chefName: 'Umm Fatima',
    estimatedTime: '30-45 minutes'
  })
})
```

### Use Directly in Code

```typescript
import { sendWhatsAppMessage } from '@/api/lib/whatsapp'

const result = await sendWhatsAppMessage({
  phone: '+201109318581',
  message: 'Hello World 🌍'
})

console.log(`Sent to ${result.phone}`)
console.log(`Message: ${result.messageLength} chars`)
console.log(`Time: ${result.timestamp}`)
```

## Integration Points

### 1. After Order Creation (CheckoutPage)

```typescript
// Place after successful order creation
fetch('/api/notify-admin', {
  method: 'POST',
  body: JSON.stringify(orderData)
}).catch(err => console.warn('Notification failed:', err))
```

### 2. When Admin Updates Order Status

```typescript
// In AdminOrders component
fetch('/api/notify-customer', {
  method: 'POST',
  body: JSON.stringify({
    phone: order.customerPhone,
    orderId: order.id,
    status: newStatus,
    chefName: order.chefName
  })
}).catch(err => console.warn('Notification failed:', err))
```

## Message Format

Messages sent look like:

```
🎉 *NEW ORDER #123*

*Customer:* Ahmed Hassan
*Phone:* +20 1234 567890
*Total:* EGP 150.00
*Chef:* Umm Fatima
*Address:* Downtown Cairo

*Items:*
• Koshari x2 - EGP 75
• Fresh Juice x1 - EGP 15

*Notes:* No onions please

⏰ Please prepare the order. Customer is waiting!
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Invalid API Key` | Get key from CallMeBot (steps above) |
| `Invalid phone` | Use format: `+{countryCode}{number}` |
| `Message too long` | Max 4096 characters |
| `Timeout` | Network slow, auto-retries 3x |
| `Network error` | Check internet connection |

## Debug Mode

**Enable debug logging** in `.env`:

```env
DEBUG_WHATSAPP=true
```

Check browser console for detailed logs:

```
[WhatsApp] Sending to +201109****81...
[WhatsApp] Message sent (284 chars)
```

## Next Steps

After testing works:

1. **Integrate into CheckoutPage**: Add notification after order creation
2. **Integrate into AdminOrders**: Add notification on status change
3. **Add customer phone collection**: Update checkout form
4. **Monitor in production**: Check Vercel function logs

## Limits & Rate Limiting

**CallMeBot Limits**:
- Personal use: ~30 messages/day
- No official rate limit stated
- Implement backoff on failures

**Implement Rate Limiting** (optional):

```typescript
// In Vercel function
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10
})

export default limiter(handler)
```

## Security Notes

✅ **What's Secure**:
- API keys never exposed in frontend
- Phone numbers masked in logs
- Validation on all inputs
- Environment variables only

⚠️ **What to Watch**:
- Keep `.env` file private (don't commit)
- Don't log full API key
- Validate customer phone numbers
- Implement rate limits

## Support

**CallMeBot Docs**: https://www.callmebot.com/blog/free-api-whatsapp-messages/

**Issues**:
1. Check `.env` configuration
2. Verify internet connection
3. Test with `/api/test-whatsapp`
4. Check Vercel function logs

---

✅ **Ready to use!** Follow steps 1-4 above to get started.
