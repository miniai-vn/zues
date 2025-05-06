import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../use-toast";
export type Resource = {
  id?: number;
  url?: string;
  file?: File | string;
  isActive?: boolean;
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
  search,
  limit = 10,
  page = 1,
}: {
  id?: string;
  type?: string;
  search?: string;
  limit?: number;
  page?: number;
}) => {
  const { toast } = useToast();

  const { data: materialItems, refetch: refetchResource } = useQuery({
    queryKey: ["resource", id, page, limit, search, type],
    queryFn: async () => {
      // Build query parameters for pagination
      const params = new URLSearchParams();
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());
      if (search) params.append("search", search);
      if (type) params.append("type", type);

      const queryString = params.toString();
      const endpoint = `/api/resources/by-department/${id}${
        queryString ? `?${queryString}` : ""
      }`;

      const res = await axiosInstance.get(endpoint);

      // Assuming the API returns data in the format { items: [...], total: number }
      return {
        items: res.data.items || res.data || [], // Adapt based on your API response structure
        totalCount: res.data.totalCount || res.data?.length || 0,
        page: page,
        limit: limit,
      };
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
      "/api/resources/upload-file",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  };

  const { mutate: createResource } = useMutation({
    mutationFn: async ({
      file,
      departmentId,
    }: {
      file: File;
      departmentId: string;
    }) => {
      debugger;
      const data = await handleUploadFile(file);
      const response = await axiosInstance.post(
        `/api/resources/`,
        {
          department_id: departmentId,
          extra: data,
          path: data.path,
          name: data.name,
          type: "document",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Tải lên thành công",
        description: "Tải lên tài liệu thành công",
      });
      refetchResource();
    },
    onError: () => {
      toast({
        title: "Tải lên thất bại",
        description: "Tải lên tài liệu thất bại",
      });
    },
  });

  const { mutate: deleteResource } = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/api/resources/${id}`, {});
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Xóa thành công",
        description: "Xóa tài liệu thành công",
      });
      refetchResource();
    },
    onError: () => {
      toast({
        title: "Xóa thất bại",
        description: "Xóa tài liệu thất bại",
      });
    },
  });

  const { mutate: createChunks, isPending: isCreateChunks } = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.patch(
        `/api/resources/create-chunks/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Tạo thành công",
        description: "Tạo tài liệu thành công",
      });
      refetchResource();
    },
    onError: () => {
      toast({
        title: "Tạo thất bại",
        description: "Tạo tài liệu thất bại",
      });
    },
  });

  const { mutate: syncResource } = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.patch(`/api/resources/sync/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Đồng bộ thành công",
        description: "Tạo tài liệu thành công",
      });
      refetchResource();
    },
    onError: () => {
      toast({
        title: "Đồng bộ thất bại",
        description: "Tạo tài liệu thất bại",
      });
    },
  });
  return {
    deleteResource,
    createResource,
    createChunks,
    isCreateChunks,
    materialItems,
    syncResource,
    handleUploadFile,
    refetchMaterialItems: refetchResource,
  };
};

export default useResource;
