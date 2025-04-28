import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { create } from "zustand";
import { useToast } from "../use-toast";
import { UserUpdateFormValues } from '../../components/dashboard/user-update-form';
import { Role } from "./useRoles";
import { Department } from "./useDepartments";

export type UserData = {
  id?: string;
  username: string;
  password: string;
  name?: string;
  roles: string[];
  email?: string;
  phone?: string;
  avatar?: string;
  departments: number[];
  position?: string;
};

export type User = {
  id: string;
  username: string;
  password: string;
  name: string;
  roles: Role[];
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

const useAuth = (page = 1, limit = 10, search = "") => {
  const { setUser, user } = useUserStore();
  const router = useRouter();

  const { toast } = useToast();
  const {
    data: users,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["user", page, limit, search],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/auth/users", {
        params: { page, limit, search },
      });
      return (response.data as User[]) ?? [];
    },
    enabled: !!user,
  });

  const { mutate: signIn, isSuccess } = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await axiosInstance.post("/api/auth/login", data);
      const token = response.data.token;
      setUser(response.data.user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response;
    },
    onSuccess() {
      console.log("Login successful");
      router.push("/dashboard/bot");
    },
  });

  const { mutate: register } = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await axiosInstance.post("/api/auth/register", data);
      return response;
    },
  });

  const { mutate: createUser } = useMutation({
    mutationFn: async (data: UserData) => {
      const response = await axiosInstance.post("/api/auth/users", data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Thêm thành công",
        description: `Thêm người dùng thành công`,
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Thất bại",
        description: `Thêm người dùng thất bại`,
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
  
  const { mutate: updateUser } = useMutation({
    mutationFn: async (data: UserData) => {
      const { id, ..._ } = data;
      if (!id) {
        throw new Error("User ID is required for update");
      }

      const response = await axiosInstance.post(
        `/api/auth/users/${data?.id}`,
        data
      );
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Cập nhật thành công",
        description: `Cập nhật người dùng thành công`,
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Thất bại",
        description: `Cập nhật người dùng thất bại`,
      });
      refetch();
    },
  });

  const { mutate: deleteUser } = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/api/auth/users/${id}`);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Xóa thành công",
        description: `Xóa người dùng thành công`,
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Thất bại",
        description: `Xóa người dùng thất bại`,
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

  return {
    users,
    isFetching,
    signIn,
    isSuccess,
    register,
    createUser,
    readUser,
    updateUser,
    deleteUser,
    loadUserFromLocalStorage,
  };
};

export { useAuth };
