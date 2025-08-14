import axios from 'axios';

// Khi sử dụng proxy trong package.json, chỉ cần path tương đối
const API_URL = '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Add response interceptor để log chi tiết lỗi
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.log('Full response error:', {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data,
        config: {
          url: error.config.url,
          method: error.config.method,
          headers: error.config.headers,
          data: error.config.data
        }
      });
    }
    return Promise.reject(error);
  }
);

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;