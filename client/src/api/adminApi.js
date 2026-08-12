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

  getTransactions: async () => {
    const response = await api.get('/admin/transactions');
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },
};
