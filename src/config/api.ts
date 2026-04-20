const LOCAL_API_URL = 'http://localhost:3001';
const PRODUCTION_API_URL = 'https://backend-core-taupe.vercel.app';

const resolveDefaultApiUrl = () => {
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0'
    ) {
      return LOCAL_API_URL;
    }
  }

  return PRODUCTION_API_URL;
};

const normalizeApiUrl = (value?: string) =>
  (value?.trim() || resolveDefaultApiUrl()).replace(/\/+$/, '');

export const apiConfig = {
  baseURL: normalizeApiUrl(import.meta.env.VITE_API_URL),
  storage: {
    tokenKey: 'admin_token',
    profileKey: 'admin_user',
  },
  endpoints: {
    auth: {
      login: '/auth/login',
      profile: '/auth/profile',
      changePassword: '/auth/change-password',
      requestEmailChange: '/auth/email-change/request',
      confirmEmailChange: '/auth/email-change/confirm',
      requestTwoFactor: '/auth/2fa/request',
      confirmTwoFactor: '/auth/2fa/confirm',
      disableTwoFactor: '/auth/2fa/disable',
    },
    users: {
      list: '/users',
      updateStatus: (id: string) => `/users/${id}/status`,
      updateRole: (id: string) => `/users/${id}/role`,
    },
    subscriptions: {
      list: '/admin/user-subscriptions',
      getByUserOrSubscription: (id: string) => `/admin/user-subscriptions/${id}`,
      update: (id: string) => `/admin/user-subscriptions/${id}`,
      activateFromRequest: (requestId: string) =>
        `/admin/user-subscriptions/activate-from-request/${requestId}`,
    },
    alerts: {
      list: '/alerts',
      update: (id: string) => `/alerts/${id}`,
      updateStatus: (id: string) => `/alerts/${id}/status`,
      sendCrisisSupport: (id: string) => `/alerts/${id}/send-crisis-support`,
    },
    documents: {
      list: '/documents',
      create: '/documents',
      upload: '/documents/upload',
      item: (id: string) => `/documents/${id}`,
      extractedText: (id: string) => `/documents/${id}/extracted-text`,
      replaceUpload: (id: string) => `/documents/${id}/upload`,
      reindex: (id: string) => `/documents/${id}/reindex`,
      reprocess: (id: string) => `/documents/${id}/reprocess`,
      download: (id: string) => `/documents/${id}/download`,
      ragSearch: '/documents/rag/search',
      ragHealth: '/documents/rag/health',
    },
    admin: {
      dashboard: '/admin/dashboard',
      users: '/admin/users',
      activity: '/admin/activity',
      plans: '/admin/plans',
      plan: (id: string) => `/admin/plans/${id}`,
      planStatus: (id: string) => `/admin/plans/${id}/status`,
      paymentMethods: '/admin/payment-methods',
      paymentMethod: (id: string) => `/admin/payment-methods/${id}`,
      paymentMethodStatus: (id: string) =>
        `/admin/payment-methods/${id}/status`,
      subscriptionRequests: '/admin/subscription-requests',
      subscriptionRequestStatus: (id: string) =>
        `/admin/subscription-requests/${id}/status`,
      subscriptionRequestNotes: (id: string) =>
        `/admin/subscription-requests/${id}/notes`,
      subscriptionRequestActivate: (id: string) =>
        `/admin/subscription-requests/${id}/activate`,
      subscriptionRequestProofDownload: (id: string) =>
        `/admin/subscription-requests/${id}/proof/download`,
    },
    settings: {
      root: '/settings',
    },
  },
};

export const getAuthToken = () => {
  const token = localStorage.getItem(apiConfig.storage.tokenKey)?.trim();
  return token && token !== 'undefined' && token !== 'null' ? token : null;
};

export const clearAuthSession = () => {
  localStorage.removeItem(apiConfig.storage.tokenKey);
  localStorage.removeItem(apiConfig.storage.profileKey);
};

export const resolveApiAssetUrl = (path?: string) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return `${apiConfig.baseURL}${path.startsWith('/') ? path : `/${path}`}`;
};
