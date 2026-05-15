import api from './api';
import { apiConfig } from '../config/api';
import type {
  AdminDocument,
  DocumentChunkPreview,
  ListParams,
  PaginatedResponse,
  RagHealth,
  RagSearchResult,
} from '../types/admin';

const deriveSystemStatus = (document: any) => {
  const processingStatus = String(document?.processingStatus || '');
  const extractionStatus = String(document?.extractionStatus || '');
  const extractedText = String(document?.extractedText || '').trim();

  if (
    processingStatus === 'uploaded' ||
    processingStatus === 'processing' ||
    extractionStatus === 'pending' ||
    extractionStatus === 'processing'
  ) {
    return 'pending';
  }

  if (document?.sourceType === 'file' && extractionStatus === 'failed' && !extractedText) {
    return 'uploaded_not_extracted';
  }

  if (processingStatus === 'failed') {
    return 'failed';
  }

  return 'processed';
};

const normalize = (document: any): AdminDocument => ({
  ...document,
  id: document._id || document.id,
  hasFile: !!document.hasFile || !!document.fileUrl || !!document.storagePath,
  lastUpdated: document.lastUpdated || document.updatedAt || null,
  systemStatus: document.systemStatus || deriveSystemStatus(document),
});

const unwrapDocumentResponse = (payload: any): AdminDocument => {
  if (payload?.document) {
    return normalize({
      ...payload.document,
      ragIndexed: payload?.rag?.indexed,
      ragChunksCreated: payload?.rag?.chunksCreated,
    });
  }

  return normalize(payload);
};

const buildFormData = (data: any, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  Object.entries(data || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, String(value));
    }
  });

  return formData;
};

export const documentsService = {
  getAll: async (
    params: ListParams = {},
  ): Promise<PaginatedResponse<AdminDocument>> => {
    const response = await api.get(apiConfig.endpoints.documents.list, {
      params,
    });
    if (Array.isArray(response.data)) {
      const data = response.data.map(normalize);
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
      data: (response.data?.data || []).map(normalize),
    };
  },

  getOne: async (id: string) => {
    const response = await api.get(apiConfig.endpoints.documents.item(id));
    return normalize(response.data);
  },

  getExtractedText: async (id: string) => {
    const response = await api.get(apiConfig.endpoints.documents.extractedText(id));
    return {
      ...response.data,
      systemStatus: response.data?.systemStatus || deriveSystemStatus(response.data),
    };
  },

  getChunks: async (
    id: string,
  ): Promise<{ document: AdminDocument; chunks: DocumentChunkPreview[] }> => {
    const response = await api.get(apiConfig.endpoints.documents.chunks(id));
    return {
      document: normalize(response.data?.document || {}),
      chunks: Array.isArray(response.data?.chunks) ? response.data.chunks : [],
    };
  },

  create: async (data: any) => {
    const response = await api.post(apiConfig.endpoints.documents.create, data);
    return normalize(response.data);
  },

  upload: async (data: any, file: File) => {
    const response = await api.post(
      apiConfig.endpoints.documents.upload,
      buildFormData(data, file),
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return unwrapDocumentResponse(response.data);
  },

  update: async (id: string, data: any) => {
    const response = await api.put(apiConfig.endpoints.documents.item(id), data);
    return normalize(response.data);
  },

  replaceUpload: async (id: string, data: any, file: File) => {
    const response = await api.put(
      apiConfig.endpoints.documents.replaceUpload(id),
      buildFormData(data, file),
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return unwrapDocumentResponse(response.data);
  },

  setRagStatus: async (id: string, enabled: boolean) => {
    const response = await api.put(apiConfig.endpoints.documents.ragStatus(id), {
      enabled,
    });
    return normalize(response.data);
  },

  reindex: async (id: string) => {
    const response = await api.post(apiConfig.endpoints.documents.reindex(id));
    return response.data;
  },

  reprocess: async (id: string) => {
    const response = await api.post(apiConfig.endpoints.documents.reprocess(id));
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(apiConfig.endpoints.documents.item(id));
    return response.data;
  },

  download: async (id: string, fileName?: string) => {
    const response = await api.get(apiConfig.endpoints.documents.download(id), {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'application/octet-stream',
    });

    const url = window.URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = fileName || `document-${id}`;
    window.document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  searchRag: async (query: string, limit = 5): Promise<RagSearchResult> => {
    const response = await api.post(apiConfig.endpoints.documents.ragSearch, {
      query,
      limit,
    });
    return response.data;
  },

  getRagHealth: async (): Promise<RagHealth> => {
    const response = await api.get(apiConfig.endpoints.documents.ragHealth);
    return response.data;
  },
};
