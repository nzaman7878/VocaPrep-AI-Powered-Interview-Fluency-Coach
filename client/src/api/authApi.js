import axiosClient from './axiosClient';

/**
 * Authenticate with Google
 * @param {string} credential - Google ID token
 */
export const googleAuth = async (credential) => {
  const response = await axiosClient.post('/auth/google', { credential });
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
