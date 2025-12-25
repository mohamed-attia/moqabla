
/**
 * Notification Service
 * Handles sending emails via EmailJS API when events occur.
 */
import { STATUS_LABELS } from '../types';

interface NotificationPayload {
  to_email: string;
  from_name: string;
  user_email: string;
  user_phone: string;
  field: string;
  level: string;
  tech_stack: string;
  expectations: string;
}

interface StatusUpdatePayload {
  to_email: string;
  user_name: string;
  request_number: string;
  new_status: string;
}

const SERVICE_ID = "service_w3s333b"; 
const PUBLIC_KEY = "ZjvVZ6fPn30HS4LdG";

// إيميل للأدمن عند وجود طلب جديد
export const sendAdminNotification = async (data: NotificationPayload) => {
  const TEMPLATE_ID = "template_ugepp1a";

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id: PUBLIC_KEY,
        template_params: {
          recipient_email: data.to_email, // تم التأكد من استخدام recipient_email ليتوافق مع إعدادات القالب
          user_name: data.from_name,
          user_email: data.user_email,
          user_phone: data.user_phone,
          field: data.field,
          level: data.level,
          tech_stack: data.tech_stack,
          expectations: data.expectations
        }
      })
    });

    return { success: response.ok };
  } catch (error) {
    console.error("Admin Notification Failed:", error);
    return { success: false, error };
  }
};

// إيميل للمستخدم عند تغيير حالة الطلب
export const sendUserStatusUpdateNotification = async (data: StatusUpdatePayload) => {
  const TEMPLATE_ID = "template_ugepp1a"; 

  const label = STATUS_LABELS[data.new_status] || data.new_status;

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id: PUBLIC_KEY,
        template_params: {
          recipient_email: data.to_email, // يرسل لإيميل صاحب الطلب
          user_name: data.user_name,
          request_number: data.request_number,
          status_label: label,
          message: `عزيزي ${data.user_name}، نود إعلامك بأن حالة طلب المقابلة الخاص بك رقم (${data.request_number}) قد تغيرت إلى: ${label}`
        }
      })
    });

    return { success: response.ok };
  } catch (error) {
    console.error("User Notification Failed:", error);
    return { success: false, error };
  }
};
