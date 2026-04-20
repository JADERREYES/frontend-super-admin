import api from './api';
import { apiConfig } from '../config/api';
import type { AdminSubscription, ListParams, PaginatedResponse } from '../types/admin';

type RawSubscription = Partial<AdminSubscription> & {
  _id?: string;
  id?: string;
  userId?: string;
};

export type AdminSubscriptionUpdatePayload = Partial<
  Pick<
    AdminSubscription,
    | 'planId'
    | 'planName'
    | 'planCode'
    | 'planCategory'
    | 'status'
    | 'amount'
    | 'currency'
    | 'autoRenew'
    | 'limits'
    | 'startDate'
    | 'endDate'
  >
>;

const normalizeSubscription = (item: RawSubscription): AdminSubscription => ({
  ...item,
  id: item._id || item.id || '',
  userId: item.userId || '',
  userName: item.userName || item.userId || '',
  planName: item.planName || '',
  planCode: item.planCode || '',
  status: item.status || 'active',
  amount: Number(item.amount || 0),
});

export const subscriptionsService = {
  getAll: async (
    params: ListParams = {},
  ): Promise<PaginatedResponse<AdminSubscription>> => {
    const response = await api.get(apiConfig.endpoints.subscriptions.list, {
      params,
    });
    if (Array.isArray(response.data)) {
      const data = (response.data as RawSubscription[]).map(normalizeSubscription);
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
      data: ((response.data?.data || []) as RawSubscription[]).map(normalizeSubscription),
    };
  },

  getByUserId: async (userId: string): Promise<AdminSubscription> => {
    const response = await api.get(
      apiConfig.endpoints.subscriptions.getByUserOrSubscription(userId),
    );
    return normalizeSubscription(response.data as RawSubscription);
  },
  
  update: async (id: string, data: AdminSubscriptionUpdatePayload) => {
    const response = await api.patch(apiConfig.endpoints.subscriptions.update(id), data);
    return normalizeSubscription(response.data as RawSubscription);
  },

  activateFromRequest: async (requestId: string): Promise<AdminSubscription> => {
    const response = await api.post(
      apiConfig.endpoints.subscriptions.activateFromRequest(requestId),
    );
    return normalizeSubscription(response.data as RawSubscription);
  },
};
