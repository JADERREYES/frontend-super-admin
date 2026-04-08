// Configuración de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiConfig = {
  baseURL: API_URL,
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      profile: '/auth/profile',
    },
    users: {
      list: '/users',
      get: (id: string) => `/users/${id}`,
      update: (id: string) => `/users/${id}`,
      delete: (id: string) => `/users/${id}`,
    },
    subscriptions: {
      list: '/subscriptions',
      get: '/subscriptions/me',
      update: '/subscriptions/me',
    },
    alerts: {
      list: '/alerts',
      update: (id: string) => `/alerts/${id}`,
    },
    documents: {
      list: '/documents',
      create: '/documents',
    },
    ai: {
      chat: '/ai/chat',
      usage: '/ai/usage',
    },
    admin: {
      dashboard: '/admin/dashboard',
      users: '/admin/users',
      activity: '/admin/activity',
      premiumRequests: '/admin/premium-requests',
    },
  },
};
