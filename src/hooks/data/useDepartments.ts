import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../use-toast";
import { User } from "./useAuth";
import { useEffect, useState } from "react";

export const PERMISSIONS = {
  user: "Nhân viên",
  admin: "Quản trị viên",
  owner: 'Chủ sở hữu',
};

export type Department = {
  id?: string;
  name: string;
  description: string;
  prompt: string;
  createdAt?: string;
  updatedAt?: string;
  isPublic?: boolean;
  users?: User[];
  role?: string;
  username?: string;
};

const useDepartments = ({ id, search }: { id?: string; search?: string }) => {
  const { toast } = useToast();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | null
  >(localStorage.getItem("selectedDepartmentId"));

  const {
    data: departments,
    isLoading: isFetchingDepartments,
    refetch: refetchDepartments,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/departments/get-all", {
        params: {
          search,
        },
      });
      return (res.data as Department[]) || [];
    },
  });

  useEffect(() => {
    if (departments?.length && !selectedDepartmentId) {
      debugger
      const firstDeptId = departments[0]?.id;
      if (firstDeptId) {
        localStorage.setItem("selectedDepartmentId", firstDeptId);
        setSelectedDepartmentId(firstDeptId);
      }
    }
  }, [departments]);

  const changeDepartment = (departmentId: string) => {
    
    localStorage.setItem("selectedDepartmentId", departmentId);
    setSelectedDepartmentId(departmentId);
  };

  const {
    mutate: createDepartment,
    isPending: isPendingCreateDept,
    isSuccess: isCreatedDepartment,
  } = useMutation({
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
        title: "Tạo nhóm tài liệu",
        description: "Tạo nhóm tài liệu thành công",
      });
    },
    onError: (error) => {
      toast({
        title: "Tạo nhóm tài liệu",
        description: error.message,
      });
    },
  });

  const { mutate: addUserToDept, isPending: isPendingAddUserToDept } =
    useMutation({
      mutationFn: async (data: {
        user_id: string;
        department_id: string;
        role: string;
      }) => {
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
          title: "Thêm người dùng vào nhóm tài liệu",
          description: "Thêm người dùng vào nhóm tài liệu thành công",
        });
      },
      onError: (error) => {
        toast({
          title: "Thêm người dùng vào nhóm tài liệu",
          description: error.message,
        });
      },
    });

  const { mutate: removeUserFromDept, isPending: isPendingRemoveUserFromDept } =
    useMutation({
      mutationFn: async (data: { user_id: string; department_id: string }) => {
        const res = await axiosInstance.delete("/api/departments/delete-user", {
          params: data,
        });
        return res.data;
      },
      onSuccess: () => {
        refetchDepartments();
        toast({
          title: "Xóa người dùng khỏi nhóm tài liệu",
          description: "Xóa người dùng khỏi nhóm tài liệu thành công",
        });
      },
      onError: (error) => {
        toast({
          title: "Xóa người dùng khỏi nhóm tài liệu",
          description: error.message,
        });
      },
    });

  const { mutate: updateUserDept, isPending: isPendingUpdateUserDept } =
    useMutation({
      mutationFn: async (data: {
        user_id: string;
        department_id: string;
        role: string;
      }) => {
        const res = await axiosInstance.put(
          "/api/departments/update-user",
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
          title: "Cập nhật người dùng trong nhóm tài liệu",
          description: "Cập nhật người dùng trong nhóm tài liệu thành công",
        });
      },
      onError: (error) => {
        toast({
          title: "Cập nhật người dùng trong nhóm tài liệu",
          description: error.message,
        });
      },
    });

  const { mutate: deleteDepartment, isPending: isPendingDeleteDepartment } =
    useMutation({
      mutationFn: async (id: string) => {
        await axiosInstance.delete(`/api/departments/${id}`);
      },
      onSuccess: () => {
        refetchDepartments();
        toast({
          title: "Xóa nhóm tài liệu",
          description: "Xóa nhóm tài liệu thành công",
        });
      },
      onError: (error) => {
        refetchDepartments();

        toast({
          title: "Xóa nhóm tài liệu",
          description: error.message,
        });
      },
    });

  const { mutate: updateDepartment, isPending: isPendingUpdateDepartment } =
    useMutation({
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
          title: "Cập nhật nhóm tài liệu",
          description: "Cập nhật nhóm tài liệu thành công",
        });
      },
      onError: (error) => {
        toast({
          title: "Cập nhật nhóm tài liệu",
          description: error.message,
        });
      },
    });

  return {
    updateDepartment,
    deleteDepartment,
    createDepartment,
    updateUserDept,
    isPendingUpdateUserDept,
    removeUserFromDept,
    isCreatedDepartment,
    addUserToDept,
    departments,
    isFetchingDepartments,
    refetchDepartments,
    selectedDepartmentId,
    changeDepartment,
    // Export all isPending states
    isPendingCreateDept,
    isPendingAddUserToDept,
    isPendingRemoveUserFromDept,
    isPendingDeleteDepartment,
    isPendingUpdateDepartment,
  };
};

export default useDepartments;
