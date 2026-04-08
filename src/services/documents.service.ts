import api from './api';

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

const normalize = (document: any) => ({
  ...document,
  id: document._id || document.id,
  hasFile: !!document.hasFile || !!document.fileUrl || !!document.storagePath,
  lastUpdated: document.lastUpdated || document.updatedAt || null,
  systemStatus: document.systemStatus || deriveSystemStatus(document),
});

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
  getAll: async () => {
    const response = await api.get('/documents');
    return (Array.isArray(response.data) ? response.data : []).map(normalize);
  },

  getOne: async (id: string) => {
    const response = await api.get(`/documents/${id}`);
    return normalize(response.data);
  },

  getExtractedText: async (id: string) => {
    const response = await api.get(`/documents/${id}/extracted-text`);
    return {
      ...response.data,
      systemStatus: response.data?.systemStatus || deriveSystemStatus(response.data),
    };
  },

  create: async (data: any) => {
    const response = await api.post('/documents', data);
    return normalize(response.data);
  },

  upload: async (data: any, file: File) => {
    const response = await api.post('/documents/upload', buildFormData(data, file), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return normalize(response.data);
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/documents/${id}`, data);
    return normalize(response.data);
  },

  replaceUpload: async (id: string, data: any, file: File) => {
    const response = await api.put(
      `/documents/${id}/upload`,
      buildFormData(data, file),
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return normalize(response.data);
  },

  reindex: async (id: string) => {
    const response = await api.post(`/documents/${id}/reindex`);
    return response.data;
  },

  reprocess: async (id: string) => {
    const response = await api.post(`/documents/${id}/reprocess`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },

  download: async (id: string, fileName?: string) => {
    const response = await api.get(`/documents/${id}/download`, {
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
};
