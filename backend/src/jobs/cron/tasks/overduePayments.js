import Invoice from "../../../models/Invoice.js";
import { sendSMS } from "../../../services/sms/smsService.js";

export const sendOverduePaymentReminders = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueInvoices = await Invoice.find({
      status: { $in: ["pending", "partially-paid"] },
      dueDate: { $lt: today },

      $or: [
        { lastReminderSent: { $exists: false } },
        {
          lastReminderSent: {
            $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      ],
    })
      .populate({
        path: "patient",
        populate: { path: "user", select: "firstName lastName email phone" },
      })
      .populate("clinic", "name");

    console.log(`Found ${overdueInvoices.length} overdue invoices`);

    for (const invoice of overdueInvoices) {
      try {
        const patientUser = invoice.patient.user;
        const daysOverdue = Math.floor(
          (today - new Date(invoice.dueDate)) / (1000 * 60 * 60 * 24)
        );

        const message = `عزيزي ${patientUser.firstName}، لديك فاتورة متأخرة رقم ${invoice.invoiceNumber} بمبلغ ${invoice.balanceDue} جنيه. تأخرت ${daysOverdue} يوم. يرجى السداد في أقرب وقت.`;

        if (patientUser.phone) {
          await sendSMS(patientUser.phone, message);
        }

        await Invoice.updateOne(
          { _id: invoice._id },
          { $set: { lastReminderSent: new Date() } }
        );

        console.log(
          `✅ Sent overdue payment reminder for invoice ${invoice.invoiceNumber}`
        );
      } catch (error) {
        console.error(
          `❌ Failed to send reminder for invoice ${invoice._id}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("❌ Error in overdue payment reminders job:", error);
  }
};
