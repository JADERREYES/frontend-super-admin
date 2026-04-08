import api from './api';

export const subscriptionsService = {
  getAll: async () => {
    const response = await api.get('/admin/user-subscriptions');
    return (Array.isArray(response.data) ? response.data : []).map((item: any) => ({
      ...item,
      id: item._id || item.id,
      userName: item.userName || item.userId,
    }));
  },

  getByUserId: async (userId: string) => {
    const response = await api.get(`/admin/user-subscriptions/${userId}`);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    const response = await api.patch(`/admin/user-subscriptions/${id}`, data);
    return response.data;
  },

  activateFromRequest: async (requestId: string) => {
    const response = await api.post(
      `/admin/user-subscriptions/activate-from-request/${requestId}`,
    );
    return response.data;
  },
};
