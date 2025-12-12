# WhatsApp Notifications - Implementation Guide

**Status**: ✅ Complete - Ready for Integration  
**Created**: December 12, 2025  
**Last Updated**: December 12, 2025

## Overview

Complete WhatsApp notification system for the Ghadwa food delivery app using CallMeBot API. Enables admin and customer notifications with zero server-side dependencies.

## Files Created

### Core Module (Reusable Everywhere)

```
api/lib/whatsapp/
├── index.ts              # Main sendWhatsAppMessage() function - 300+ lines
├── types.ts              # TypeScript interfaces - 150 lines
├── config.ts             # Configuration & validation - 100 lines
├── formatter.ts          # Message formatting utilities - 250 lines
└── requirements.md       # Original specification (7800+ words)
```

### Vercel API Endpoints

```
api/
├── notify-admin.ts       # POST /api/notify-admin (admin notifications)
├── notify-customer.ts    # POST /api/notify-customer (status updates)
└── test-whatsapp.ts      # GET/POST /api/test-whatsapp (diagnostics)
```

### Environment Configuration

Updated `.env`:
```
CALLMEBOT_PHONE=+201109318581
CALLMEBOT_API_KEY=your_api_key_here
CALLMEBOT_BASE_URL=https://api.callmebot.com/whatsapp.php
DEBUG_WHATSAPP=false
```

## Module Documentation

### 1. Main Module: `api/lib/whatsapp/index.ts`

**Exports**:

```typescript
// Class
export class WhatsAppService {
  async send(options: SendWhatsAppOptions): Promise<SendWhatsAppResult>
  async getStatus(): Promise<boolean>
  getConfig(): { phone, apiKey, baseUrl, ready }
}

// Singleton functions
export function getWhatsAppService(): WhatsAppService
export async function sendWhatsAppMessage(
  options: SendWhatsAppOptions
): Promise<SendWhatsAppResult>

// Re-exports
export { WhatsAppError } from './types'
export * from './types'
export * from './config'
export * from './formatter'
```

**Key Features**:
- ✅ Automatic retry with exponential backoff (3 attempts)
- ✅ Request timeout handling (30 seconds)
- ✅ Message length validation (4096 char limit)
- ✅ Phone number validation
- ✅ Debug logging (controlled by `DEBUG_WHATSAPP`)
- ✅ Error handling with specific error codes
- ✅ Security: masks phone/API key in logs

**Usage Example**:

```typescript
import { sendWhatsAppMessage } from './lib/whatsapp'

const result = await sendWhatsAppMessage({
  phone: '+201109318581',
  message: '🎉 *NEW ORDER #123*\n\nCustomer: John\nTotal: EGP 150'
})

if (result.success) {
  console.log(`Message sent to ${result.phone}`)
}
```

### 2. Types Module: `api/lib/whatsapp/types.ts`

**Interfaces**:

```typescript
interface SendWhatsAppOptions {
  phone: string          // +{countryCode}{number}
  message: string        // Max 4096 chars
  apiKey?: string        // Override config
  baseUrl?: string       // Override config
}

interface SendWhatsAppResult {
  success: boolean
  phone: string          // Masked for security
  messageLength: number
  timestamp: string      // ISO format
  apiResponse?: { status, statusText, body }
}

interface WhatsAppConfig {
  phone: string
  apiKey: string
  baseUrl: string
  debug: boolean
}

// Notification types
interface OrderNotification { ... }
interface CustomerUpdateNotification { ... }
interface ChefNotification { ... }

// Error class
class WhatsAppError extends Error {
  code: string           // Specific error code for handling
  statusCode?: number
  details?: any
}
```

### 3. Config Module: `api/lib/whatsapp/config.ts`

**Functions**:

```typescript
// Load from environment
function loadWhatsAppConfig(): WhatsAppConfig

// Validate format
function isValidPhoneNumber(phone: string): boolean     // +XXXXXXXXXXXXX
function isValidApiKey(apiKey: string): boolean         // Min 10 chars
function isMessageTooLong(message: string): boolean     // > 4096 chars

// Mask for logging (security)
function maskPhoneNumber(phone: string): string         // +201109****81
function maskApiKey(apiKey: string): string             // abc****xyz

// Constants
const MAX_MESSAGE_LENGTH = 4096
const API_TIMEOUT_MS = 30000
const RETRY_CONFIG = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2
}
```

### 4. Formatter Module: `api/lib/whatsapp/formatter.ts`

**Message Formatters** (return ready-to-send formatted strings):

