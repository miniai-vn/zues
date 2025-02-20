import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
export type MaterialItem = {
  material: any;
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

export type LinkKnowLedge = {
  url: string;
};
const useKnowledge = ({ id, type }: { id?: string; type?: string }) => {
  const {
    data: materialItems,
    isLoading: materialItemsLoading,
    refetch: refetchMaterialItems,
  } = useQuery({
    queryKey: ["knowledge", type],
    queryFn: async () => {
      const data = await axiosInstance.get(`/api/knowledge/`, {
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
      "/api/knowledge/upload-file",
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
      const data = await axiosInstance.get(`/api/knowledge/chunks/${id}`);
      return data ?? [];
    },
    enabled: !!id,
  });

  const { mutate: syncKnowLedgeToVector, isPending: isSyncKnowledge } =
    useMutation({
      mutationFn: async (knowledgeId: number) => {
        const data = await axiosInstance.get(
          `/api/knowledge/sync/${knowledgeId}`
        );
        return data || [];
      },
    });

  const { mutate: createLinkKnowLedge } = useMutation({
    mutationFn: async ({ url }: LinkKnowLedge) => {
      const data = await axiosInstance.post("/api/knowledge/link", {
        url,
      });
      return data || [];
    },
    onSuccess: () => {
      refetchMaterialItems();
    },
    onError: () => {
      refetchMaterialItems();
    },
  });

  const { mutate: syncDataFromUrlToVector, isPending: isSyncUrl } = useMutation(
    {
      mutationFn: async (knowledgeId: number) => {
        const data = await axiosInstance.get(
          `/api/knowledge/sync-web/${knowledgeId}`
        );
        return data || [];
      },
    }
  );

  return {
    deleteMaterialItem,
    createLinkKnowLedge,
    materialItems,
    materialItemsLoading,
    chunks,
    handleUploadFile,
    refetchMaterialItems,
    syncDataFromUrlToVector,
    isSyncUrl,
    isFetchingChunk,
    syncKnowLedgeToVector,
    isSyncKnowledge,
  };
};

export default useKnowledge;
