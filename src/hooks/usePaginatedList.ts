import { useCallback, useEffect, useState } from 'react';
import type { PaginatedResponse } from '../types/admin';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message;
  }

  return fallback;
};

type FetchPage<TItem, TFilters> = (
  params: TFilters & { page: number; limit: number },
) => Promise<PaginatedResponse<TItem>>;

export const usePaginatedList = <TItem, TFilters extends Record<string, unknown>>({
  fetchPage,
  filters,
  initialLimit = 20,
}: {
  fetchPage: FetchPage<TItem, TFilters>;
  filters: TFilters;
  initialLimit?: number;
}) => {
  const [items, setItems] = useState<TItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [meta, setMeta] = useState<PaginatedResponse<TItem>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetchPage({ ...filters, page, limit });
      setItems(response.data);
      setMeta(response.meta);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo cargar la informacion'));
    } finally {
      setLoading(false);
    }
  }, [fetchPage, filters, limit, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const applyFilters = () => {
    setPage(1);
    void load();
  };

  const changeLimit = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  };

  return {
    items,
    meta,
    page,
    limit,
    loading,
    error,
    load,
    setPage,
    changeLimit,
    applyFilters,
  };
};
