import api from './api';
import { apiConfig } from '../config/api';
import type { AdminSettings } from '../types/admin';

export const settingsService = {
  get: async (): Promise<AdminSettings> => {
    const response = await api.get(apiConfig.endpoints.settings.root);
    return response.data;
  },

  update: async (data: AdminSettings) => {
    const response = await api.put(apiConfig.endpoints.settings.root, data);
    return response.data;
  },
};
