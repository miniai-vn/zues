import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../use-toast";
export type MaterialItem = {
  id?: number;
  url?: string;
  file?: File | string;
  name?: string;
  type?: string;
  size?: string;
  status?: string;
  createdAt?: string;
};

export type LinkKnowLedge = {
  url: string;
};
const useResource = ({
  id,
  type,
}: {
  id?: string;
  type?: string;
  search?: string;
  limit?: number;
  page?: number;
}) => {
  const { toast } = useToast();

  const {
    data: materialItems,
    isLoading: materialItemsLoading,
    refetch: refetchResource,
  } = useQuery({
    queryKey: ["resource", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/resources/by-department/${id}`);
      return res.data ?? [];
    },
    refetchOnWindowFocus: false,
  });

  /*
   * upload file
   */

  const handleUploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post(
      "/api/resource/upload-file",
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
      return [];
      const data = await axiosInstance.get(`/api/resource/chunks/${id}`);
      return data ?? [];
    },
    enabled: !!id,
  });

  const { mutate: syncKnowLedgeToVector, isPending: isSyncKnowledge } =
    useMutation({
      mutationFn: async (knowledgeId: number) => {
        const data = await axiosInstance.get(
          `/api/resource/sync/${knowledgeId}`
        );
        return data || [];
      },
    });

  const { mutate: createLinkKnowLedge } = useMutation({
    mutationFn: async ({ url }: LinkKnowLedge) => {
      const data = await axiosInstance.post("/api/resource/link", {
        url,
      });
      return data || [];
    },
    onSuccess: () => {
      toast({
        title: "Created",
        description: `Created at ${new Date().toLocaleTimeString()}`,
      });
      refetchResource();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Error at ${new Date().toLocaleTimeString()}`,
      });
      refetchResource();
    },
  });

  const { mutate: syncDataFromUrlToVector, isPending: isSyncUrl } = useMutation(
    {
      mutationFn: async (knowledgeId: number) => {
        const data = await axiosInstance.get(
          `/api/resource/sync-web/${knowledgeId}`
        );
        return data || [];
      },
    }
  );

  const { mutate: deleteLink } = useMutation({
    mutationFn: async (knowledgeId: number) => {
      const data = await axiosInstance.delete(
        `/api/resource/link/${knowledgeId}`
      );
      return data || [];
    },
    onSuccess: () => {
      toast({
        title: "Deleted",
        description: `Deleted at ${new Date().toLocaleTimeString()}`,
      });
      refetchResource();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `
          Error at ${new Date().toLocaleTimeString()}
          `,
      });
      refetchResource();
    },
  });

  const { mutate: deleteFileKnowledge } = useMutation({
    mutationFn: async (knowledgeId: number) => {
      const data = await axiosInstance.delete(
        `/api/resource/file/${knowledgeId}`
      );
      return data || [];
    },
    onError: () => {
      toast({
        title: "Error",
        description: `
          Error at ${new Date().toLocaleTimeString()}
          `,
      });
      refetchResource();
    },

    onSuccess: () => {
      toast({
        title: "Deleted",
        description: `Deleted at ${new Date().toLocaleTimeString()}`,
      });
      refetchResource();
    },
  });

  return {
    createLinkKnowLedge,
    deleteLink,
    deleteFileKnowledge,
    materialItems,
    materialItemsLoading,
    chunks,
    handleUploadFile,
    refetchMaterialItems: refetchResource,
    syncDataFromUrlToVector,
    isSyncUrl,
    isFetchingChunk,
    syncKnowLedgeToVector,
    isSyncKnowledge,
  };
};

export default useResource;
