/**
 * Vercel API Endpoint: Test WhatsApp connectivity
 * POST /api/test-whatsapp
 *
 * Optional Body:
 * {
 *   phone?: string (override admin phone),
 *   message?: string (custom test message)
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   message: string,
 *   config?: { phone, apiKey, ready },
 *   data?: { timestamp }
 * }
 */

import { VercelRequest, VercelResponse } from '@vercel/node'
import {
  getWhatsAppService,
  sendWhatsAppMessage
} from '../lib/whatsapp'
import { WhatsAppError } from '../lib/whatsapp/types'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    // Initialize service
    const whatsapp = getWhatsAppService()
    const config = whatsapp.getConfig()

    // Check if service is configured
    if (!config.ready) {
      return response.status(400).json({
        success: false,
        error: 'WhatsApp service not properly configured',
        config,
        message: 'Please set CALLMEBOT_PHONE and CALLMEBOT_API_KEY in environment variables'
      })
    }

    // Handle GET request - just return config and status
    if (request.method === 'GET') {
      const status = await whatsapp.getStatus()

      return response.status(200).json({
        success: true,
        message: 'WhatsApp service is configured',
        config,
        status: status ? 'connected' : 'disconnected'
      })
    }

    // Handle POST request - send test message
    if (request.method !== 'POST') {
      return response.status(405).json({
        success: false,
        error: 'Method Not Allowed. Use GET to check status or POST to send test message.'
      })
    }

    // Get options from body
    const phone = request.body?.phone || process.env.CALLMEBOT_PHONE
    const customMessage = request.body?.message

    if (!phone) {
      return response.status(400).json({
        success: false,
        error: 'No phone number provided and CALLMEBOT_PHONE not set'
      })
    }

    // Create test message
    const message =
      customMessage ||
      `🧪 *WhatsApp Integration Test*

Timestamp: ${new Date().toLocaleString()}
Configuration: ✅ Valid

This message confirms your WhatsApp integration is working correctly!`

    // Send message
    const result = await sendWhatsAppMessage({
      phone,
      message
    })

    // Return success
    return response.status(200).json({
      success: true,
      message: 'Test message sent successfully',
      data: {
        phone: result.phone,
        messageLength: result.messageLength,
        timestamp: result.timestamp
      }
    })
  } catch (error: any) {
    // Handle WhatsApp specific errors
    if (error instanceof WhatsAppError) {
      console.error('[test-whatsapp] WhatsApp error:', {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode
      })

      let statusCode = 500

      if (error.code === 'INVALID_PHONE') {
        statusCode = 400
      } else if (error.code === 'REQUEST_TIMEOUT') {
        statusCode = 504
      } else if (error.code === 'NETWORK_ERROR') {
        statusCode = 503
      } else if (error.code === 'API_ERROR') {
        statusCode = 502
      }

      return response.status(statusCode).json({
        success: false,
        error: error.message,
        code: error.code,
        hint:
          error.code === 'INVALID_API_KEY'
            ? 'Please get your API key from https://www.callmebot.com/blog/free-api-whatsapp-messages/'
            : undefined
      })
    }

    // Handle generic errors
    console.error('[test-whatsapp] Unexpected error:', error)

    return response.status(500).json({
      success: false,
      error: 'Failed to test WhatsApp integration',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
