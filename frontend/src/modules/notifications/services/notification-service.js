import api from "@/lib/api";

export const notificationService = {
  async getNotifications(params) {
    const response = await api.get("/notifications", { params });
    return response.data;
  },

  async markAsRead(id) {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.patch("/notifications/read-all");
    return response.data;
  },

  async deleteNotification(id) {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};
