export type AdminPage =
  | 'login'
  | 'dashboard'
  | 'users'
  | 'subscriptions'
  | 'paymentMethods'
  | 'plans'
  | 'subscriptionRequests'
  | 'documents'
  | 'alerts'
  | 'activity'
  | 'settings';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export type DashboardStats = {
  totalUsers: number;
  activeUsers: number;
  totalChats: number;
  premiumUsers: number;
  pendingSubscriptionRequests?: number;
  totalDocuments?: number;
  processedDocuments?: number;
  failedDocuments?: number;
  openAlerts?: number;
  humanReviewCases?: number;
};

export type DashboardChat = {
  id: string;
  title: string;
  userEmail: string;
  createdAt?: string;
  messageCount?: number;
};

export type DashboardActivity = {
  id: string;
  type: 'user' | 'chat' | 'subscriptionRequest' | 'document' | string;
  title: string;
  subtitle: string;
  timestamp?: string;
  status?: string;
};

export type DashboardResponse = {
  period?: {
    label: string;
    generatedAt: string;
  };
  stats: DashboardStats;
  recentChats: DashboardChat[];
  recentActivity?: DashboardActivity[];
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type ListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
  isActive?: boolean;
  category?: string;
};

export type AdminUser = {
  id: string;
  _id?: string;
  email: string;
  name: string;
  role: 'user' | 'superadmin';
  isActive: boolean;
  isEmailVerified?: boolean;
  twoFactorEnabled?: boolean;
  twoFactorMethod?: 'email' | 'sms' | 'totp';
  createdAt?: string;
  updatedAt?: string;
};

export type AdminSubscription = {
  id: string;
  _id?: string;
  userId: string;
  userName: string;
  planId?: string;
  planName: string;
  planCode: string;
  planCategory?: string;
  status: string;
  amount: number;
  currency?: string;
  autoRenew?: boolean;
  startDate?: string;
  endDate?: string;
  limits?: Record<string, number>;
  usageSnapshot?: unknown;
};

export type AdminDocument = {
  id: string;
  _id?: string;
  title: string;
  category: string;
  status: string;
  version?: string;
  author?: string;
  content?: string;
  hasFile?: boolean;
  originalFileName?: string;
  systemStatus?: 'processed' | 'pending' | 'uploaded_not_extracted' | 'failed';
  extractionStatus?: string;
  processingStatus?: string;
  processingError?: string;
  indexingStatus?: string;
  extractedText?: string;
  extractedTextAvailable?: boolean;
  extractedTextLength?: number;
  chunkCount?: number;
  lastUpdated?: string;
};

export type RagSearchResult = {
  contextUsed: boolean;
  retrievalMode: 'none' | 'keyword' | 'semantic';
  chunks: Array<{
    documentId: string;
    documentTitle: string;
    chunkIndex: number;
    text: string;
    score: number;
  }>;
};

export type RagHealth = {
  totalDocuments: number;
  indexedDocuments: number;
  processingDocuments: number;
  failedDocuments: number;
  totalChunks: number;
  semanticChunks: number;
  keywordChunks: number;
  embeddingsConfigured?: boolean;
  embeddingModel?: string;
  atlasVectorIndexConfigured?: boolean;
  atlasVectorIndex?: string;
  effectiveRetrievalMode?: 'atlas_vector' | 'local_semantic' | 'keyword' | 'none';
  generatedAt?: string;
};

export type AdminAlert = {
  id: string;
  _id?: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  assignedTo?: string;
};

export type AdminSettings = {
  _id?: string;
  key?: string;
  platformName?: string;
  baseUrl?: string;
  timezone?: string;
  language?: string;
  dailyLimit?: number;
  monthlyLimit?: number;
};

export type AuthProfile = AdminUser;

export type LoginResponse =
  | {
      user: AuthProfile;
      token: string;
    }
  | {
      twoFactorRequired: true;
      method: 'email' | 'sms' | 'totp';
      message: string;
      devCode?: string;
    };

export type ActivityItem = {
  id: string;
  timestamp?: string;
  action: string;
  actor: string;
  actorType: string;
  resource: string;
  details: string;
  severity?: string;
};
