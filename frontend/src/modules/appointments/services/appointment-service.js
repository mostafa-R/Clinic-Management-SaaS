import api from "@/lib/api";

export const appointmentService = {
  async getAppointments(params) {
    const response = await api.get("/appointments", { params });
    return response.data;
  },

  async getAppointmentById(id) {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  async createAppointment(data) {
    const response = await api.post("/appointments", data);
    return response.data;
  },

  async updateAppointment(id, data) {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },

  async cancelAppointment(id, reason) {
    const response = await api.patch(`/appointments/${id}/cancel`, { reason });
    return response.data;
  },

  async rescheduleAppointment(id, newDate, newTime) {
    const response = await api.patch(`/appointments/${id}/reschedule`, {
      date: newDate,
      time: newTime,
    });
    return response.data;
  },

  async getAvailableSlots(params) {
    const response = await api.get("/appointments/available-slots", { params });
    return response.data;
  },
};
