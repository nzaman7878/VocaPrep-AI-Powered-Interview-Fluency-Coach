import axiosClient from './axiosClient';

/**
 * Register a new user
 * @param {Object} userData - { name, email, password, targetRole }
 */
export const registerUser = async (userData) => {
  const response = await axiosClient.post('/auth/register', userData);
  return response.data;
};

/**
 * Login a user
 * @param {Object} credentials - { email, password }
 */
export const loginUser = async (credentials) => {
  const response = await axiosClient.post('/auth/login', credentials);
  return response.data;
};

/**
 * Get current user profile
 */
export const getUserProfile = async () => {
  const response = await axiosClient.get('/users/me');
  return response.data;
};

/**
 * Update current user profile
 * @param {Object} updateData - { name, targetRole, weakAreas, password }
 */
export const updateUserProfile = async (updateData) => {
  const response = await axiosClient.put('/users/me', updateData);
  return response.data;
};
