import { Meterial } from "@/app/dashboard/meterials/add-meterial";
import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useMaterials = () => {
  const {
    data: materials,
    isLoading: materialsLoading,
    error: materialsError,
  } = useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/materials");
      return data;
    },
  });

  const {
    mutate: createMaterial,
    isSuccess: createMaterialSuccess,
    isError: createMaterialError,
  } = useMutation({
    mutationFn: async (data: Meterial) => {
      const response = await axiosInstance.post("/api/materials", {
        ...data,
        status: "active",
      });
      return response;
    },

    onSuccess: () => {},
    onError: () => {},
  });

  const {
    mutate: updateMeterial,
    isSuccess: updateMeterialSuccess,
    isError: updateMeterialError,
  } = useMutation({
    mutationFn: async (data: Meterial) => {
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
    mutationFn: async (data: Meterial) => {
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
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/api/materials/${id}`);
      return response;
    },
    onSuccess: () => {},
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
