import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
export type Material = {
  id?: number;
  name: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};
export const useMaterials = () => {
  const {
    data: materials,
    isLoading: materialsLoading,
    error: materialsError,
    refetch: refetchMaterials,
  } = useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/materials");
      return (res.data as Material[]) ?? [];
    },
  });

  const {
    mutate: createMaterial,
    isSuccess: createMaterialSuccess,
    isError: createMaterialError,
  } = useMutation({
    mutationFn: async (data: Material) => {
      const response = await axiosInstance.post("/api/materials", {
        ...data,
        status: "active",
      });
      return response.data;
    },

    onSuccess: () => {
      refetchMaterials();
    },
    onError: () => {},
  });

  const {
    mutate: updateMeterial,
    isSuccess: updateMeterialSuccess,
    isError: updateMeterialError,
  } = useMutation({
    mutationFn: async (data: Material) => {
      const response = await axiosInstance.put(
        `/api/materials/${data.id}`,
        data
      );
      return response;
    },
    onSuccess: () => {},
    onError: () => {},
  });

  // handle update status
  const {
    mutate: updateStatus,
    isSuccess: updateStatusSuccess,
    isError: updateStatusError,
  } = useMutation({
    mutationFn: async (data: Material) => {
      const response = await axiosInstance.put(
        `/api/materials/${data.id}`,
        data
      );
      return response;
    },
    onSuccess: () => {},
    onError: () => {},
  });

  // handle ddelete meterial
  const { mutate: deleteMeterial } = useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete(`/api/materials/${id}`);
      return response;
    },
    onSuccess: () => {
      refetchMaterials();
    },
    onError: () => {},
  });

  return {
    materials,
    materialsLoading,
    materialsError,
    createMaterial,
    createMaterialSuccess,
    createMaterialError,
    updateMeterial,
    updateMeterialSuccess,
    updateMeterialError,
    updateStatus,
    updateStatusSuccess,
    updateStatusError,
    deleteMeterial,
  };
};
