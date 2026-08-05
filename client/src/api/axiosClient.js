import axios from 'axios';

// Get API URL from env variables or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to add Auth Token
axiosClient.interceptors.request.use(
  (config) => {
    // Assuming token is stored in localStorage
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for Error Handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Basic error handling - could trigger a logout event here if 401
    // e.g., if (error.response && error.response.status === 401) { logout() }
    return Promise.reject(error);
  }
);

export default axiosClient;
