import api from "@/lib/api";

export const patientService = {
  async getPatients(params) {
    const response = await api.get("/patients", { params });
    return response.data;
  },

  async getPatientById(id) {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  async createPatient(data) {
    const response = await api.post("/patients", data);
    return response.data;
  },

  async updatePatient(id, data) {
    const response = await api.put(`/patients/${id}`, data);
    return response.data;
  },

  async deletePatient(id) {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },

  async getPatientMedicalHistory(patientId) {
    const response = await api.get(`/patients/${patientId}/medical-history`);
    return response.data;
  },

  async uploadDocument(patientId, file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      `/patients/${patientId}/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
