import axiosInstance from "@/configs";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import { User } from "./data/useAuth";
import { useToast } from "./use-toast";
import {
  PaginatedQueryParams,
  PaginatedResponse,
  UsePaginatedQueryProps,
  PaginationInfo,
  MutationResponse,
} from "../types/api";

// User-specific interfaces
interface CreateUserData
  extends Omit<
    User,
    "id" | "roles" | "departments" | "createdAt" | "updatedAt"
  > {
  roleIds: number[];
  departmentIds: number[];
  password: string;
  confirmPassword?: string;
}

interface UpdateUserData
  extends Partial<Omit<User, "id" | "createdAt" | "updatedAt">> {
  roleIds?: number[];
  departmentIds?: number[];
  password?: string;
}

export const useUsers = ({
  initialPage = 1,
  initialPageSize = 10,
  initialFilters = {},
  initialSort = null,
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5 minutes
  gcTime = 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
}: UsePaginatedQueryProps) => {
  const { toast } = useToast();
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
    [page, pageSize, filters, sort],
  );

  const createUser = async (
    data: CreateUserData,
  ): Promise<MutationResponse<User>> => {
    return await axiosInstance.post("/api/users", data);
  };

  const updateUser = async ({
    id,
    data,
  }: {
    id: string;
    data: UpdateUserData;
  }): Promise<MutationResponse<User>> => {
    return await axiosInstance.put(`/api/users/${id}`, data);
  };

  const deleteUser = async (id: string): Promise<MutationResponse> => {
    return await axiosInstance.delete(`/api/users/${id}`);
  };

  const fetchUsers = async ({
    page,
    pageSize,
    filters,
    sort,
  }: PaginatedQueryParams): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: pageSize.toString(),
      ...filters,
      ...(sort && { sortBy: sort.field, sortOrder: sort.direction }),
    });

    const response: PaginatedResponse<User> = await axiosInstance.get(
      `/api/users?${params.toString()}`,
    );

    return response;
  };

  // Mutation hooks for create, update, delete
  const { mutateAsync: createUserMutation } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast({
        title: "User Created",
        description: `User created successfully at ${new Date().toLocaleTimeString()}`,
      });
      query.refetch(); // Refetch users after creation
    },
  });
  const { mutateAsync: updateUserMutation } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast({
        title: "User Updated",
        description: `User updated successfully at ${new Date().toLocaleTimeString()}`,
      });
      query.refetch(); // Refetch users after update
      // Optionally refetch or invalidate queries
    },
  });

  const { mutate: deleteUserMutation } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast({
        title: "User Deleted",
        description: `User deleted successfully at ${new Date().toLocaleTimeString()}`,
      });
      query.refetch(); // Refetch users after deletion
      // Optionally refetch or invalidate queries
    },
  });
  // TanStack Query
  const query = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => fetchUsers(queryParams),
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus: false, // Refetch when window is focused
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
    [],
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

  // Enhanced pagination info using global type
  const paginationInfo: PaginationInfo = useMemo(
    () => ({
      page,
      pageSize,
      totalPages: query.data?.totalPages ?? 0,
      totalItems: query.data?.total ?? 0,
      hasNextPage: query.data?.hasNext ?? false,
      hasPreviousPage: page > 1,
      from: (page - 1) * pageSize + 1,
      to: Math.min(page * pageSize, query.data?.total ?? 0),
      isFirstPage: page === 1,
      isLastPage: page === (query.data?.totalPages ?? 1),
    }),
    [page, pageSize, query.data],
  );

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

    // Enhanced pagination info
    paginationInfo,

    // Mutation functions
    createUser: createUserMutation,
    updateUser: updateUserMutation,
    deleteUser: deleteUserMutation,
  };
};

// Export the extended types
export type { CreateUserData, UpdateUserData };
