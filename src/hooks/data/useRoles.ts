import { axiosInstance } from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../use-toast";
import { useTranslations } from "../useTranslations";
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
  permissions: Record<string, boolean>;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};
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

type UseRolesWithPermissionsProps = {
  page?: number;
  limit?: number;
  search?: string;
  id?: string;
};

const useRoles = ({
  page = 1,
  limit = 10,
  search = "",
  id,
}: UseRolesWithPermissionsProps = {}) => {
  const { toast } = useToast();
  const { t } = useTranslations();
  const { data: permissions, isLoading: isFetchingPermissions } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/permissions/get-all", {
        params: {},
      });
      return (res.data as Permission[]) || [];
    },
  });

  const {
    data: roleWithFullPermissions,
    isLoading: isFetchingRoleWithFullPermissions,
    refetch: refetchRoleWithFullPermissions,
  } = useQuery({
    queryKey: ["roles-with-full-permissions"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/roles/${id}`, {
        params: {},
      });
      return (res.data as Role) || [];
    },
    enabled: !!id,
  });
  const {
    data: roleWithPermissions,
    isLoading: isFetchingRolesWithPermissions,
    refetch: refetchRolesWithPermissions,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/roles/get-all", {
        params: {},
      });
      return (res.data as Role[]) || [];
    },
  });

  const {
    data: roles,
    isLoading: isFetchingRoles,
    refetch: refetchRoles,
  } = useQuery({
    queryKey: ["roles-with-permissions"],
    queryFn: async () => {
      const params: Record<string, any> = {
        page,
        limit,
      };
      if (search) params.search = search;
      const res = await axiosInstance.get("/api/roles/", {
        params,
      });
      return {
        items: (res.data.items || []) as Role[],
        totalCount: res.data.totalCount || 0,
        page,
        limit,
      };
    },
  });
  const { mutate: createRole, isSuccess: isCreatedRole } = useMutation({
    mutationFn: async (data: Role) => {
      const res = await axiosInstance.post("/api/roles/", {
        name: data.name,
        description: data.description,
      });
      return res.data;
    },
    onSuccess: () => {
      refetchRoles();
      toast({
        title: t("roles.actions.create"),
        description: t("roles.messages.createSuccess"),
      });
    },
    onError: (error) => {
      toast({
        title: t("roles.actions.create"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const { mutate: addUserToRole } = useMutation({
    mutationFn: async (data: { user_id: string; role_id: string }) => {
      const res = await axiosInstance.post("/api/roles/create-user", data, {
        params: {},
      });
      return res.data;
    },
    onSuccess: () => {
      refetchRoles();
      toast({
        title: t("roles.actions.addUserToRole"),
        description: t("roles.messages.addUserSuccess"),
      });
    },
    onError: (error) => {
      toast({
        title: t("roles.actions.addUserToRole"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const { mutate: deleteRole } = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/api/roles/${id}`);
    },
    onSuccess: () => {
      refetchRoles();
      toast({
        title: t("roles.actions.delete"),
        description: t("roles.messages.deleteSuccess"),
      });
    },
    onError: (error) => {
      toast({
        title: t("roles.actions.delete"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const { mutate: updateRole } = useMutation({
    mutationFn: async (data: Role) => {
      const res = await axiosInstance.put(`/api/roles/${data.id}`, {
        name: data.name,
        description: data.description,
        permissions: data.permissions,
      });
      return res.data;
    },
    onSuccess: () => {
      refetchRoles();
      toast({
        title: t("roles.actions.update"),
        description: t("roles.messages.updateSuccess"),
      });
    },
    onError: (error) => {
      toast({
        title: t("roles.actions.update"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const { mutate: updateMutipleRole } = useMutation({
    mutationFn: async (data: Role[]) => {
      const res = await axiosInstance.post(`/api/roles/multiple`, {
        data,
      });
      return res.data;
    },
    onSuccess: () => {
      refetchRoles();
      toast({
        title: t("roles.actions.updateMultiple"),
        description: t("roles.messages.updateMultipleSuccess"),
      });
    },
    onError: (error) => {
      toast({
        title: t("roles.actions.updateMultiple"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
  return {
    updateMutipleRole,
    updateRole,
    deleteRole,
    createRole,
    isCreatedRole,
    addUserToRole,
    roleWithPermissions,
    isFetchingRoles,
    refetchRoles,
    permissions,
    isFetchingPermissions,
    roles,
    isFetchingRolesWithPermissions,
    refetchRolesWithPermissions,
    roleWithFullPermissions,
    isFetchingRoleWithFullPermissions,
    refetchRoleWithFullPermissions,
  };
};

export default useRoles;
