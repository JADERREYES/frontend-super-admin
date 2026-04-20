import api from './api';
import { apiConfig } from '../config/api';
import type { ActivityItem, DashboardResponse } from '../types/admin';

export const statsService = {
  getDashboard: async (): Promise<DashboardResponse> => {
    const response = await api.get(apiConfig.endpoints.admin.dashboard);
    return response.data;
  },

  getActivity: async (): Promise<ActivityItem[]> => {
    const response = await api.get(apiConfig.endpoints.admin.activity);
    const data = response.data || {};
    const recentUsers = Array.isArray(data.recentUsers) ? data.recentUsers : [];
    const recentChats = Array.isArray(data.recentChats) ? data.recentChats : [];

    return [
      ...recentUsers.map(
        (user: { _id?: string; id?: string; createdAt?: string; email?: string }) => ({
          id: `user-${String(user._id || user.id || '')}`,
          timestamp: user.createdAt,
          action: 'USER_REGISTER',
          actor: user.email || 'Usuario',
          actorType: 'user',
          resource: user._id || user.id,
          details: 'Nuevo usuario registrado',
        }),
      ),
      ...recentChats.map(
        (chat: {
          _id?: string;
          id?: string;
          createdAt?: string;
          userId?: { email?: string };
        }) => ({
          id: `chat-${String(chat._id || chat.id || '')}`,
          timestamp: chat.createdAt,
          action: 'CHAT_CREATED',
          actor: chat.userId?.email || 'Usuario',
          actorType: 'user',
          resource: `chat-${String(chat._id || chat.id || '').slice(-6)}`,
          details: 'Nueva conversacion creada sin exponer contenido del usuario',
        }),
      ),
    ].sort((a, b) => {
      const left = new Date(a.timestamp || 0).getTime();
      const right = new Date(b.timestamp || 0).getTime();
      return right - left;
    });
  },
};
