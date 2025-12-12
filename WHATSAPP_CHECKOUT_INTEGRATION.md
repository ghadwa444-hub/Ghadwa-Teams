# CheckoutPage Integration - WhatsApp Notification Example

**File**: `pages/CheckoutPage.tsx`  
**Integration Type**: Add WhatsApp notification after successful order creation  
**Impact Level**: Non-blocking (won't fail checkout if notification fails)

## Implementation Template

Add this code snippet to your `CheckoutPage.tsx` in the order creation handler:

```typescript
// After successful order creation
const handleCheckout = async () => {
  try {
    // ... existing validation code ...

    // Create order
    const newOrder = {
      id: Math.max(...orders.map(o => o.id)) + 1,
      items: cart,
      total: cartTotal,
      status: 'pending',
      date: new Date().toISOString(),
      chefName: currentChef?.name,
      customerName: formData.name,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      deliveryAddress: formData.address,
      deliveryNotes: formData.notes,
      // ... other fields ...
    }

    // Save order to database
    const savedOrder = await api.createOrder(newOrder)

    // ✅ NEW: Send WhatsApp notification to admin
    // This is non-blocking - doesn't prevent checkout
    if (process.env.VITE_ENV === 'production' || process.env.DEBUG_WHATSAPP === 'true') {
      notifyAdminOfNewOrder(savedOrder, formData)
    }

    // Clear cart
    setCart([])

    // Show success modal
    setOrderSuccess({ isOpen: true, orderId: savedOrder.id })

  } catch (error) {
    setCheckoutError(error.message)
  }
}

/**
 * Send WhatsApp notification to admin about new order
 * Non-blocking function - catches errors silently
 */
function notifyAdminOfNewOrder(order: Order, formData: CheckoutFormData) {
  // Prepare notification data
  const notificationData = {
    orderId: order.id,
    customerName: formData.name,
    customerPhone: formData.phone,
    total: order.total,
    chefName: order.chefName,
    deliveryAddress: formData.address,
    items: order.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price
    })),
    notes: formData.notes
  }

  // Send async (non-blocking)
  fetch('/api/notify-admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notificationData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      return response.json()
    })
    .then(data => {
      // Log success but don't interrupt user experience
      console.log('✅ Admin notification sent:', data.message)
      // Optional: Log to your analytics
      // analytics.track('admin_notification_sent', { orderId: order.id })
    })
    .catch(error => {
      // Log failure but don't disrupt checkout
      console.warn(
        '⚠️ Failed to send admin notification:',
        error.message
      )
      // Optional: Log error but continue
      // errorLogger.warn('Admin notification failed', {
      //   orderId: order.id,
      //   error: error.message
      // })
    })
}
```

## Full Integration (Copy-Paste Ready)

```typescript
// pages/CheckoutPage.tsx

import { useState, useEffect } from 'react'
import { api } from '../services/api'

// ... other imports ...

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  })
  const [checkoutError, setCheckoutError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    setIsProcessing(true)
    setCheckoutError('')

    try {
      // Validation
      if (!formData.name || !formData.phone || !formData.address) {
        throw new Error('Please fill in all required fields')
      }

      if (cart.length === 0) {
        throw new Error('Your cart is empty')
      }

      // Calculate total
      const cartTotal = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity
      }, 0)

      // Create order
      const newOrder = {
        id: Math.max(...orders.map(o => o.id), 0) + 1,
        items: cart,
        total: cartTotal,
        status: 'pending',
        date: new Date().toISOString(),
        chefName: currentChef?.name || 'Unknown Chef',
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        deliveryAddress: formData.address,
        deliveryNotes: formData.notes
      }

      // Save to database/localStorage
      const savedOrder = await api.createOrder(newOrder)

      // ✅ Send WhatsApp notification to admin (non-blocking)
      sendAdminNotification(savedOrder, formData).catch(err => {
        console.warn('Notification failed, but order was created:', err)
      })

      // Clear cart
      setCart([])

      // Show success
      setOrderSuccess({ isOpen: true, orderId: savedOrder.id })

    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : 'Checkout failed'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="checkout-page">
      {/* Form UI */}
      <form onSubmit={e => {
        e.preventDefault()
        handleCheckout()
      }}>
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Phone (+2010xxxxxxxxx)"
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
        />
        <textarea
          placeholder="Delivery Address"
          value={formData.address}
          onChange={e => setFormData({ ...formData, address: e.target.value })}
          required
        />
        <textarea
          placeholder="Special Instructions (optional)"
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
        />

        {checkoutError && (
          <div className="error-message">{checkoutError}</div>
        )}

        <button type="submit" disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Complete Order'}
        </button>
      </form>
    </div>
  )
}

/**
 * Send WhatsApp notification to admin
 * Returns a promise that resolves when notification is sent or fails gracefully
 */
async function sendAdminNotification(order: Order, formData: any) {
  const notificationData = {
    orderId: order.id,
    customerName: formData.name,
    customerPhone: formData.phone,
    total: order.total,
    chefName: order.chefName,
    deliveryAddress: formData.address,
    items: order.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price
    })),
    notes: formData.notes
  }

  const response = await fetch('/api/notify-admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notificationData)
  })

  if (!response.ok) {
    throw new Error(`Notification failed: ${response.status}`)
  }

  const data = await response.json()
  console.log('✅ Admin notified:', data.message)
  return data
}
```

## AdminOrders Integration Example

Add customer notifications when order status changes:

```typescript
// components/admin/AdminOrders.tsx

const updateOrderStatus = async (orderId: number, newStatus: string) => {
  try {
    const order = orders.find(o => o.id === orderId)
    if (!order) throw new Error('Order not found')

    // Update status in database
    const updated = await api.updateOrderStatus(orderId, newStatus)

    // ✅ Send customer notification if phone is available
    if (order.customerPhone) {
      notifyCustomerOfStatusChange(
        order.customerPhone,
        orderId,
        newStatus,
        order.chefName
      ).catch(err => {
        console.warn('Could not notify customer:', err)
        // Still show success to admin
      })
    }

    // Reload orders
    await loadOrders()
    setSuccess('Order status updated')

  } catch (error) {
    setError(error.message)
  }
}

async function notifyCustomerOfStatusChange(
  phone: string,
  orderId: number,
  status: string,
  chefName: string
) {
  const statusMessages: Record<string, string> = {
    'preparing': 'being prepared',
    'on-the-way': 'out for delivery',
    'delivered': 'delivered'
  }

  const response = await fetch('/api/notify-customer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone,
      orderId,
      status,
      chefName,
      estimatedTime: status === 'preparing' ? '30-45 minutes' : undefined
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to send notification`)
  }

  console.log(`✅ Customer notified: Order ${orderId} is ${statusMessages[status]}`)
}
```

## React Hook Version (Reusable)

Create a custom hook for easier integration:

```typescript
// hooks/useWhatsAppNotification.ts

