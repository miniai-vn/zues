import axiosInstance from "@/configs";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import { useToast } from "../use-toast";
import { useTranslations } from "../useTranslations";
import {
  PaginatedQueryParams,
  PaginatedResponse,
  UsePaginatedQueryProps,
  PaginationInfo,
  MutationResponse,
} from "@/types/api";

export type Permission = {
  id: string;
  name: string;
  description?: string;
  code: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Role = {
  id: number;
  name: string;
  permissions: Permission[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Extended Role interface for creation
interface CreateRoleData extends Omit<Role, "id" | "createdAt" | "updatedAt"> {
  permissionIds?: string[];
}

// Extended Role interface for updates
interface UpdateRoleData
  extends Partial<Omit<Role, "id" | "createdAt" | "updatedAt">> {
  permissionIds?: string[];
}

export const useRoles = ({
  initialPage = 1,
  initialPageSize = 10,
  initialFilters = {},
  initialSort = null,
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5 minutes
  gcTime = 10 * 60 * 1000, // 10 minutes
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
    [page, pageSize, filters, sort]
  );

  // API functions
  const createRole = async (
    data: CreateRoleData
  ): Promise<MutationResponse<Role>> => {
    return await axiosInstance.post("/api/roles", {
      name: data.name,
      description: data.description,
      permissions: data.permissions,
      permissionIds: data.permissionIds,
    });
  };

  const updateRole = async ({
    id,
    data,
  }: {
    id: string | number;
    data: UpdateRoleData;
  }): Promise<MutationResponse<Role>> => {
    return await axiosInstance.put(`/api/roles/${id}`, {
      name: data.name,
      description: data.description,
      permissionIds: data.permissions?.map((p) => p.id),
    });
  };

  const deleteRole = async (id: string | number): Promise<MutationResponse> => {
    return await axiosInstance.delete(`/api/roles/${id}`);
  };

  const fetchRoles = async ({
    page,
    pageSize,
    filters,
    sort,
  }: PaginatedQueryParams): Promise<PaginatedResponse<Role>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: pageSize.toString(),
      ...filters,
      ...(sort && { sortBy: sort.field, sortOrder: sort.direction }),
    });

    const response: PaginatedResponse<Role> = await axiosInstance.get(
      `/api/roles?${params.toString()}`
    );

    return response;
  };

  // Get single role with full permissions
  const fetchRoleById = async (id: string | number): Promise<Role> => {
    return await axiosInstance.get(`/api/roles/${id}`);
  };

  // Mutation hooks for create, update, delete
  const { mutate: createRoleMutation } = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      toast({
        title: "Role Created",
        description: `Role created successfully at ${new Date().toLocaleTimeString()}`,
      });
      query.refetch(); // Refetch roles after creation
    },
    onError: (error: any) => {
      toast({
        title: "Error Creating Role",
        description: error.message || "Failed to create role",
        variant: "destructive",
      });
    },
  });

  const { mutate: updateRoleMutation } = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      toast({
        title: "Role Updated",
        description: `Role updated successfully at ${new Date().toLocaleTimeString()}`,
      });
      query.refetch(); // Refetch roles after update
    },
    onError: (error: any) => {
      toast({
        title: "Error Updating Role",
        description: error.message || "Failed to update role",
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteRoleMutation } = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      toast({
        title: "Role Deleted",
        description: `Role deleted successfully at ${new Date().toLocaleTimeString()}`,
      });
      query.refetch(); // Refetch roles after deletion
    },
    onError: (error: any) => {
      toast({
        title: "Error Deleting Role",
        description: error.message || "Failed to delete role",
        variant: "destructive",
      });
    },
  });

  // TanStack Query for roles
  const query = useQuery({
    queryKey: ["roles", queryParams],
    queryFn: () => fetchRoles(queryParams),
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus: false, // Refetch when window is focused
    placeholderData: keepPreviousData, // Keeps previous data while fetching new data
  });

  // Single role query (for editing)
  const useRoleById = (id: string | number) => {
    return useQuery({
      queryKey: ["role", id],
      queryFn: () => fetchRoleById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    });
  };

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
    [page, pageSize, query.data]
  );

  return {
    // Query state
    ...query,
    data: query.data?.data || [], // Roles array

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

    // CRUD operations
    createRole: createRoleMutation,
    updateRole: updateRoleMutation,
    deleteRole: deleteRoleMutation,

    // Helper function to get role by ID
    useRoleById,

    // Refetch functions
    refetch: query.refetch,
  };
};

