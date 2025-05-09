import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../use-toast";
import { User } from "./useAuth";
import { useEffect, useState } from "react";

export type Department = {
  id?: string;
  name: string;
  description: string;
  prompt: string;
  createdAt?: string;
  updatedAt?: string;
  isPublic?: boolean;
  users?: User[];
};

const useDepartments = (id?: string) => {
  const { toast } = useToast();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | null
  >(localStorage.getItem("selectedDepartmentId"));
  const { data: departmentDetail } = useQuery({
    queryKey: ["departmentDetail", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await axiosInstance.get(`/api/departments/${id}`, {
        params: {},
      });
      return (res.data as Department) || null;
    },
    enabled: !!id,
  });
  const {
    data: departments,
    isLoading: isFetchingDepartments,
    refetch: refetchDepartments,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/departments/get-all", {
        params: {},
      });
      return (res.data as Department[]) || [];
    },
  });

  useEffect(() => {
    if (departments?.length && !selectedDepartmentId) {
      const firstDeptId = departments[0]?.id;
      if (firstDeptId) {
        localStorage.setItem("selectedDepartmentId", firstDeptId);
        setSelectedDepartmentId(firstDeptId);
      }
    }
  }, [departments, selectedDepartmentId]);

  const changeDepartment = (departmentId: string) => {
    localStorage.setItem("selectedDepartmentId", departmentId);
    setSelectedDepartmentId(departmentId);
  };

  const { mutate: createDepartment, isSuccess: isCreatedDepartment } =
    useMutation({
      mutationFn: async (data: Department) => {
        const res = await axiosInstance.post("/api/departments/", {
          name: data.name,
          description: data.description,
          is_public: data.isPublic,
          prompt: data.prompt,
        });
        return res.data;
      },
      onSuccess: () => {
        refetchDepartments();
        toast({
          title: "Create Department",
          description: "Create Department successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Create Department",
          description: error.message,
        });
      },
    });

  const { mutate: addUserToDept } = useMutation({
    mutationFn: async (data: { user_id: string; department_id: string }) => {
      const res = await axiosInstance.post(
        "/api/departments/create-user",
        data,
        {
          params: {},
        }
      );
      return res.data;
    },
    onSuccess: () => {
      refetchDepartments();
      toast({
        title: "Add User to Department",
        description: "Add User to Department successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Add User to Department",
        description: error.message,
      });
    },
  });

  const { mutate: removeUserFromDept } = useMutation({
    mutationFn: async (data: { user_id: string; department_id: string }) => {
      const res = await axiosInstance.delete("/api/departments/delete-user", {
        params: data,
      });
      return res.data;
    },
    onSuccess: () => {
      refetchDepartments();
      toast({
        title: "Remove User from Department",
        description: "Remove User from Department successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Remove User from Department",
        description: error.message,
      });
    },
  });

  const { mutate: deleteDepartment } = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/api/departments/${id}`);
    },
    onSuccess: () => {
      refetchDepartments();
      toast({
        title: "Delete Department",
        description: "Delete Department successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete Department",
        description: error.message,
      });
    },
  });

  const { mutate: updateDepartment } = useMutation({
    mutationFn: async (data: Department) => {
      const res = await axiosInstance.put(`/api/departments/${data.id}`, {
        name: data.name,
        description: data.description,
        is_public: data.isPublic,
        prompt: data.prompt,
      });
      return res.data;
    },
    onSuccess: () => {
      refetchDepartments();
      toast({
        title: "Update Department",
        description: "Update Department successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Department",
        description: error.message,
      });
    },
  });

  return {
    updateDepartment,
    deleteDepartment,
    createDepartment,
    removeUserFromDept,
    isCreatedDepartment,
    addUserToDept,
    departments,
    isFetchingDepartments,
    refetchDepartments,
    selectedDepartmentId,
    changeDepartment,
  };
};

export default useDepartments;
