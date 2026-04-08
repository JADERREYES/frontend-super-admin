import api from './api';

export type AdminPaymentMethodItem = {
  _id: string;
  id: string;
  name: string;
  code: string;
  provider?: string;
  type?: string;
  accountLabel?: string;
  accountValue?: string;
  accountNumber?: string;
  holderName?: string;
  accountHolder?: string;
  instructions?: string;
  qrImageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  displayOrder?: number;
};

export const paymentMethodsService = {
  getAll: async (): Promise<AdminPaymentMethodItem[]> => {
    const response = await api.get('/admin/payment-methods');
    return (Array.isArray(response.data) ? response.data : []).map((item: any) => ({
      ...item,
      id: item._id || item.id,
    }));
  },

  create: async (payload: Omit<AdminPaymentMethodItem, 'id' | '_id'>) => {
    const response = await api.post('/admin/payment-methods', payload);
    return response.data;
  },

  update: async (
    id: string,
    payload: Partial<Omit<AdminPaymentMethodItem, 'id' | '_id'>>,
  ) => {
    const response = await api.put(`/admin/payment-methods/${id}`, payload);
    return response.data;
  },

  updateStatus: async (id: string, isActive: boolean) => {
    const response = await api.patch(`/admin/payment-methods/${id}/status`, {
      isActive,
    });
    return response.data;
  },

  remove: async (id: string) => {
    const response = await api.delete(`/admin/payment-methods/${id}`);
    return response.data;
  },
};
