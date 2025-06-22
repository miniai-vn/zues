// Global API types for pagination and queries

export interface PaginatedQueryParams {
  page: number;
  pageSize: number;
  filters: Record<string, any>;
  sort: { field: string; direction: "asc" | "desc" } | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UsePaginatedQueryProps {
  initialPage?: number;
  initialPageSize?: number;
  initialFilters?: Record<string, any>;
  initialSort?: { field: string; direction: "asc" | "desc" } | null;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

// Generic sort interface
export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

// Generic pagination info
export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  from: number;
  to: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

// Generic API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// Generic mutation response
export interface MutationResponse<T = any> extends ApiResponse<T> {
  timestamp?: string;
}
