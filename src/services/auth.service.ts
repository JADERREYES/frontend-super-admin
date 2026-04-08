import api from './api';
import { apiConfig } from '../config/api';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post(apiConfig.endpoints.auth.login, {
      email,
      password,
      adminOnly: true,
    });

    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
      localStorage.setItem('admin_user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },

  getProfile: async () => {
    const response = await api.get(apiConfig.endpoints.auth.profile);
    return response.data;
  },

  isAuthenticated: () => !!localStorage.getItem('admin_token'),
};
