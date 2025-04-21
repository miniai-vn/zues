import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../use-toast";

export type Role = {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

const useRoles = () => {
  const { toast } = useToast();
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
    updateRole,
    deleteRole,
    createRole,
    isCreatedRole,
    addUserToRole,
    roles,
    isFetchingRoles,
    refetchRoles,
  };
};

export default useRoles;