```typescript
// Admin notifications
function formatOrderCreatedMessage(order: OrderNotification): string
function formatOrderConfirmedMessage(order: OrderNotification): string

// Customer notifications
function formatPreparingMessage(notification: CustomerUpdateNotification): string
function formatOutForDeliveryMessage(notification: CustomerUpdateNotification): string
function formatDeliveredMessage(notification: CustomerUpdateNotification): string

// Other notifications
function formatCancelledMessage(orderId: number, chefName: string, reason?: string): string
function formatChefNewOrderMessage(notification: ChefNotification): string

// Utilities
function escapeWhatsAppText(text: string): string
function createSafeMessage(message: string, maxLength?: number): string
function formatEstimatedTime(minutes: number): string // "30-45 minutes"
function formatCurrency(amount: number): string        // "EGP 150.50"
function formatPhoneForDisplay(phone: string): string  // "+20 1109 318581"
```

**Message Format** (WhatsApp Markdown):

```
🎉 *NEW ORDER #123*            (*bold*)
Customer Name                 (*header like*)
Phone: +20 XXX XXX XXXX      (_italic_)
Total: EGP 150.00             (~strikethrough~)
```

## API Endpoints

### 1. Admin Notification: `POST /api/notify-admin`

**Request Body**:
```json
{
  "orderId": 123,
  "customerName": "Ahmed Hassan",
  "customerPhone": "+201234567890",
  "total": 150,
  "chefName": "Umm Fatima",
  "deliveryAddress": "Downtown, Cairo",
  "items": [
    { "name": "Koshari", "quantity": 2, "price": 30 },
    { "name": "Fresh Juice", "quantity": 1, "price": 15 }
  ],
  "notes": "No onions please"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Admin notification sent for order #123",
  "data": {
    "phone": "+201109****81",
    "messageLength": 284,
    "timestamp": "2025-12-12T10:30:00.000Z"
  }
}
```

**Error Response** (400/500):
```json
{
  "success": false,
  "error": "Invalid phone number configured",
  "code": "INVALID_PHONE"
}
```

### 2. Customer Status Update: `POST /api/notify-customer`

**Request Body**:
```json
{
  "phone": "+201234567890",
  "orderId": 123,
  "status": "preparing",
  "chefName": "Umm Fatima",
  "estimatedTime": "30-45 minutes"
}
```

**Valid Status Values**:
- `preparing` - Order is being prepared
- `out_for_delivery` - Order is out with driver
- `delivered` - Order delivered

**Success Response** (200):
```json
{
  "success": true,
  "message": "Customer notification sent for order #123",
  "data": {
    "phone": "+201234****90",
    "messageLength": 156,
    "timestamp": "2025-12-12T10:35:00.000Z"
  }
}
```

### 3. Test WhatsApp: `GET/POST /api/test-whatsapp`

**GET Request** - Check configuration:
```bash
curl https://ghadwa.vercel.app/api/test-whatsapp
```

**Response**:
```json
{
  "success": true,
  "message": "WhatsApp service is configured",
  "config": {
    "phone": "+201109****81",
    "apiKey": "abc****xyz",
    "baseUrl": "https://api.callmebot.com/whatsapp.php",
    "ready": true
  },
  "status": "connected"
}
```

**POST Request** - Send test message:
```bash
curl -X POST https://ghadwa.vercel.app/api/test-whatsapp \
  -H "Content-Type: application/json" \
  -d '{"message": "Test message"}'
```

## Integration Points

### 1. In CheckoutPage (After Order Creation)

```typescript
// pages/CheckoutPage.tsx

const handleCheckout = async () => {
  try {
    // Create order
    const order = await api.createOrder(cartData)

    // Notify admin (non-blocking)
    fetch('/api/notify-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order.id,
        customerName: formData.name,
        customerPhone: formData.phone,
        total: order.total,
        chefName: order.chefName,
        deliveryAddress: formData.address,
        items: order.items,
        notes: formData.notes
      })
    }).catch(err => {
      logger.warn('Failed to notify admin', err)
      // Don't fail checkout if notification fails
    })

    // Show success modal
    setOrderSuccess({ isOpen: true, orderId: order.id })
  } catch (error) {
    setError(error.message)
  }
}
```

### 2. In Admin Order Management (Status Updates)

```typescript
// components/admin/AdminOrders.tsx

const updateOrderStatus = async (orderId: number, newStatus: string) => {
  try {
    // Update order
    await api.updateOrderStatus(orderId, newStatus)

    // Notify customer if they provided phone
    if (order.customerPhone) {
      fetch('/api/notify-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: order.customerPhone,
          orderId,
          status: newStatus,
          chefName: order.chefName,
          estimatedTime: '30-45 minutes'
        })
      }).catch(err => {
        logger.warn('Failed to notify customer', err)
      })
    }

    // Reload orders
    await loadOrders()
  } catch (error) {
    setError(error.message)
  }
}
```

