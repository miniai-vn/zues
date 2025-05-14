import axiosInstance from "@/configs";
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
  user: "Người dùng",
  guest: "Khách",
  leader: 'Trưởng phòng',
};

export const PermissionVietnameseNames: Record<string, string> = {
  // File
  "file.create": "Tải lên tệp",
  "file.read": "Xem tệp",
  "file.update": "Chỉnh sửa thông tin tệp",
  "file.delete": "Xoá tệp",
  "file.download": "Tải xuống tệp",
  "file.share": "Chia sẻ tệp",
  "file.access_sensitive": "Truy cập tệp nhạy cảm",

  // Chat
  "chat.read": "Xem lịch sử trò chuyện",
  "chat.create": "Gửi tin nhắn",
  "chat.update": "Chỉnh sửa tin nhắn",
  "chat.delete": "Xoá tin nhắn",
  "chat.train": "Huấn luyện chatbot",
  "chat.manage_settings": "Quản lý cài đặt chatbot",

  // User
  "user.create": "Tạo người dùng",
  "user.read": "Xem người dùng",
  "user.update": "Cập nhật người dùng",
  "user.delete": "Xoá người dùng",
  "user.ban": "Cấm hoặc mở cấm người dùng",
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
};

const useRoles = () => {
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
    data: roles,
    isLoading: isFetchingRoles,
    refetch: refetchRoles,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/roles/get-all", {
        params: {},
      });
      return (res.data as Role[]) || [];
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
    roles,
    isFetchingRoles,
    refetchRoles,
    permissions,
    isFetchingPermissions,
  };
};

export default useRoles;
