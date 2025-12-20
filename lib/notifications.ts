
/**
 * Notification Service
 * Handles sending emails via EmailJS API when events occur.
 */

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

export const sendAdminNotification = async (data: NotificationPayload) => {
  const SERVICE_ID = "service_w3s333b"; 
  const TEMPLATE_ID = "template_ugepp1a";
  const PUBLIC_KEY = "ZjvVZ6fPn30HS4LdG";

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
          admin_email: data.to_email,
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

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`EmailJS Error: ${errorData}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Admin Notification Failed:", error);
    return { success: false, error };
  }
};
