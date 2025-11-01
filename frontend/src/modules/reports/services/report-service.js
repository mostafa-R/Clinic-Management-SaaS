import api from "@/lib/api";

export const reportService = {
  async getFinancialReport(params) {
    const response = await api.get("/reports/financial", { params });
    return response.data;
  },

  async getPatientStatistics(clinicId) {
    const response = await api.get(`/reports/patients/${clinicId}`);
    return response.data;
  },

  async getAppointmentStatistics(params) {
    const response = await api.get("/reports/appointments", { params });
    return response.data;
  },

  async exportReport(type, params) {
    const response = await api.get(`/reports/export/${type}`, {
      params,
      responseType: "blob",
    });
    return response.data;
  },
};
