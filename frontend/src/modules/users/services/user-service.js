import api from "@/lib/api";

export const userService = {
  async getUsers(params) {
    const response = await api.get("/users", { params });
    return response.data;
  },

  async getUserById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async createUser(data) {
    const response = await api.post("/users", data);
    return response.data;
  },

  async updateUser(id, data) {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  async updatePermissions(userId, permissions) {
    const response = await api.put(`/users/${userId}/permissions`, {
      permissions,
    });
    return response.data;
  },
};
