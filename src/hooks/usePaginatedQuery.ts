import { useCallback, useState } from 'react';

export function useTablePagination(initialPage = 1, initialPageSize = 10) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Pagination helpers
  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // Filter helpers
  const updateFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1); // Reset to first page when filters change
  }, []);

  const updateFilters = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  }, []);

  const clearFilter = useCallback((key: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
    setPage(1);
  }, []);

  // Sort helpers
  const updateSort = useCallback((field: string, direction: 'asc' | 'desc' = "asc") => {
    setSort({ field, direction });
    setPage(1); // Reset to first page when sort changes
  }, []);

  const toggleSort = useCallback((field: string) => {
    setSort((prev) => {
      if (!prev || prev.field !== field) {
        return { field, direction: "asc" as const };
      }
      if (prev.direction === "asc") {
        return { field, direction: "desc" as const };
      }
      return null; // Clear sort if was desc
    });
    setPage(1);
  }, []);

  const updatePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when page size changes
  }, []);

  return {
    page,
    pageSize,
    sort,
    filters,
    goToPage,
    updateFilter,
    updateFilters,
    clearFilter,
    updateSort,
    toggleSort,
    updatePageSize,
  };
}