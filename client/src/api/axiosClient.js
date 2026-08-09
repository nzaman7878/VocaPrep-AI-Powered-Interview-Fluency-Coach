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
    // Basic error handling - clear token and reload/redirect if 401 Unauthorized
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // Dispatching a Redux action from outside components can be tricky without the store instance.
      // Easiest reliable fallback is a hard redirect which will re-initialize the app state cleanly.
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
