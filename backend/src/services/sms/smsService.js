import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

/**
 * Send SMS
 * @param {String} to - Phone number with country code (e.g., +201234567890)
 * @param {String} message - SMS message
 */
export const sendSMS = async (to, message) => {
  try {
    if (!accountSid || !authToken || !twilioPhone) {
      console.log("⚠️  Twilio not configured. SMS would be sent to:", to);
      console.log("Message:", message);
      return { success: true, messageId: "test-mode", test: true };
    }

    const result = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: to,
    });

    console.log("✅ SMS sent:", result.sid);
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error("❌ SMS error:", error);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};

export const sendAppointmentReminderSMS = async (phone, data) => {
  const { patientName, doctorName, date, time, clinicName } = data;

  const message = `مرحباً ${patientName},\n\nتذكير بموعدك الطبي:\n📅 التاريخ: ${date}\n🕐 الوقت: ${time}\n👨‍⚕️ الطبيب: ${doctorName}\n🏥 العيادة: ${clinicName}\n\nيرجى الحضور قبل 10 دقائق.`;

  return await sendSMS(phone, message);
};

export const sendAppointmentConfirmationSMS = async (phone, data) => {
  const { patientName, appointmentNumber, date, time } = data;

  const message = `عزيزي ${patientName},\n\nتم تأكيد حجز موعدك\nرقم الموعد: ${appointmentNumber}\nالتاريخ: ${date}\nالوقت: ${time}`;

  return await sendSMS(phone, message);
};

export const sendPaymentConfirmationSMS = async (phone, data) => {
  const { patientName, amount, invoiceNumber } = data;

  const message = `عزيزي ${patientName},\n\nتم استلام دفعتك بنجاح\nالمبلغ: ${amount} جنيه\nرقم الفاتورة: ${invoiceNumber}\n\nشكراً لك!`;

  return await sendSMS(phone, message);
};

export const sendOTP = async (phone, otp) => {
  const message = `رمز التحقق الخاص بك هو: ${otp}\n\nهذا الرمز صالح لمدة 10 دقائق.\nلا تشارك هذا الرمز مع أي شخص.`;

  return await sendSMS(phone, message);
};
