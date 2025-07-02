import { axiosInstance } from "@/configs";
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
  description: string;
  extra?: any;
};

export type LinkKnowLedge = {
  url: string;
};

export interface ResourcesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  departmentId?: string;
}

const useResource = ({
  id,
  departmentId,
  type,
  search,
  limit = 10,
  page = 1,
}: {
  id?: string;
  type?: string;
  search?: string;
  departmentId?: string;
  limit?: number;
  page?: number;
}) => {
  const { toast } = useToast();

  const {
    data: materialItems,
    isPending: isPendingFetchingItem,
    refetch: refetchResource,
  } = useQuery({
    queryKey: ["resource", page, limit, search, type, departmentId],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/resources", {
        params: {
          page: page,
          limit: limit,
          search: search,
          type: type,
          departmentId: departmentId,
        },
      });

      return {
        items: res.data.items || res.data || [],
        totalCount: res.data.totalCount || res.data?.length || 0,
        page: page,
        limit: limit,
      };
    },
    refetchOnWindowFocus: false,
    enabled: !!departmentId,
  });

  /*
   * upload file
   */

  const handleUploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post(`/api/uploads`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  };

  const { mutate: createResource, isPending: isPendingCreateResource } =
    useMutation({
      mutationFn: async ({
        file,
        departmentId,
        description,
        type,
      }: {
        file: File;
        departmentId: string;
        description: string;
        type: string;
      }) => {
        const data = await handleUploadFile(file);
        const response = await axiosInstance.post(
          `/api/resources/`,
          {
            departmentId: departmentId,
            extra: data.extra,
            path: data.url,
            name: data.name,
            s3Key: data.key,
            type: type,
            description: description,
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

  const { mutate: deleteResource, isPending: isPendingDeleteResource } =
    useMutation({
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

  const { mutate: createChunks, isPending: isPendingCreateChunks } =
    useMutation({
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

  const { mutate: syncResource, isPending: isPendingSyncResource } =
    useMutation({
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

  const { data: resourceDetail } = useQuery({
    queryKey: ["resource", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/resources/${id}`);
      return response.data as Resource;
    },
    refetchOnWindowFocus: false,
    enabled: !!id,
  });

  const { mutate: reEtl } = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.patch(`/api/resources/re-etl/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Re-ETL thành công",
        description: "Re-ETL tài liệu thành công",
      });
      refetchResource();
    },
    onError: () => {
      toast({
        title: "Re-ETL thất bại",
        description: "Re-ETL tài liệu thất bại",
      });
    },
  });
  return {
    deleteResource,
    createResource,
    createChunks,
    syncResource,
    isPendingFetchingItem,
    isPendingCreateResource,
    isPendingDeleteResource,
    isPendingCreateChunks,
    isPendingSyncResource,
    materialItems,
    resourceDetail,
    handleUploadFile,
    refetchMaterialItems: refetchResource,
    reEtl,
  };
};

export default useResource;