### 3. Using Serverless Functions (Webhook/Backend)

```typescript
// Node.js serverless function
import { sendWhatsAppMessage, formatOrderCreatedMessage } from '@/api/lib/whatsapp'

export default async function handler(req, res) {
  const order = req.body

  try {
    const message = formatOrderCreatedMessage(order)
    const result = await sendWhatsAppMessage({
      phone: '+201109318581',
      message
    })

    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

### 4. In React Components (Direct Usage)

```typescript
// Can be imported directly for use in components
import { sendWhatsAppMessage } from '@/api/lib/whatsapp'

const NotificationTest = () => {
  const [loading, setLoading] = useState(false)

  const sendTest = async () => {
    setLoading(true)
    try {
      const result = await sendWhatsAppMessage({
        phone: '+201234567890',
        message: '👋 Hello from Ghadwa!'
      })
      alert(`Message sent! (${result.messageLength} chars)`)
    } catch (error) {
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return <button onClick={sendTest} disabled={loading}>Send Test Message</button>
}
```

## Error Handling

**Error Codes**:

```typescript
'INVALID_PHONE'        // Phone number format invalid
'INVALID_API_KEY'      // API key missing or too short
'EMPTY_MESSAGE'        // Message is empty
'MESSAGE_TOO_LONG'     // Message exceeds 4096 chars
'REQUEST_TIMEOUT'      // API call took >30 seconds
'NETWORK_ERROR'        // Connection error (no internet)
'API_ERROR'            // CallMeBot API returned error
```

**Handling in Code**:

```typescript
try {
  const result = await sendWhatsAppMessage(options)
} catch (error) {
  if (error.code === 'INVALID_PHONE') {
    // Ask user for valid phone
  } else if (error.code === 'API_ERROR') {
    // WhatsApp service down, retry later
  } else if (error.code === 'REQUEST_TIMEOUT') {
    // Network slow, implement longer timeout
  } else {
    // Generic error handling
    console.error(error.message)
  }
}
```

## Configuration

### Environment Variables

**Production (.env.production)**:
```
CALLMEBOT_PHONE=+201109318581
CALLMEBOT_API_KEY=your_real_api_key_here
CALLMEBOT_BASE_URL=https://api.callmebot.com/whatsapp.php
DEBUG_WHATSAPP=false
```

**Development (.env.development)**:
```
CALLMEBOT_PHONE=+201109318581
CALLMEBOT_API_KEY=test_api_key_here
CALLMEBOT_BASE_URL=https://api.callmebot.com/whatsapp.php
DEBUG_WHATSAPP=true
```

### Get CallMeBot API Key

1. Visit: https://www.callmebot.com/blog/free-api-whatsapp-messages/
2. Send message to bot: `I want to use CallMeBot`
3. Receive API key
4. Add to `.env`: `CALLMEBOT_API_KEY=your_key_here`

## Testing

### Test Using cURL

**Check Configuration**:
```bash
curl https://localhost:3001/api/test-whatsapp
```

**Send Test Message**:
```bash
curl -X POST https://localhost:3001/api/test-whatsapp \
  -H "Content-Type: application/json" \
  -d '{"message": "Test from terminal"}'
```

**Send Admin Notification**:
```bash
curl -X POST https://localhost:3001/api/notify-admin \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": 1,
    "customerName": "Test User",
    "total": 100,
    "chefName": "Test Chef",
    "items": [{"name": "Item", "quantity": 1, "price": 100}]
  }'
```

### Test in Browser DevTools

```javascript
// Copy and paste in console
fetch('/api/test-whatsapp')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)

// Send test message
fetch('/api/test-whatsapp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Browser test message' })
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

## Security Considerations

### 1. Sensitive Data Masking

- Phone numbers masked in logs: `+201109****81`
- API keys masked in logs: `abc****xyz`
- Full credentials never logged or exposed

### 2. Environment Variables

- All sensitive data in `.env` (never commit)
- Vercel automatically loads from project settings
- Local `.env` for development

### 3. Rate Limiting

- Implement rate limits on `/api/notify-*` endpoints:
  ```typescript
  // Use rate limiting middleware
  const rateLimit = require('express-rate-limit')
  
  const limiter = rateLimit({
    windowMs: 60 * 1000,      // 1 minute
    max: 10                    // 10 requests per minute
  })
  
  app.post('/api/notify-admin', limiter, handler)
  ```

### 4. Input Validation

- All endpoints validate required fields
- Phone number format validated
- Message length validated
- Error messages don't leak sensitive info

## Performance Optimization

### 1. Non-Blocking Notifications

