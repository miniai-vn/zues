import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";

export type Template = {
  id?: string;
  code: string;
  content: string;
  shopId?: string;
  channelId?: string;
  createdAt?: string;
  updatedAt?: string;
};
const useTemplates = ({
  queryParams = {},
  onSuccess,
  onError,
}: {
  queryParams?: {
    page?: number;
    pageSize?: number;
    channelId?: string;
    search?: string;
  };
  onSuccess?: (data: Template[]) => void;
  onError?: (error: Error) => void;
}) => {
  const { data: templates, isLoading: isLoadingTemplates } = useQuery<
    Template[]
  >({
    queryKey: ["templates", queryParams],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/templates", {
        params: queryParams,
      });
      return response.data;
    },
    enabled: !!queryParams,
  });

  const { mutate: createTemplate } = useMutation({
    mutationFn: async (newTemplate: Template) => {
      const response = await axiosInstance.post("/api/templates", {
        ...newTemplate,
      });
      return response.data;
    },
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  const { mutate: updateTemplate } = useMutation({
    mutationFn: async (updatedTemplate: Template) => {
      const response = await axiosInstance.put(
        `/api/templates/${updatedTemplate.id}`,
        updatedTemplate
      );
      return response.data;
    },
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  const { mutate: deleteTemplate } = useMutation({
    mutationFn: async (templateId: string) => {
      const response = await axiosInstance.delete(
        `/api/templates/${templateId}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    templates,
    isLoadingTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    queryParams,
  };
};
export default useTemplates;
