/**
 * Vercel API Endpoint: Send WhatsApp notification to customer about order status
 * POST /api/notify-customer
 *
 * Body:
 * {
 *   phone: string (customer's WhatsApp number with country code),
 *   orderId: number,
 *   status: 'preparing' | 'out_for_delivery' | 'delivered',
 *   chefName: string,
 *   estimatedTime?: string,
 *   driverName?: string,
 *   driverPhone?: string
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   message: string,
 *   data?: { phone, messageLength, timestamp }
 * }
 */

import { VercelRequest, VercelResponse } from '@vercel/node'
import {
  sendWhatsAppMessage,
  formatPreparingMessage,
  formatOutForDeliveryMessage,
  formatDeliveredMessage
} from '../lib/whatsapp'
import { CustomerUpdateNotification, WhatsAppError } from '../lib/whatsapp/types'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Only allow POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    // Validate request body
    const body = request.body as CustomerUpdateNotification & { phone: string }

    if (!body.phone || !body.orderId || !body.status || !body.chefName) {
      return response.status(400).json({
        success: false,
        error: 'Missing required fields: phone, orderId, status, chefName'
      })
    }

    // Validate status
    const validStatuses = ['preparing', 'out_for_delivery', 'delivered']
    if (!validStatuses.includes(body.status)) {
      return response.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      })
    }

    // Select formatter based on status
    let formatter: (notification: CustomerUpdateNotification) => string

    switch (body.status) {
      case 'preparing':
        formatter = formatPreparingMessage
        break
      case 'out_for_delivery':
        formatter = formatOutForDeliveryMessage
        break
      case 'delivered':
        formatter = formatDeliveredMessage
        break
      default:
        return response.status(400).json({
          success: false,
          error: 'Unknown status'
        })
    }

    // Format message
    const notification: CustomerUpdateNotification = {
      orderId: body.orderId,
      status: body.status as any,
      chefName: body.chefName,
      estimatedTime: body.estimatedTime,
      driverName: body.driverName,
      driverPhone: body.driverPhone
    }

    const message = formatter(notification)

    // Send WhatsApp message
    const result = await sendWhatsAppMessage({
      phone: body.phone,
      message
    })

    // Return success
    return response.status(200).json({
      success: true,
      message: `Customer notification sent for order #${body.orderId}`,
      data: {
        phone: result.phone,
        messageLength: result.messageLength,
        timestamp: result.timestamp
      }
    })
  } catch (error: any) {
    // Handle WhatsApp specific errors
    if (error instanceof WhatsAppError) {
      console.error('[notify-customer] WhatsApp error:', {
        code: error.code,
        message: error.message,
        details: error.details
      })

      // Return appropriate error
      if (error.code === 'INVALID_PHONE') {
        return response.status(400).json({
          success: false,
          error: 'Invalid customer phone number'
        })
      }

      if (error.code === 'API_ERROR') {
        return response.status(502).json({
          success: false,
          error: 'WhatsApp service unavailable'
        })
      }

      return response.status(500).json({
        success: false,
        error: error.message,
        code: error.code
      })
    }

    // Handle generic errors
    console.error('[notify-customer] Unexpected error:', error)

    return response.status(500).json({
      success: false,
      error: 'Failed to send notification',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
