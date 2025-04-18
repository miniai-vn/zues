import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { create } from "zustand";
import { useToast } from "../use-toast";
import { UserUpdateFormValues } from '../../components/dashboard/user-update-form';

export type UserData = {
  id?: string;
  username: string;
  password: string;
  name: string;
  roles: string[];
  email: string;
  phone: string;
  avatar: string;
};

export type UserUpdateData = {
  id: string | undefined;
} & UserUpdateFormValues;

export type User = {
  id: string;
  username: string;
  name: string;
  roles: string[];
  email: string;
  phone: string;
  avatar: string;
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
    queryKey: ["user", { page, limit, search }],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/auth/users", {
        params: { page, limit, search },
      });
      return response.data ?? [];
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
        title: "Created",
        description: `Created at ${new Date().toLocaleTimeString()}`,
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Error at ${new Date().toLocaleTimeString()}`,
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
    mutationFn: async (data: UserUpdateData) => {
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
        title: "Updated",
        description: `Updated at ${new Date().toLocaleTimeString()}`,
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Error at ${new Date().toLocaleTimeString()}`,
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
        title: "Deleted",
        description: `Deleted at ${new Date().toLocaleTimeString()}`,
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Error at ${new Date().toLocaleTimeString()}`,
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