// Export types
export type { CreateRoleData, UpdateRoleData };

// Keep existing exports and helper hooks
export const RoleVietnameseNames: Record<string, string> = {
  admin: "Quản trị viên",
  moderator: "Người kiểm duyệt",
  developer: "Nhà phát triển",
  support_agent: "Nhân viên hỗ trợ",
  content_creator: "Người tạo nội dung",
  user: "Nhân viên",
  guest: "Khách",
  leader: "Trưởng phòng",
};

// Hook to get localized role names
export const useRoleNames = () => {
  const { t } = useTranslations();

  return {
    admin: t("roles.admin"),
    moderator: t("roles.moderator"),
    developer: t("roles.developer"),
    support_agent: t("roles.support_agent"),
    content_creator: t("roles.content_creator"),
    user: t("roles.user"),
    guest: t("roles.guest"),
    leader: t("roles.leader"),
  };
};

export const PermissionGroupVietnameseNames: Record<string, string> = {
  file: "Tệp",
  chat: "Trò chuyện",
  user: "Người dùng",
  role: "Vai trò",
  permission: "Quyền",
  setting: "Cài đặt",
  department: "Phòng ban",
  conversation: "Cuộc trò chuyện",
  chunk: "Đoạn văn",
};

// Hook to get localized permission group names
export const usePermissionGroupNames = () => {
  const { t } = useTranslations();

  return {
    file: t("permissions.groups.file"),
    chat: t("permissions.groups.chat"),
    user: t("permissions.groups.user"),
    role: t("permissions.groups.role"),
    permission: t("permissions.groups.permission"),
    setting: t("permissions.groups.setting"),
    department: t("permissions.groups.department"),
    conversation: t("permissions.groups.conversation"),
    chunk: t("permissions.groups.chunk"),
  };
};

export const PermissionVietnameseNames: Record<string, string> = {
  // File
  "file.create": "Tải lên tệp",
  "file.read": "Xem tệp",
  "file.update": "Chỉnh sửa thông tin tệp",
  "file.delete": "Xoá tệp",
  "file.download": "Tải xuống tệp",
  "file.share": "Chia sẻ tệp",
  "file.sync": "Đạo tạo AI",
  "file.chunk": "Phân đoạn tệp",

  // Chat
  "chat.read": "Xem lịch sử trò chuyện",
  "chat.create": "Gửi tin nhắn",
  "chat.update": "Chỉnh sửa tin nhắn",
  "chat.delete": "Xoá tin nhắn",

  // User
  "user.create": "Tạo người dùng",
  "user.read": "Xem người dùng",
  "user.update": "Cập nhật người dùng",
  "user.delete": "Xoá người dùng",
  "user.assign_role": "Gán vai trò cho người dùng",

  // Role & Permission
  "role.create": "Tạo vai trò",
  "role.read": "Xem vai trò",
  "role.update": "Cập nhật vai trò",
  "role.delete": "Xoá vai trò",
  "permission.assign": "Gán quyền cho vai trò",
  "permission.read": "Xem tất cả quyền",

  // Settings
  "setting.read": "Xem cài đặt hệ thống",
  "setting.update": "Cập nhật cài đặt hệ thống",
  "setting.reset": "Đặt lại hệ thống",

  // Department
  "department.create": "Tạo phòng ban",
  "department.read": "Xem phòng ban và thành viên",
  "department.update": "Cập nhật phòng ban",
  "department.delete": "Xoá phòng ban",
  "department.assign_user": "Gán người dùng vào phòng ban",
  "department.manage_roles": "Quản lý vai trò cấp phòng ban",

  // conversation
  "conversation.create": "Tạo cuộc trò chuyện",
  "conversation.read": "Xem cuộc trò chuyện",
  "conversation.update": "Cập nhật cuộc trò chuyện",
  "conversation.delete": "Xoá cuộc trò chuyện",
  "conversation.assign_user": "Gán người dùng vào cuộc trò chuyện",

  //Chunk
  "chunk.create": "Tạo đoạn đoạn văn",
  "chunk.read": "Xem đoạn văn",
  "chunk.update": "Cập nhật đoạn văn",
  "chunk.delete": "Xoá đoạn văn",

  // Report
  "report.create": "Tạo báo cáo",
  "report.read": "Xem báo cáo",
  "report.update": "Cập nhật báo cáo",
  "report.delete": "Xoá báo cáo",

  // FAQS
  "faq.create": "Tạo câu hỏi thường gặp",
  "faq.read": "Xem câu hỏi thường gặp",
  "faq.update": "Cập nhật câu hỏi thường gặp",
  "faq.delete": "Xoá câu hỏi thường gặp",

  // domain
  "domain.create": "Tạo miền",
  "domain.read": "Xem miền",
  "domain.update": "Cập nhật miền",
  "domain.delete": "Xoá miền",

  // channel
  "channel.create": "Tạo kênh",
  "channel.read": "Xem kênh",
  "channel.update": "Cập nhật kênh",
  "channel.delete": "Xoá kênh",
};

