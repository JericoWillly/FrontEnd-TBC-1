// File: src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://image-hosting.kuncipintu.my.id',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Photo service functions
export const photoService = {
  getUserPhotos: async (userId) => {
    return await api.get(`/photos/user/${userId}`);
  },
  getMyPhotos: async () => {
    return await api.get('/photos/me');
  },
  uploadPhoto: async (formData) => {
    return await api.post('/photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deletePhoto: async (photoId) => {
    return await api.delete(`/photos/${photoId}`);
  }
};

// User service functions
export const userService = {
    etProfile: async () => {
        return await api.get('/users/me/profile');
      },
      
      updateProfile: async (profileData) => {
        return await api.put('/users/me/profile', profileData);
      },
      
      updateProfilePicture: async (formData) => {
        return await api.put('/users/me/profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      },
  getProfile: async () => {
    return await api.get('/users/me/profile');
  },
  updateProfile: async (profileData) => {
    return await api.put('/users/me/profile', profileData);
  },
  getAllUsers: async () => {
    return await api.get('/users');
  },
  getUserById: async (userId) => {
    return await api.get(`/users/${userId}`);
  },
  createUser: async (userData) => {
    return await api.post('/users', userData);
  },
  updateUser: async (userId, userData) => {
    return await api.put(`/users/${userId}`, userData);
  },
  deleteUser: async (userId) => {
    return await api.delete(`/users/${userId}`);
  }
};