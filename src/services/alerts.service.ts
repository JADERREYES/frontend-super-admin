import api from './api';
import { apiConfig } from '../config/api';

export const alertsService = {
  getAll: async () => {
    const response = await api.get(apiConfig.endpoints.alerts.list);
    return (Array.isArray(response.data) ? response.data : []).map((alert: any) => ({
      ...alert,
      id: alert._id || alert.id,
    }));
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(apiConfig.endpoints.alerts.updateStatus(id), {
      status,
    });
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.patch(apiConfig.endpoints.alerts.update(id), data);
    return response.data;
  },

  sendCrisisSupport: async (id: string, message?: string) => {
    const response = await api.post(apiConfig.endpoints.alerts.sendCrisisSupport(id), {
      message,
    });
    return response.data;
  },
};
