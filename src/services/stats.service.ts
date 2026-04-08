import api from './api';

export const statsService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
  
  getActivity: async () => {
    const response = await api.get('/admin/activity');
    const data = response.data || {};
    const recentUsers = Array.isArray(data.recentUsers) ? data.recentUsers : [];
    const recentChats = Array.isArray(data.recentChats) ? data.recentChats : [];

    return [
      ...recentUsers.map((user: any) => ({
        id: `user-${user._id || user.id}`,
        timestamp: user.createdAt,
        action: 'USER_REGISTER',
        actor: user.email || 'Usuario',
        actorType: 'user',
        resource: user._id || user.id,
        details: 'Nuevo usuario registrado',
      })),
      ...recentChats.map((chat: any) => ({
        id: `chat-${chat._id || chat.id}`,
        timestamp: chat.createdAt,
        action: 'CHAT_CREATED',
        actor: chat.userId?.email || 'Usuario',
        actorType: 'user',
        resource: chat.title || chat._id || chat.id,
        details: 'Nueva conversación creada',
      })),
    ].sort((a, b) => {
      const left = new Date(a.timestamp || 0).getTime();
      const right = new Date(b.timestamp || 0).getTime();
      return right - left;
    });
  },
};
