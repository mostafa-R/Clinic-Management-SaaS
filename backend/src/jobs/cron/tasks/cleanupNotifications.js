import Notification from "../../../models/Notification.js";

export const cleanupExpiredNotifications = async () => {
  try {
    const now = new Date();

    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const result = await Notification.deleteMany({
      $or: [
        { expiresAt: { $lt: now } },
        { createdAt: { $lt: thirtyDaysAgo }, isRead: true },
      ],
    });

    console.log(`✅ Cleaned up ${result.deletedCount} expired notifications`);
  } catch (error) {
    console.error("❌ Error in cleanup notifications job:", error);
  }
};
