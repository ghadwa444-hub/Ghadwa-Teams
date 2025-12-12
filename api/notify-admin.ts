/**
 * Vercel API Endpoint: Send WhatsApp notification to admin for new orders
 * POST /api/notify-admin
 *
 * Body:
 * {
 *   orderId: number,
 *   customerName: string,
 *   customerPhone?: string,
 *   total: number,
 *   chefName: string,
 *   deliveryAddress?: string,
 *   items: Array<{ name, quantity, price }>,
 *   notes?: string
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
import { sendWhatsAppMessage, formatOrderCreatedMessage } from '../lib/whatsapp'
import { OrderNotification, WhatsAppError } from '../lib/whatsapp/types'

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
    const body = request.body as OrderNotification

    if (!body.orderId || !body.customerName || !body.total || !body.chefName) {
      return response.status(400).json({
        success: false,
        error: 'Missing required fields: orderId, customerName, total, chefName, items'
      })
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return response.status(400).json({
        success: false,
        error: 'Order must have at least one item'
      })
    }

    // Format message
    const message = formatOrderCreatedMessage(body)

    // Send WhatsApp message
    const result = await sendWhatsAppMessage({
      phone: process.env.CALLMEBOT_PHONE || '+201109318581',
      message
    })

    // Return success
    return response.status(200).json({
      success: true,
      message: `Admin notification sent for order #${body.orderId}`,
      data: {
        phone: result.phone,
        messageLength: result.messageLength,
        timestamp: result.timestamp
      }
    })
  } catch (error: any) {
    // Handle WhatsApp specific errors
    if (error instanceof WhatsAppError) {
      console.error('[notify-admin] WhatsApp error:', {
        code: error.code,
        message: error.message,
        details: error.details
      })

      // Return appropriate error
      if (error.code === 'INVALID_PHONE') {
        return response.status(400).json({
          success: false,
          error: 'Invalid phone number configured'
        })
      }

      if (error.code === 'API_ERROR') {
        return response.status(502).json({
          success: false,
          error: 'WhatsApp service unavailable',
          details: error.details
        })
      }

      return response.status(500).json({
        success: false,
        error: error.message,
        code: error.code
      })
    }

    // Handle generic errors
    console.error('[notify-admin] Unexpected error:', error)

    return response.status(500).json({
      success: false,
      error: 'Failed to send notification',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
