import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Assuming the API is relative to where the web app lives
// In production, you would use React Native Config for this
const BASE_URL = 'https://panel.plusavto-uz.uz/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout on token expiration
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
