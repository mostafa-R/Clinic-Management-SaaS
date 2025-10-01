import Appointment from "../../../models/Appointment.js";
import { sendAppointmentReminderSMS } from "../../../services/sms/smsService.js";
import { sendAppointmentReminder } from "../../../utils/emailService.js";

export const sendAppointmentReminders = async () => {
  try {
    const now = new Date();

    const reminderWindows = [
      { hours: 24, label: "24h" },
      { hours: 1, label: "1h" },
    ];

    for (const window of reminderWindows) {
      const startTime = new Date(now.getTime() + window.hours * 60 * 60 * 1000);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      const appointments = await Appointment.find({
        scheduledDate: {
          $gte: startTime,
          $lt: endTime,
        },
        status: { $in: ["scheduled", "confirmed"] },

        "reminders.type": { $ne: `${window.hours}h` },
      })
        .populate({
          path: "patient",
          populate: { path: "user", select: "firstName lastName email phone" },
        })
        .populate("doctor", "firstName lastName")
        .populate("clinic", "name settings");

      console.log(
        `Found ${appointments.length} appointments needing ${window.label} reminder`
      );

      for (const appointment of appointments) {
        try {
          if (!appointment.clinic.settings.sendReminders) {
            continue;
          }

          const patientUser = appointment.patient.user;
          const appointmentDate = new Date(
            appointment.scheduledDate
          ).toLocaleDateString("ar-EG");
          const appointmentTime = appointment.scheduledTime.start;

          const reminderData = {
            patientName: patientUser.firstName,
            doctorName: `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
            date: appointmentDate,
            time: appointmentTime,
            clinicName: appointment.clinic.name,
          };

          if (patientUser.email) {
            try {
              await sendAppointmentReminder(patientUser.email, reminderData);
            } catch (error) {
              console.error("Failed to send email reminder:", error);
            }
          }

          if (patientUser.phone) {
            try {
              await sendAppointmentReminderSMS(patientUser.phone, reminderData);
            } catch (error) {
              console.error("Failed to send SMS reminder:", error);
            }
          }

          await Appointment.updateOne(
            { _id: appointment._id },
            {
              $push: {
                reminders: {
                  type: window.hours === 24 ? "email" : "sms",
                  sentAt: new Date(),
                  status: "sent",
                },
              },
            }
          );

          console.log(
            `✅ Sent ${window.label} reminder for appointment ${appointment._id}`
          );
        } catch (error) {
          console.error(
            `❌ Failed to send reminder for appointment ${appointment._id}:`,
            error
          );
        }
      }
    }
  } catch (error) {
    console.error("❌ Error in appointment reminders job:", error);
  }
};
