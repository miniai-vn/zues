import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Material } from "./useMaterials";
export type MaterialItem = {
  id?: number;
  materialId: number;
  text?: string;
  url?: string;
  file?: File | string;
  material?: Material;
};
const useMaterialItems = () => {
  const {
    data: materialItems,
    isLoading: materialItemsLoading,
    refetch: refetchMaterialItems,
  } = useQuery({
    queryKey: ["materialItems"],
    queryFn: async () => {
      const data = await axiosInstance.get("/api/material-items");
      return data ?? [];
    },
  });

  const { mutate: createMaterialItem } = useMutation({
    mutationFn: async (data: MaterialItem) => {
      const response = await axiosInstance.post("/api/material-items", {
        ...data,
        ...(data.file
          ? { file: await handleUploadFile(data.file as File) }
          : {}),
      });
      return response;
    },
    onSuccess: () => {
      refetchMaterialItems();
    },
    onError: () => {},
  });

  const { mutate: deleteMaterialItem } = useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete(`/api/material-items/${id}`);
      return response;
    },
    onSuccess: () => {
      refetchMaterialItems();
    },
    onError: () => {},
  });

  const { mutate: syncMaterialItem } = useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.patch(
        `/api/material-items/${id}/sync`
      );
      return response;
    },
    onSuccess: () => {
      refetchMaterialItems();
    },
    onError: () => {},
  });

  const handleUploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post(
      "/api/material-items/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.path;
  };
  return {
    deleteMaterialItem,
    materialItems,
    syncMaterialItem,
    materialItemsLoading,
    createMaterialItem,
  };
};

export default useMaterialItems;
