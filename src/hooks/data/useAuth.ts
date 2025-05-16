import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { create } from "zustand";
import { useToast } from "../use-toast";
import { UserUpdateFormValues } from "../../components/dashboard/user-update-form";
import { Role } from "./useRoles";
import { Department } from "./useDepartments";

export type UserData = {
  id?: string;
  username: string;
  password: string;
  name?: string;
  roles: number[];
  email?: string;
  phone?: string;
  avatar?: string;
  departments: number[];
  position?: string;
};

export type UserUpdateData = {
  id: string | undefined;
} & UserUpdateFormValues;

export type User = {
  id: string;
  username: string;
  password: string;
  name: string;
  roles: Role[];
  role?: String;
  email: string;
  phone: string;
  avatar: string;
  departments: Department[];
  position: string;
};

export const useUserStore = create<{
  user?: User;
  setUser: (user: User | undefined) => void;
}>((set) => ({
  user: undefined,
  setUser: (user: User | undefined) => set({ user }),
}));

const useAuth = ({
  page = undefined,
  limit = undefined,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const { setUser, user } = useUserStore();

  const { toast } = useToast();
  const { data: users, isFetching } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/auth/users", {
        params: { search },
      });
      return (response.data as User[]) ?? [];
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { mutateAsync: signIn, isSuccess } = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const response = await axiosInstance.post("/api/auth/login", {
        username,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    },
  });

  const { mutate: register } = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await axiosInstance.post("/api/auth/register", data);
      return response;
    },
  });

  const { mutate: createUser, isPending: isPendingCreateUser } = useMutation({
    mutationFn: async (data: UserData) => {
      const response = await axiosInstance.post("/api/auth/users", data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Tạo mới",
        description: `Tạo mới lúc ${new Date().toLocaleTimeString()}`,
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: `Lỗi lúc ${new Date().toLocaleTimeString()}`,
      });
      refetch();
    },
  });

  const { mutate: readUser } = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.get(`/api/auth/users/${id}`);
      return response;
    },
  });

  const { mutate: updateUser, isPending: isPendingUpdateUser } = useMutation({
    mutationFn: async (data: UserUpdateData) => {
      const { id, ..._ } = data;
      const response = await axiosInstance.post(
        `/api/auth/users/${data?.id}`,
        data
      );
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Cập nhật",
        description: `Cập nhật lúc ${new Date().toLocaleTimeString()}`,
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: `Lỗi lúc ${new Date().toLocaleTimeString()}`,
      });
      refetch();
    },
  });

  const { mutate: deleteUser, isPending: isPendingDeleteUser } = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/api/auth/users/${id}`);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Đã xóa",
        description: `Đã xóa lúc ${new Date().toLocaleTimeString()}`,
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: `Lỗi xóa người dùng lúc ${new Date().toLocaleTimeString()}`,
      });
      refetch();
    },
  });

  const loadUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  const {
    data: userHasPagination,
    refetch: refetch,
    isFetching: isFetchingUserHasPagination,
  } = useQuery({
    queryKey: ["user", { page, limit, search }],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/auth/users", {
        params: { page, limit, search },
      });
      return {
        items: response.data.items || response.data || [],
        totalCount: response.data.totalCount || response.data?.length || 0,
        page: page,
        limit: limit,
      };
    },
    enabled: !!user && !!page && !!limit,
  });

  return {
    users,
    isFetching,
    user,
    isPendingCreateUser,
    isPendingUpdateUser,
    isPendingDeleteUser,
    userHasPagination,
    isFetchingUserHasPagination,
    signIn,
    isSuccess,
    register,
    createUser,
    refetch,
    readUser,
    updateUser,
    deleteUser,
    loadUserFromLocalStorage,
  };
};

export { useAuth };