// Hook to get localized permission names
export const usePermissionNames = () => {
  const { t } = useTranslations();

  return {
    // File permissions
    "file.create": t("permissions.file.create"),
    "file.read": t("permissions.file.read"),
    "file.update": t("permissions.file.update"),
    "file.delete": t("permissions.file.delete"),
    "file.download": t("permissions.file.download"),
    "file.share": t("permissions.file.share"),
    "file.sync": t("permissions.file.sync"),
    "file.chunk": t("permissions.file.chunk"),

    // Chat permissions
    "chat.read": t("permissions.chat.read"),
    "chat.create": t("permissions.chat.create"),
    "chat.update": t("permissions.chat.update"),
    "chat.delete": t("permissions.chat.delete"),

    // User permissions
    "user.create": t("permissions.user.create"),
    "user.read": t("permissions.user.read"),
    "user.update": t("permissions.user.update"),
    "user.delete": t("permissions.user.delete"),
    "user.assign_role": t("permissions.user.assign_role"),

    // Role & Permission
    "role.create": t("permissions.role.create"),
    "role.read": t("permissions.role.read"),
    "role.update": t("permissions.role.update"),
    "role.delete": t("permissions.role.delete"),
    "permission.assign": t("permissions.permission.assign"),
    "permission.read": t("permissions.permission.read"),

    // Settings
    "setting.read": t("permissions.setting.read"),
    "setting.update": t("permissions.setting.update"),
    "setting.reset": t("permissions.setting.reset"),

    // Department
    "department.create": t("permissions.department.create"),
    "department.read": t("permissions.department.read"),
    "department.update": t("permissions.department.update"),
    "department.delete": t("permissions.department.delete"),
    "department.assign_user": t("permissions.department.assign_user"),
    "department.manage_roles": t("permissions.department.manage_roles"),

    // Conversation
    "conversation.create": t("permissions.conversation.create"),
    "conversation.read": t("permissions.conversation.read"),
    "conversation.update": t("permissions.conversation.update"),
    "conversation.delete": t("permissions.conversation.delete"),
    "conversation.assign_user": t("permissions.conversation.assign_user"),

    // Chunk
    "chunk.create": t("permissions.chunk.create"),
    "chunk.read": t("permissions.chunk.read"),
    "chunk.update": t("permissions.chunk.update"),
    "chunk.delete": t("permissions.chunk.delete"),

    // Report
    "report.create": t("permissions.report.create"),
    "report.read": t("permissions.report.read"),
    "report.update": t("permissions.report.update"),
    "report.delete": t("permissions.report.delete"),

    // FAQ
    "faq.create": t("permissions.faq.create"),
    "faq.read": t("permissions.faq.read"),
    "faq.update": t("permissions.faq.update"),
    "faq.delete": t("permissions.faq.delete"),

    // Domain
    "domain.create": t("permissions.domain.create"),
    "domain.read": t("permissions.domain.read"),
    "domain.update": t("permissions.domain.update"),
    "domain.delete": t("permissions.domain.delete"),

    // Channel
    "channel.create": t("permissions.channel.create"),
    "channel.read": t("permissions.channel.read"),
    "channel.update": t("permissions.channel.update"),
    "channel.delete": t("permissions.channel.delete"),
  };
};

export default useRoles;
