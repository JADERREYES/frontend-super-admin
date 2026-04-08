import api from './api';

export type PremiumRequestAdminItem = {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  planCode: string;
  requestType: 'premium' | 'extra_tokens' | 'custom';
  planSnapshot: {
    price: number;
    currency: string;
    durationDays: number;
    limits: Record<string, number>;
  };
  paymentMethodId: string;
  paymentMethodSnapshot: {
    name: string;
    code: string;
    accountLabel?: string;
    accountValue?: string;
    holderName?: string;
    accountNumber: string;
    instructions: string;
  };
  message: string;
  proofUrl?: string;
  proofOriginalName?: string;
  receiptUrl?: string;
  receiptFileName?: string;
  status:
    | 'new'
    | 'receipt_uploaded'
    | 'submitted'
    | 'under_review'
    | 'contacted'
    | 'pending_payment'
    | 'paid'
    | 'awaiting_validation'
    | 'approved'
    | 'rejected'
    | 'activated';
  adminNotes?: string;
  activatedSubscriptionId?: string;
  createdAt: string;
  updatedAt?: string;
};

export const premiumRequestsService = {
  getAll: async (): Promise<PremiumRequestAdminItem[]> => {
    const response = await api.get('/admin/subscription-requests');
    return response.data;
  },

  updateStatus: async (
    id: string,
    status: PremiumRequestAdminItem['status'],
  ) => {
    const response = await api.patch(`/admin/subscription-requests/${id}/status`, {
      status,
    });
    return response.data;
  },

  updateNotes: async (id: string, adminNotes: string) => {
    const response = await api.patch(`/admin/subscription-requests/${id}/notes`, {
      adminNotes,
    });
    return response.data;
  },

  activate: async (id: string, adminNotes?: string) => {
    const response = await api.post(`/admin/subscription-requests/${id}/activate`, {
      adminNotes,
    });
    return response.data;
  },
};
