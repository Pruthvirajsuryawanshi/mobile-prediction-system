import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

export const mobileService = {
  getAll: (params) => api.get('/mobiles', { params }),
  getTrending: () => api.get('/mobiles/trending'),
  getById: (id) => api.get(`/mobiles/${id}`),
};

export const chatService = {
  sendMessage: (data) => api.post('/chat', data),
  getHistory: (sessionId) => api.get(`/chat/history/${sessionId}`),
  getConversations: () => api.get('/chat/conversations'),
};

export default api;
