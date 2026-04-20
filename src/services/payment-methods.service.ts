import api from './api';
import { apiConfig } from '../config/api';

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

type RawPaymentMethodItem = AdminPaymentMethodItem & {
  _id?: string;
  id?: string;
};

export const paymentMethodsService = {
  getAll: async (): Promise<AdminPaymentMethodItem[]> => {
    const response = await api.get(apiConfig.endpoints.admin.paymentMethods);
    return ((Array.isArray(response.data) ? response.data : []) as RawPaymentMethodItem[]).map((item) => ({
      ...item,
      id: item._id || item.id || '',
    }));
  },

  create: async (payload: Omit<AdminPaymentMethodItem, 'id' | '_id'>) => {
    const response = await api.post(apiConfig.endpoints.admin.paymentMethods, payload);
    return response.data;
  },

  update: async (
    id: string,
    payload: Partial<Omit<AdminPaymentMethodItem, 'id' | '_id'>>,
  ) => {
    const response = await api.put(
      apiConfig.endpoints.admin.paymentMethod(id),
      payload,
    );
    return response.data;
  },

  updateStatus: async (id: string, isActive: boolean) => {
    const response = await api.patch(apiConfig.endpoints.admin.paymentMethodStatus(id), {
      isActive,
    });
    return response.data;
  },

  remove: async (id: string) => {
    const response = await api.delete(apiConfig.endpoints.admin.paymentMethod(id));
    return response.data;
  },
};
