import api from './api';
import { apiConfig, clearAuthSession, getAuthToken } from '../config/api';
import type { AuthProfile, LoginResponse } from '../types/admin';

export const authService = {
  login: async (
    email: string,
    password: string,
    twoFactorCode?: string,
  ): Promise<LoginResponse> => {
    const response = await api.post(apiConfig.endpoints.auth.login, {
      email,
      password,
      adminOnly: true,
      twoFactorCode,
    });

    if (response.data.token) {
      localStorage.setItem(apiConfig.storage.tokenKey, response.data.token);
      localStorage.setItem(
        apiConfig.storage.profileKey,
        JSON.stringify(response.data.user),
      );
    }

    return response.data;
  },

  logout: () => {
    clearAuthSession();
  },

  getProfile: async (): Promise<AuthProfile> => {
    const response = await api.get(apiConfig.endpoints.auth.profile);
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.post(apiConfig.endpoints.auth.changePassword, data);
    return response.data;
  },

  requestEmailChange: async (data: {
    currentPassword: string;
    newEmail: string;
  }) => {
    const response = await api.post(
      apiConfig.endpoints.auth.requestEmailChange,
      data,
    );
    return response.data;
  },

  confirmEmailChange: async (code: string) => {
    const response = await api.post(apiConfig.endpoints.auth.confirmEmailChange, {
      code,
    });
    if (response.data.user) {
      localStorage.setItem(
        apiConfig.storage.profileKey,
        JSON.stringify(response.data.user),
      );
    }
    return response.data;
  },

  requestTwoFactor: async (data: {
    currentPassword: string;
    method: 'email' | 'sms';
  }) => {
    const response = await api.post(apiConfig.endpoints.auth.requestTwoFactor, data);
    return response.data;
  },

  confirmTwoFactor: async (code: string) => {
    const response = await api.post(apiConfig.endpoints.auth.confirmTwoFactor, {
      code,
    });
    if (response.data.user) {
      localStorage.setItem(
        apiConfig.storage.profileKey,
        JSON.stringify(response.data.user),
      );
    }
    return response.data;
  },

  disableTwoFactor: async (currentPassword: string) => {
    const response = await api.post(apiConfig.endpoints.auth.disableTwoFactor, {
      currentPassword,
    });
    if (response.data.user) {
      localStorage.setItem(
        apiConfig.storage.profileKey,
        JSON.stringify(response.data.user),
      );
    }
    return response.data;
  },

  isAuthenticated: () => !!getAuthToken(),
};
