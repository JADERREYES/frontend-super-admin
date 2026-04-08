import api from './api';

export const alertsService = {
  getAll: async () => {
    const response = await api.get('/alerts');
    return (Array.isArray(response.data) ? response.data : []).map((alert: any) => ({
      ...alert,
      id: alert._id || alert.id,
    }));
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/alerts/${id}/status`, { status });
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.patch(`/alerts/${id}`, data);
    return response.data;
  },
};
