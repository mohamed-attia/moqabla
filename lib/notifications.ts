
/**
 * Notification Service
 * Handles sending emails to the admin via EmailJS API when a new request is created.
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
  /**
   * EmailJS Configuration
   * ملاحظة: إذا استمر ظهور خطأ "Service ID not found"، يرجى التأكد من المعرف الصحيح
   * في لوحة تحكم EmailJS تحت قسم 'Email Services'.
   */
  const SERVICE_ID = "service_w3s333b"; // تم التغيير من service_moqabala إلى المعرف الافتراضي الشائع service_gmail
  const TEMPLATE_ID = "template_ugepp1a";
  const PUBLIC_KEY = "ZjvVZ6fPn30HS4LdG";

  try {
    console.log("محاولة إرسال تنبيه للمسؤول عن طلب جديد من:", data.from_name);
    
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
          admin_email: "dev.mohattia@gmail.com",
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
      console.error("EmailJS API Error Response:", errorData);
      throw new Error(`EmailJS Error: ${errorData}`);
    }

    console.log("تم إرسال التنبيه للمسؤول بنجاح ✅");
    return { success: true };
  } catch (error) {
    console.error("فشل إرسال التنبيه للمسؤول ❌:", error);
    return { success: false, error };
  }
};
