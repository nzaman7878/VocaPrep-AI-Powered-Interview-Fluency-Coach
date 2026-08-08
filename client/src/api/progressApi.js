import axiosClient from './axiosClient';

export const progressApi = {
  /**
   * Fetches the overall progress summary for the authenticated user
   * (e.g., total sessions, average scores, total practice time)
   * @returns {Promise<Object>} API response data
   */
  getProgressSummary: async () => {
    const response = await axiosClient.get('/progress/summary');
    return response.data;
  },

  /**
   * Fetches the historical progress snapshots (chart data)
   * @param {Object} params - Query parameters (e.g., ?limit=10)
   * @returns {Promise<Object>} API response data
   */
  getProgressSnapshots: async (params = {}) => {
    const response = await axiosClient.get('/progress', { params });
    return response.data;
  },
};
