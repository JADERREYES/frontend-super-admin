import api from './api';
import { apiConfig } from '../config/api';

export type PremiumRequestAdminItem = {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  currentPlanCode?: string;
  currentPlanName?: string;
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
  payerName?: string;
  payerPhone?: string;
  reportedAmount?: number;
  paidAtReference?: string;
  message: string;
  proofUrl?: string;
  proofFileUrl?: string;
  proofStorageProvider?: string;
  proofStorageKey?: string;
  proofOriginalName?: string;
  proofMimeType?: string;
  proofSize?: number;
  hasProof?: boolean;
  receiptUrl?: string;
  receiptFileName?: string;
  status:
    | 'pending'
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
  activatedPlanId?: string | null;
  activatedPlanName?: string;
  activatedPlanCode?: string;
  activatedPlanCategory?: string;
  activatedSubscriptionStatus?: string;
  activatedAmount?: number;
  activatedCurrency?: string;
  activatedLimits?: Record<string, number>;
  activatedStartDate?: string | null;
  activatedEndDate?: string | null;
  createdAt: string;
  updatedAt?: string;
};

export const premiumRequestsService = {
  getAll: async (): Promise<PremiumRequestAdminItem[]> => {
    const response = await api.get(apiConfig.endpoints.admin.subscriptionRequests);
    return response.data;
  },

  updateStatus: async (
    id: string,
    status: PremiumRequestAdminItem['status'],
  ) => {
    const response = await api.patch(
      apiConfig.endpoints.admin.subscriptionRequestStatus(id),
      { status },
    );
    return response.data;
  },

  updateNotes: async (id: string, adminNotes: string) => {
    const response = await api.patch(
      apiConfig.endpoints.admin.subscriptionRequestNotes(id),
      { adminNotes },
    );
    return response.data;
  },

  activate: async (id: string, adminNotes?: string) => {
    const response = await api.post(
      apiConfig.endpoints.admin.subscriptionRequestActivate(id),
      { adminNotes },
    );
    return response.data;
  },

  downloadProof: async (id: string, fileName?: string) => {
    const response = await api.get(
      apiConfig.endpoints.admin.subscriptionRequestProofDownload(id),
      { responseType: 'blob' },
    );

    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'application/octet-stream',
    });
    const url = window.URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = fileName || `comprobante-${id}`;
    window.document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