```typescript
// Good: Don't block order creation
await api.createOrder(data)

// Send notification async (don't await)
fetch('/api/notify-admin', { method: 'POST', body: ... })
  .catch(err => logger.warn('Notification failed', err))
```

### 2. Retry Strategy

- Automatic retry with exponential backoff
- 3 total attempts (1s, 2s, 4s delays)
- Network errors trigger retry
- API errors with specific codes don't retry

### 3. Message Caching

```typescript
// Cache formatted messages
const messageCache = new Map()

function getCachedMessage(orderId: number) {
  if (!messageCache.has(orderId)) {
    messageCache.set(orderId, formatOrderCreatedMessage(order))
  }
  return messageCache.get(orderId)
}
```

## Logging

**Debug Mode** (set `DEBUG_WHATSAPP=true`):

```
[WhatsApp] Sending to +201109****81...
[WhatsApp] API Key: abc****xyz
[WhatsApp] Message length: 284
[WhatsApp] Message sent to +201109****81 (284 chars)
```

**Without Debug**:
- Only errors logged
- Production: Silent unless error

## Monitoring & Analytics

### Track Metrics

```typescript
// In notify-admin and notify-customer endpoints
const metrics = {
  totalSent: 0,
  totalFailed: 0,
  averageMessageLength: 0,
  lastSentTimestamp: null,
  errorsByCode: {}
}
```

### Dashboard Queries

```sql
-- Count notifications sent by status
SELECT 
  status, 
  COUNT(*) as count 
FROM notifications 
WHERE created_at > NOW() - INTERVAL 24 HOUR
GROUP BY status

-- Average message length
SELECT AVG(message_length) as avg_length 
FROM notifications 
WHERE sent_successfully = true
```

## Troubleshooting

### Issue: "Invalid API Key"

**Solution**:
1. Get new key from CallMeBot website
2. Update `.env` file
3. Restart dev server

### Issue: "Invalid Phone"

**Solution**:
1. Phone must start with `+`
2. Include country code: `+20` (Egypt), `+1` (USA), etc.
3. Valid example: `+201109318581`

### Issue: "Message Too Long"

**Solution**:
- Messages max 4096 characters
- Check message formatting not adding extra content
- Use `createSafeMessage()` to truncate

### Issue: "Request Timeout"

**Solution**:
- Check internet connection
- CallMeBot API might be slow (>30s)
- Retry automatically (3 attempts)
- Increase timeout if needed: `API_TIMEOUT_MS`

### Issue: "Network Error"

**Solution**:
- Check internet connectivity
- Verify VPN isn't blocking WhatsApp API
- Try from different network
- Check CallMeBot API status

## Roadmap

### Phase 2: Advanced Features
- [ ] Scheduled notifications (send at specific time)
- [ ] Bulk notifications (send to multiple numbers)
- [ ] Notification templates (save formatted messages)
- [ ] Delivery confirmation tracking
- [ ] Customer WhatsApp contact collection

### Phase 3: Analytics & Dashboard
- [ ] Admin dashboard for notification metrics
- [ ] Charts: success rate, delivery time, user engagement
- [ ] Export notification logs
- [ ] Retry history

### Phase 4: Webhook Integration
- [ ] Webhook for order status changes
- [ ] Automatic customer notifications on status update
- [ ] Email fallback if WhatsApp fails
- [ ] SMS option

### Phase 5: AI Integration
- [ ] AI-generated personalized messages
- [ ] Smart retry timing based on success rates
- [ ] Predictive delivery time estimation
- [ ] Sentiment analysis of customer replies

## FAQ

**Q: Can I send messages in Arabic?**  
A: Yes! WhatsApp supports full Arabic text. Format normally: `message: 'مرحبا بك في غذوة'`

**Q: Is there a cost?**  
A: CallMeBot is free for personal use (up to your usage tier). No authentication required.

**Q: Can I send to multiple numbers?**  
A: Currently one at a time. For bulk, call function in loop.

**Q: How long do messages take to deliver?**  
A: Usually instantly (< 1 second). Max 30 second timeout configured.

**Q: What if customer doesn't have WhatsApp?**  
A: Message won't deliver. Implement fallback (SMS, email, in-app notification).

**Q: Can I use with business WhatsApp?**  
A: This implementation uses personal WhatsApp. For Business WhatsApp, use official WhatsApp Business API.

**Q: How do I debug issues?**  
A: Set `DEBUG_WHATSAPP=true` in `.env`, check browser console logs and Vercel function logs.

**Q: Can I customize message formatting?**  
A: Yes! All formatters are in `formatter.ts`. Edit functions to change message style.

---

**Created**: December 12, 2025  
**Version**: 1.0 Complete  
**Status**: ✅ Ready for Production
