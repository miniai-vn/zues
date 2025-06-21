import axiosInstance from "@/configs";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";

interface PaginatedQueryParams {
  page: number;
  pageSize: number;
  filters: Record<string, any>;
  sort: { field: string; direction: "asc" | "desc" } | null;
}

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface UsePaginatedQueryProps<T> {
  queryKey: string;
  queryFn: (params: PaginatedQueryParams) => Promise<PaginatedResponse<T>>;
  initialPage?: number;
  initialPageSize?: number;
  initialFilters?: Record<string, any>;
  initialSort?: { field: string; direction: "asc" | "desc" } | null;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

// Custom hook for managing paginated and filtered data with TanStack Query
export const usePaginatedQuery = <T>({
  queryKey,
  queryFn,
  initialPage = 1,
  initialPageSize = 10,
  initialFilters = {},
  initialSort = null,
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5 minutes
  gcTime = 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
}: UsePaginatedQueryProps<T>) => {
  // State management
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);
  const [sort, setSort] = useState<{
    field: string;
    direction: "asc" | "desc";
  } | null>(initialSort);

  // Memoized query parameters
  const queryParams = useMemo(
    () => ({
      page,
      pageSize,
      filters,
      sort,
    }),
    [page, pageSize, filters, sort]
  );

  // TanStack Query
  const query = useQuery({
    queryKey: [queryKey, queryParams],
    queryFn: () => queryFn(queryParams),
    enabled,
    staleTime,
    gcTime,
    placeholderData: keepPreviousData, // Keeps previous data while fetching new data
  });

  // Pagination helpers
  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const nextPage = useCallback(() => {
    if (query.data?.hasNext) {
      setPage((prev) => prev + 1);
    }
  }, [query.data?.hasNext]);

  const previousPage = useCallback(() => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [page]);

  const goToFirstPage = useCallback(() => {
    setPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    if (query.data?.totalPages) {
      setPage(query.data.totalPages);
    }
  }, [query.data?.totalPages]);

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

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  // Sort helpers
  const updateSort = useCallback(
    (field: string, direction: "asc" | "desc" = "asc") => {
      setSort({ field, direction });
      setPage(1); // Reset to first page when sort changes
    },
    []
  );

  const clearSort = useCallback(() => {
    setSort(null);
    setPage(1);
  }, []);

  const toggleSort = useCallback((field: string) => {
    setSort((prev) => {
      if (!prev || prev.field !== field) {
        return { field, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { field, direction: "desc" };
      }
      return null; // Clear sort if was desc
    });
    setPage(1);
  }, []);

  // Page size helper
  const updatePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when page size changes
  }, []);

  // Reset all parameters
  const reset = useCallback(() => {
    setPage(initialPage);
    setPageSize(initialPageSize);
    setFilters(initialFilters);
    setSort(initialSort);
  }, [initialPage, initialPageSize, initialFilters, initialSort]);

  // Computed values
  const hasFilters = Object.keys(filters).length > 0;
  const hasSort = sort !== null;
  const canGoNext = query.data?.hasNext ?? false;
  const canGoPrevious = page > 1;
  const totalPages = query.data?.totalPages ?? 0;
  const totalItems = query.data?.total ?? 0;

  return {
    // Query state
    ...query,

    // Current parameters
    page,
    pageSize,
    filters,
    sort,

    // Pagination actions
    goToPage,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    updatePageSize,

    // Filter actions
    updateFilter,
    updateFilters,
    clearFilter,
    clearAllFilters,

    // Sort actions
    updateSort,
    clearSort,
    toggleSort,

    // Reset
    reset,

    // Computed values
    hasFilters,
    hasSort,
    canGoNext,
    canGoPrevious,
    totalPages,
    totalItems,

    // Pagination info
    paginationInfo: {
      page,
      pageSize,
      totalPages,
      totalItems,
      hasNextPage: canGoNext,
      hasPreviousPage: canGoPrevious,
      from: (page - 1) * pageSize + 1,
      to: Math.min(page * pageSize, totalItems),
    },
  };
};

// Example usage with a mock API function
export const useUsersQuery = (
  options: Partial<UsePaginatedQueryProps<any>> = {}
) => {
  const fetchUsers = async ({
    page,
    pageSize,
    filters,
    sort,
  }: PaginatedQueryParams): Promise<PaginatedResponse<any>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: pageSize.toString(),
      ...filters,
      ...(sort && { sortBy: sort.field, sortOrder: sort.direction }),
    });

    const response = await axiosInstance.get(`/api/users?${params.toString()}`);
    return {
      data: response.data.data,
      page: response.data.meta.page,
      limit: response.data.meta.limit,
      total: response.data.meta.total,
      totalPages: response.data.meta.totalPages,
      currentPage: response.data.meta.currentPage,
      hasNext: response.data.meta.hasNext,
      hasPrevious: response.data.hasPrevious,
    };
  };

  return usePaginatedQuery({
    queryKey: "users",
    queryFn: fetchUsers,
    initialFilters: { status: "active" },
    initialSort: { field: "createdAt", direction: "desc" },
    ...options,
  });
};
