import api from './api';

export const settingsService = {
  get: async () => {
    const response = await api.get('/settings');
    return response.data;
  },
  
  update: async (data: any) => {
    const response = await api.put('/settings', data);
    return response.data;
  },
};