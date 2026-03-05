import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const baseURL = API_URL.replace(/\/$/, '');

console.log('🔧 API Base URL:', baseURL);

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
});

// Track if we're already refreshing to avoid multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401/403 or request already retried, reject
    if (!error.response || 
        (error.response.status !== 401 && error.response.status !== 403) || 
        originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't try to refresh on login page
    if (originalRequest.url.includes('/auth/login')) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // If already refreshing, queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      console.log('🔄 Attempting to refresh token...');
      const response = await axios.post(`${baseURL}/auth/refresh-token`, {
        refreshToken,
      });

      const { accessToken } = response.data;
      console.log('✅ Token refreshed successfully');

      localStorage.setItem('accessToken', accessToken);
      
      // Update authorization header
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      
      // Process queued requests
      processQueue(null, accessToken);
      
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      console.error('❌ Token refresh failed:', refreshError);
      
      // Clear storage and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      processQueue(refreshError, null);
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      }
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;