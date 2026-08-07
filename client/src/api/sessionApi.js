import axiosClient from './axiosClient';

export const sessionApi = {
  createSession: async (role, totalQuestions = 5) => {
    const response = await axiosClient.post('/sessions', { role, totalQuestions });
    return response.data;
  },

  getSession: async (sessionId) => {
    const response = await axiosClient.get(`/sessions/${sessionId}`);
    return response.data;
  },
};
