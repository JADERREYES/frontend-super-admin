import api from './api';

export const usersService = {
  getAll: async () => {
    const response = await api.get('/users');
    return (Array.isArray(response.data) ? response.data : []).map((user: any) => ({
      ...user,
      id: user._id || user.id,
      name: user.name || user.email?.split('@')[0] || 'Sin nombre',
    }));
  },
  
  updateStatus: async (userId: string, isActive: boolean) => {
    const response = await api.patch(`/users/${userId}/status`, { isActive });
    return response.data;
  },
  
  updateRole: async (userId: string, role: string) => {
    const response = await api.patch(`/users/${userId}/role`, { role });
    return response.data;
  },
};
