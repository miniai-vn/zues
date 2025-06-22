import { PaginatedQueryParams, PaginatedResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { Permission } from "./data/useRoles";
import axiosInstance from "@/configs";

export const usePermissions = () => {
  const fetchPermissions = async ({
    page,
    pageSize,
    filters,
    sort,
  }: PaginatedQueryParams): Promise<PaginatedResponse<Permission>> => {
    // Construct query parameters
    const params = new URLSearchParams({
      page: String(page),
      limit: String(pageSize),
      ...filters,
    });
    if (sort) {
      params.append("sortField", sort.field);
    }
    // Fetch permissions from the API
    const response: PaginatedResponse<Permission> = await axiosInstance.get(
      `/api/permissions?${params.toString()}`,
    );

    return response;
  };
  const permissionQuery = useQuery({
    queryKey: ["permissions"],
    queryFn: () =>
      fetchPermissions({
        page: 1,
        pageSize: 1000, // Fetch all permissions at once
        filters: {},
        sort: { field: "name", direction: "asc" }, // Default sort
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    enabled: true,
  });
  return {
    permissions: permissionQuery.data?.data || [],
    isLoading: permissionQuery.isLoading,
    isError: permissionQuery.isError,
    refetch: permissionQuery.refetch,
  };
};
