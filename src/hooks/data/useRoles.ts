import { axiosInstance } from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../use-toast";
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
  // "chat.train": "Huấn luyện chatbot",
  // "chat.manage_settings": "Quản lý cài đặt chatbot",

  // User
  "user.create": "Tạo người dùng",
  "user.read": "Xem người dùng",
  "user.update": "Cập nhật người dùng",
  "user.delete": "Xoá người dùng",
  // "user.ban": "Cấm hoặc mở cấm người dùng",
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
        title: "Create Role",
        description: "Create Role successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Create Role",
        description: error.message,
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
        title: "Add User to Role",
        description: "Add User to Role successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Add User to Role",
        description: error.message,
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
        title: "Delete Role",
        description: "Delete Role successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete Role",
        description: error.message,
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
        title: "Update Role",
        description: "Update Role successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Role",
        description: error.message,
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
        title: "Update Role",
        description: "Update Role successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Role",
        description: error.message,
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
