import { useState } from 'react';

export const useAdminFilters = <TFilters extends Record<string, unknown>>(
  initialFilters: TFilters,
) => {
  const [filters, setFilters] = useState<TFilters>(initialFilters);

  const updateFilter = <TKey extends keyof TFilters>(
    key: TKey,
    value: TFilters[TKey],
  ) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const resetFilters = () => setFilters(initialFilters);

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
  };
};
