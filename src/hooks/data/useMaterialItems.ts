import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
export type MaterialItem = {
  id?: number;
  materialId: number;
  text?: string;
  url?: string;
  file?: File | string;
  name?: string;
  type?: string;
  size?: string;
  updatedAt?: string;
};
const useMaterialItems = ({ id, type }: { id?: string; type?: string }) => {
  const {
    data: materialItems,
    isLoading: materialItemsLoading,
    refetch: refetchMaterialItems,
  } = useQuery({
    queryKey: ["materialItems"],
    queryFn: async () => {
      const data = await axiosInstance.get(`/api/material-items/`, {
        params: {
          type,
        },
      });
      return data ?? [];
    },
    enabled: !!type,
    refetchOnWindowFocus: false,
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

  /*
   * upload file
   */

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

  /*
   * fetch chunks of material item
   */

  const { data: chunks, isFetching: isFetchingChunk } = useQuery({
    queryKey: ["chunks"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/material-items/${id}/chunks`
      );
      return data ?? [];
    },
    enabled: !!id,
  });

  return {
    deleteMaterialItem,
    materialItems,
    materialItemsLoading,
    chunks,
    handleUploadFile,
    refetchMaterialItems,
    isFetchingChunk,
  };
};

export default useMaterialItems;
