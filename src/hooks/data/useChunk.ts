import { axiosInstance } from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../use-toast";

export interface Chunk {
  id: string;
  text: string;
  createdAt?: string;
  isPublic?: boolean;
  updatedAt?: string;
  code?: string;
  isActive: boolean;
  resourceId: string;
}

interface UseChunkProps {
  id?: string;
  search?: string;
}

const updateChunk = async (chunk: Chunk) => {
  const response = await axiosInstance.put(`/api/chunks/${chunk.id}`, chunk);
  return response.data;
};

const deleteChunk = async (id: string) => {
  const response = await axiosInstance.delete(`/api/chunks/${id}`);
  return response.data;
};

const useChunk = ({ id, search }: UseChunkProps) => {
  const { toast } = useToast();
  const {
    data: chunks,
    isLoading: isFetchingChunk,
    refetch: refetchChunk,
  } = useQuery({
    queryKey: ["chunks", search],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/chunks/get-by-resource-id/${id}`,
        {
          params: { search },
        }
      );
      return res.data || [];
    },
    enabled: !!id,
  });

  const { mutate: updateMutation } = useMutation({
    mutationFn: (chunk: Chunk) => updateChunk(chunk),
    onSuccess: () => {
      toast({
        title: "Cập nhật thành công",
        description: "Đã cập nhật đoạn văn bản",
        variant: "default",
      });
      refetchChunk();
    },
    onError: () => {
      refetchChunk();
      toast({
        title: "Cập nhật không thành công",
        description: "Có lỗi xảy ra trong quá trình cập nhật",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteChunk(id),
    onSuccess: () => {
      toast({
        title: "Xóa thành công",
        description: "Đã xóa đoạn văn bản",
        variant: "default",
      });
      refetchChunk();
    },
    onError: () => {
      toast({
        title: "Xóa không thành công",
        description: "Có lỗi xảy ra trong quá trình xóa",
        variant: "destructive",
      });
      refetchChunk();
    },
  });

  const { mutate: createChunk } = useMutation({
    mutationFn: async (chunk: Chunk) => {
      await axiosInstance.post(`/api/chunks`, chunk);
    },
    onSuccess: () => {
      refetchChunk();
      toast({
        title: "Tạo thành công",
        description: "Đã tạo đoạn văn bản",
        variant: "default",
      });
    },
    onError: () => {
      refetchChunk();
      toast({
        title: "Tạo không thành công",
        description: "Có lỗi xảy ra trong quá trình tạo",
        variant: "destructive",
      });
    },
  });

  return {
    chunks,
    isFetchingChunk,
    createChunk,
    refetchChunk,
    updateChunk: updateMutation,
    deleteChunk: deleteMutation.mutate,
  };
};

export default useChunk;
