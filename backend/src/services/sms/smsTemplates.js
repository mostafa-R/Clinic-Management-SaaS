export const smsTemplates = {
  appointmentReminder: (data) => {
    const { patientName, doctorName, date, time, clinicName } = data;
    return `مرحباً ${patientName},\n\nتذكير بموعدك الطبي:\n📅 ${date} في ${time}\n👨‍⚕️ د. ${doctorName}\n🏥 ${clinicName}\n\nيرجى الحضور قبل 10 دقائق.`;
  },

  appointmentConfirmed: (data) => {
    const { patientName, appointmentNumber, date, time } = data;
    return `عزيزي ${patientName},\n\nتم تأكيد حجزك\nرقم: ${appointmentNumber}\n📅 ${date} - ${time}`;
  },

  appointmentCancelled: (data) => {
    const { patientName, date, time, reason } = data;
    return `عزيزي ${patientName},\n\nتم إلغاء موعدك في ${date} الساعة ${time}\nالسبب: ${reason}`;
  },

  appointmentRescheduled: (data) => {
    const { patientName, oldDate, newDate, newTime } = data;
    return `عزيزي ${patientName},\n\nتم تغيير موعدك من ${oldDate} إلى ${newDate} الساعة ${newTime}`;
  },

  paymentReceived: (data) => {
    const { patientName, amount, invoiceNumber, currency } = data;
    return `عزيزي ${patientName},\n\nتم استلام دفعتك\nالمبلغ: ${amount} ${currency}\nفاتورة: ${invoiceNumber}`;
  },

  invoiceOverdue: (data) => {
    const { patientName, invoiceNumber, amount, dueDate } = data;
    return `عزيزي ${patientName},\n\nتذكير: فاتورة ${invoiceNumber} بمبلغ ${amount} متأخرة\nتاريخ الاستحقاق: ${dueDate}`;
  },

  otp: (otp) => {
    return `رمز التحقق: ${otp}\n\nصالح لمدة 10 دقائق\nلا تشاركه مع أحد.`;
  },

  welcomeMessage: (name, clinicName) => {
    return `أهلاً ${name}!\n\nمرحباً بك في ${clinicName}\nنتطلع لخدمتك.`;
  },

  prescriptionReady: (data) => {
    const { patientName, clinicName } = data;
    return `عزيزي ${patientName},\n\nروشتتك جاهزة للاستلام من ${clinicName}`;
  },

  labResultReady: (data) => {
    const { patientName, testName } = data;
    return `عزيزي ${patientName},\n\nنتائج تحليل ${testName} جاهزة\nيمكنك الاطلاع عليها من حسابك`;
  },
};

export const getSMSTemplate = (type, data) => {
  const template = smsTemplates[type];
  if (!template) {
    throw new Error(`SMS template '${type}' not found`);
  }
  return template(data);
};
