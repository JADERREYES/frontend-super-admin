import api from './api';

export type AdminPlanItem = {
  _id: string;
  id: string;
  name: string;
  code: string;
  description?: string;
  category:
    | 'free'
    | 'premium'
    | 'extra_tokens'
    | 'custom'
    | 'subscription'
    | 'tokens';
  price: number;
  currency: string;
  durationDays: number;
  tokenLimit?: number;
  dailyMessageLimit?: number;
  monthlyMessageLimit?: number;
  features?: string[];
  limits: {
    maxChatsPerMonth: number;
    maxMessagesPerMonth: number;
    maxDocumentsMB: number;
    monthlyTokens: number;
    extraTokens: number;
  };
  isActive: boolean;
  isDefault: boolean;
  isCustomizable: boolean;
  sortOrder: number;
  displayOrder?: number;
};

export const plansService = {
  getAll: async (): Promise<AdminPlanItem[]> => {
    const response = await api.get('/admin/plans');
    return (Array.isArray(response.data) ? response.data : []).map((item: any) => ({
      ...item,
      id: item._id || item.id,
    }));
  },

  create: async (payload: Omit<AdminPlanItem, 'id' | '_id'>) => {
    const response = await api.post('/admin/plans', payload);
    return response.data;
  },

  update: async (
    id: string,
    payload: Partial<Omit<AdminPlanItem, 'id' | '_id'>>,
  ) => {
    const response = await api.put(`/admin/plans/${id}`, payload);
    return response.data;
  },

  updateStatus: async (id: string, isActive: boolean) => {
    const response = await api.patch(`/admin/plans/${id}/status`, { isActive });
    return response.data;
  },

  remove: async (id: string) => {
    const response = await api.delete(`/admin/plans/${id}`);
    return response.data;
  },
};
