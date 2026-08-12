import api from './axiosConfig';

export const adminApi = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await api.put(`/admin/users/${id}`, { role });
    return response.data;
  },

  getSubscriptions: async () => {
    const response = await api.get('/admin/subscriptions');
    return response.data;
  },
};
