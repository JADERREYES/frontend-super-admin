import api from './api';
import { apiConfig } from '../config/api';
import type { AdminUser, ListParams, PaginatedResponse } from '../types/admin';

const normalizeUser = (user: any): AdminUser => ({
  ...user,
  id: user._id || user.id,
  name: user.name || user.email?.split('@')[0] || 'Sin nombre',
});

export const usersService = {
  getAll: async (params: ListParams = {}): Promise<PaginatedResponse<AdminUser>> => {
    const response = await api.get(apiConfig.endpoints.users.list, { params });
    if (Array.isArray(response.data)) {
      const data = response.data.map(normalizeUser);
      return {
        data,
        meta: {
          page: 1,
          limit: data.length,
          total: data.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }
    return {
      ...response.data,
      data: (response.data?.data || []).map(normalizeUser),
    };
  },
  
  updateStatus: async (userId: string, isActive: boolean) => {
    const response = await api.patch(apiConfig.endpoints.users.updateStatus(userId), {
      isActive,
    });
    return response.data;
  },
  
  updateRole: async (userId: string, role: string) => {
    const response = await api.patch(apiConfig.endpoints.users.updateRole(userId), {
      role,
    });
    return response.data;
  },
};
