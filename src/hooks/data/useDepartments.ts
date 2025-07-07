import { axiosInstance } from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "../use-toast";
import { User } from "./useAuth";

export const PERMISSIONS = {
  user: "Nhân viên",
  admin: "Quản trị viên",
  owner: "Chủ sở hữu",
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
  syncStatus?: boolean;
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
      const res = await axiosInstance.get("/api/departments", {
        params: {
          search,
        },
      });
      return (res.data as Department[]) || [];
    },
  });

  const { data: departmentDetail } = useQuery({
    queryKey: ["departmentDetail", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await axiosInstance.get(`/api/departments/${id}`);
      return res.data as Department;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (departments?.length && !selectedDepartmentId) {
      const firstDeptId = departments[0]?.id;
      if (firstDeptId) {
        localStorage.setItem("selectedDepartmentId", firstDeptId);
        setSelectedDepartmentId(firstDeptId);
      }
    } else {
      const storedDeptId = localStorage.getItem("selectedDepartmentId");
      if (storedDeptId) {
        const deptExists = departments?.some(
          (dept) => dept.id === storedDeptId
        );
        if (!deptExists) {
          localStorage.removeItem("selectedDepartmentId");
          setSelectedDepartmentId(null);
        }
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
    isCreatedDepartment,
    departments,
    isFetchingDepartments,
    refetchDepartments,
    selectedDepartmentId,
    changeDepartment,
    departmentDetail,
    isPendingCreateDept,
    isPendingDeleteDepartment,
    isPendingUpdateDepartment,
  };
};

export default useDepartments;
