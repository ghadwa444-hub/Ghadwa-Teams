import { env } from '../../config/env';
import type { Order } from '../../types';
import { logger } from '../logger';

export interface FormspreeNotificationResponse {
  success: boolean;
  error?: string;
}

export class FormspreeNotificationService {
  private readonly webhookUrl: string;

  constructor() {
    this.webhookUrl = env.emailWebhookUrl || '';
  }

  async sendOrderNotification(order: Order): Promise<FormspreeNotificationResponse> {
    if (!this.webhookUrl || !this.webhookUrl.includes('formspree.io')) {
      return {
        success: false,
        error: 'Formspree webhook URL not configured'
      };
    }

    const payload = this.createFormspreePayload(order);
    
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        logger.info('NOTIFICATIONS', '✅ Formspree email sent');
        return { success: true };
      } else {
        return {
          success: false,
          error: `HTTP ${response.status}: ${await response.text()}`
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private createFormspreePayload(order: Order): any {
    const subject = `🍽️ طلب جديد - New Order #${order.id}`;
    
    const message = `
🍽️ طلب جديد - New Order

معلومات العميل - Customer Information:
👤 الاسم - Name: ${order.customer}
📱 الهاتف - Phone: ${order.phone}
📍 العنوان - Address: ${order.address}

تفاصيل الطلب - Order Details:
🍲 الطلب - Items: ${order.items}
💰 الإجمالي - Total: ${order.total} EGP

معلومات إضافية - Additional Information:
🕐 تاريخ الطلب - Order Date: ${order.date}
🆔 رقم الطلب - Order ID: ${order.id}
📊 الحالة - Status: ${order.status}

---
تم إرسال هذا الإشعار تلقائياً من منصة غدوة
This notification was sent automatically from Ghadwa Platform
    `;

    return {
      subject: subject,
      message: message,
      email: env.notificationEmail,
      customer_name: order.customer,
      phone: order.phone,
      address: order.address,
      items: order.items,
      price: order.total,
      order_id: order.id.toString(),
      timestamp: order.date
    };
  }
}

export const formspreeNotificationService = new FormspreeNotificationService();
