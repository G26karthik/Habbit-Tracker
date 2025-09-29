import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Habit API endpoints
export const habitAPI = {
  // Get all habits
  getAll: async () => {
    const response = await api.get('/habits');
    return response.data;
  },

  // Create new habit
  create: async (habitData) => {
    const response = await api.post('/habits', habitData);
    return response.data;
  },

  // Delete habit
  delete: async (habitId) => {
    const response = await api.delete(`/habits/${habitId}`);
    return response.data;
  },

  // Get specific habit
  get: async (habitId) => {
    const response = await api.get(`/habits/${habitId}`);
    return response.data;
  },

  // Get check-ins for a habit
  getCheckins: async (habitId, startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await api.get(`/checkins/${habitId}`, { params });
    return response.data;
  },

  // Create or update check-in
  updateCheckin: async (habitId, date, status) => {
    const response = await api.post(`/checkins/${habitId}`, { date, status });
    return response.data;
  },

  // Delete check-in
  deleteCheckin: async (habitId, date) => {
    const response = await api.delete(`/checkins/${habitId}/${date}`);
    return response.data;
  },

  // Get summary stats
  getSummary: async () => {
    const response = await api.get('/summary');
    return response.data;
  },

  // Get habit-specific stats
  getHabitSummary: async (habitId) => {
    const response = await api.get(`/summary/habit/${habitId}`);
    return response.data;
  }
};

export default api;