import { useCallback } from 'react'

export function useWhatsAppNotification() {
  const notifyAdmin = useCallback(async (orderData: any) => {
    try {
      const response = await fetch('/api/notify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) throw new Error('Failed to notify admin')

      const data = await response.json()
      console.log('✅ Admin notified')
      return data
    } catch (error) {
      console.warn('⚠️ Admin notification failed:', error)
      // Fail silently - don't interrupt user experience
      return null
    }
  }, [])

  const notifyCustomer = useCallback(async (customerData: any) => {
    try {
      const response = await fetch('/api/notify-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      })

      if (!response.ok) throw new Error('Failed to notify customer')

      const data = await response.json()
      console.log('✅ Customer notified')
      return data
    } catch (error) {
      console.warn('⚠️ Customer notification failed:', error)
      return null
    }
  }, [])

  return { notifyAdmin, notifyCustomer }
}

// Usage in component:
// const { notifyAdmin, notifyCustomer } = useWhatsAppNotification()
// await notifyAdmin({ orderId, ... })
```

## Type Definitions

```typescript
// types/whatsapp.ts

export interface OrderNotificationData {
  orderId: number
  customerName: string
  customerPhone?: string
  total: number
  chefName: string
  deliveryAddress?: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  notes?: string
}

export interface CustomerStatusUpdateData {
  phone: string
  orderId: number
  status: 'preparing' | 'out_for_delivery' | 'delivered'
  chefName: string
  estimatedTime?: string
  driverName?: string
  driverPhone?: string
}

export interface NotificationResponse {
  success: boolean
  message: string
  data?: {
    phone: string
    messageLength: number
    timestamp: string
  }
}
```

## Error Handling Patterns

```typescript
// Graceful degradation - order succeeds even if notification fails
async function checkoutWithGracefulErrorHandling(orderData: any) {
  try {
    const order = await createOrder(orderData)

    // Notify but don't block
    notifyAdmin(order)
      .catch(err => {
        logger.warn('Admin notification failed', err)
        // Track this metric
        analytics.track('admin_notification_failed', { orderId: order.id })
      })

    return order
  } catch (error) {
    throw error // Fail checkout
  }
}

// With retry logic
async function notifyWithRetry(
  data: any,
  maxAttempts = 3,
  delayMs = 1000
) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await notifyAdmin(data)
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error // Give up after final attempt
      }
      await sleep(delayMs * attempt) // Exponential backoff
    }
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

## Testing Integration

```typescript
// Test in browser console
const testNotification = {
  orderId: Math.random(),
  customerName: 'Test User',
  total: 100,
  chefName: 'Test Chef',
  deliveryAddress: 'Test Address',
  items: [{ name: 'Test Item', quantity: 1, price: 100 }]
}

fetch('/api/notify-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testNotification)
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

---

## Checklist

- [ ] Copy integration code into CheckoutPage.tsx
- [ ] Update .env with CALLMEBOT_API_KEY
- [ ] Test with `npm run dev`
- [ ] Send test order and verify WhatsApp message arrives
- [ ] Add customer phone field to checkout form
- [ ] Integrate status update notifications in AdminOrders
- [ ] Test in production on Vercel

## Support

See `WHATSAPP_QUICK_START.md` for troubleshooting and `WHATSAPP_IMPLEMENTATION_GUIDE.md` for complete documentation.
