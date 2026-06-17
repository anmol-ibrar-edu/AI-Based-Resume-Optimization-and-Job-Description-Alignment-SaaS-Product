/*
 * File: services/api.jsx
 * Purpose: Centralized Axios configuration and API service methods for communicating with the backend FastAPI server.
 * Missing Impact: The frontend would be unable to communicate with the backend, leading to no data being loaded or saved.
 */
import axios from 'axios';

const API_BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 120 seconds — OCR and AI analysis can take 30-60s
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on an auth-related page
      const authPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email'];
      if (!authPaths.some(p => window.location.pathname.includes(p))) {
        window.location.href = '/login';
      }
    }
    // Ensure error message is properly formatted
    if (error.response?.data?.detail) {
      error.message = error.response.data.detail;
    } else if (error.response?.data?.message) {
      error.message = error.response.data.message;
    } else if (!error.message) {
      error.message = 'An error occurred. Please try again.';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login/json', data),
  verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, new_password) => api.post('/auth/reset-password', { token, new_password }),
};

// User APIs
export const userAPI = {
  getMe: () => api.get('/users/me'),
  getStats: () => api.get('/users/me/stats'),
  update: (data) => api.put('/users/me', data),
};

// Resume APIs
export const resumeAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAll: () => api.get('/resume/'),
  getOne: (id) => api.get(`/resume/${id}`),
  delete: (id) => api.delete(`/resume/${id}`),
};

// Job APIs
export const jobAPI = {
  create: (data) => api.post('/job/', data),
  getAll: () => api.get('/job/'),
  getOne: (id) => api.get(`/job/${id}`),
  delete: (id) => api.delete(`/job/${id}`),
};

// Analysis APIs
export const analysisAPI = {
  analyze: (resumeId, jobId) => api.post('/analysis/analyze', { resume_id: resumeId, job_id: jobId }),
  getHistory: (limit = 10) => api.get(`/analysis/?limit=${limit}`),
  getOne: (id) => api.get(`/analysis/${id}`),
  delete: (id) => api.delete(`/analysis/${id}`),
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

// Review APIs
export const reviewAPI = {
  create: (data) => api.post('/reviews/', data),
  getPublic: (skip = 0, limit = 10) => api.get(`/reviews/public?skip=${skip}&limit=${limit}`),
};

// Admin APIs
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (sort = 'desc', search = '') => api.get(`/admin/users?sort=${sort}&search=${search}&limit=200`),
  toggleUserActive: (id) => api.patch(`/admin/users/${id}/toggle-active`),
  changeUserRole: (id, role) => api.patch(`/admin/users/${id}/role?role=${role}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getResumes: (sort = 'desc') => api.get(`/admin/resumes?sort=${sort}&limit=200`),
  deleteResume: (id) => api.delete(`/admin/resumes/${id}`),
  getReviews: (skip = 0, limit = 100) => api.get(`/admin/reviews?skip=${skip}&limit=${limit}`),
  updateReview: (id, data) => api.patch(`/admin/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),
};

export default api;