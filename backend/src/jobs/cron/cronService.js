import cron from "node-cron";
import { sendAppointmentReminders } from "./tasks/appointmentReminders.js";
import { cleanupExpiredNotifications } from "./tasks/cleanupNotifications.js";
import { sendOverduePaymentReminders } from "./tasks/overduePayments.js";

class CronService {
  constructor() {
    this.jobs = [];
  }

  startAll() {
    console.log(" Starting cron jobs...");

    this.jobs.push(
      cron.schedule("0 * * * *", async () => {
        console.log("⏰ Running appointment reminders...");
        await sendAppointmentReminders();
      })
    );

    this.jobs.push(
      cron.schedule("0 9 * * *", async () => {
        console.log("💰 Running overdue payment reminders...");
        await sendOverduePaymentReminders();
      })
    );

    this.jobs.push(
      cron.schedule("0 2 * * *", async () => {
        console.log("🧹 Cleaning up expired notifications...");
        await cleanupExpiredNotifications();
      })
    );

    console.log(`✅ ${this.jobs.length} cron jobs started`);
  }

  stopAll() {
    console.log("⏸️  Stopping all cron jobs...");
    this.jobs.forEach((job) => job.stop());
    this.jobs = [];
  }
}

export default new CronService();
