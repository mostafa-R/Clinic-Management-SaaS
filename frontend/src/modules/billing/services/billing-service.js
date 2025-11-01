import api from "@/lib/api";

export const billingService = {
  async getInvoices(params) {
    const response = await api.get("/invoices", { params });
    return response.data;
  },

  async getInvoiceById(id) {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  async createInvoice(data) {
    const response = await api.post("/invoices", data);
    return response.data;
  },

  async updateInvoice(id, data) {
    const response = await api.put(`/invoices/${id}`, data);
    return response.data;
  },

  async deleteInvoice(id) {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
  },

  async processPayment(invoiceId, paymentData) {
    const response = await api.post(
      `/invoices/${invoiceId}/payment`,
      paymentData
    );
    return response.data;
  },
};
