import { axiosInstance } from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../use-toast";

export interface Chunk {
  id: string;
  original_content: string;
  createdAt?: string;
  isPublic?: boolean;
  updatedAt?: string;
  code?: string;
  isActive: boolean;
  resourceId: string;
}

interface UseChunkProps {
  id?: string;
  code?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

interface ChunkResponse {
  success: boolean;
  data: {
    data: Chunk[];
    total: number;
    page: number;
    page_size: number;
  };
  status: number;
}

interface SingleChunkResponse {
  success: boolean;
  data: Chunk;
  status: number;
}

const createChunk = async (chunk: Chunk) => {
  const response = await axiosInstance.post(`/api/agent-service/chunks`, chunk);
  return response.data;
};

const updateChunk = async (chunk: Chunk) => {
  const response = await axiosInstance.put(
    `/api/agent-service/chunks/${chunk.id}`,
    chunk
  );
  return response.data;
};

const deleteChunk = async (id: string) => {
  const response = await axiosInstance.delete(
    `/api/agent-service/chunks/${id}`
  );
  return response.data;
};

const deleteChunksByCode = async (code: string) => {
  const response = await axiosInstance.delete(
    `/api/agent-service/chunks/by-code/${code}`
  );
  return response.data;
};

const useChunk = ({
  id,
  code,
  search,
  page = 1,
  pageSize = 10,
}: UseChunkProps) => {
  const { toast } = useToast();

  // Get all chunks with pagination and filtering
  const { 
    data: chunksResponse,
    isLoading: isFetchingChunks,
    refetch: refetchChunks,
  } = useQuery({
    queryKey: ["chunks", { search, page, pageSize, code }],
    queryFn: async () => {
      const params: Record<string, any> = { page, page_size: pageSize };
      if (search) params.search = search;
      if (code) params.code = code;

      const res = await axiosInstance.get(`/api/agent-service/chunks`, {
        params,
      });
      return res.data;
    },
    enabled: !id, // Only fetch all chunks when not fetching specific chunk
  });

  // Get chunks by specific code
  const {
    data: chunksByCodeResponse,
    isLoading: isFetchingChunksByCode,
    refetch: refetchChunksByCode,
  } = useQuery({
    queryKey: ["chunks-by-code", code, page, pageSize],
    queryFn: async (): Promise<ChunkResponse> => {
      const res = await axiosInstance.get(
        `/api/agent-service/chunks/by-code/${code}`,
        {
          params: { page, page_size: pageSize },
        }
      );
      return res.data;
    },
    enabled: !!code && !id, // Only fetch when code is provided and not fetching specific chunk
  });

  // Get single chunk by ID
  const {
    data: singleChunkResponse,
    isLoading: isFetchingSingleChunk,
    refetch: refetchSingleChunk,
  } = useQuery({
    queryKey: ["chunk", id],
    queryFn: async (): Promise<SingleChunkResponse> => {
      const res = await axiosInstance.get(`/api/agent-service/chunks/${id}`);
      return res.data;
    },
    enabled: !!id, // Only fetch when ID is provided
  });

  // Create chunk mutation
  const { mutate: createChunkMutation } = useMutation({
    mutationFn: (chunk: Chunk) => createChunk(chunk),
    onSuccess: () => {
      toast({
        title: "Tạo thành công",
        description: "Đã tạo đoạn văn bản",
        variant: "default",
      });
      refetchChunks();
      refetchChunksByCode();
    },
    onError: () => {
      toast({
        title: "Tạo không thành công",
        description: "Có lỗi xảy ra trong quá trình tạo",
        variant: "destructive",
      });
    },
  });

  // Update chunk mutation
  const { mutate: updateChunkMutation } = useMutation({
    mutationFn: (chunk: Chunk) => updateChunk(chunk),
    onSuccess: () => {
      toast({
        title: "Cập nhật thành công",
        description: "Đã cập nhật đoạn văn bản",
        variant: "default",
      });
      refetchChunks();
      refetchChunksByCode();
      refetchSingleChunk();
    },
    onError: () => {
      toast({
        title: "Cập nhật không thành công",
        description: "Có lỗi xảy ra trong quá trình cập nhật",
        variant: "destructive",
      });
    },
  });

  // Delete single chunk mutation
  const { mutate: deleteChunkMutation } = useMutation({
    mutationFn: (id: string) => deleteChunk(id),
    onSuccess: () => {
      toast({
        title: "Xóa thành công",
        description: "Đã xóa đoạn văn bản",
        variant: "default",
      });
      refetchChunks();
      refetchChunksByCode();
    },
    onError: () => {
      toast({
        title: "Xóa không thành công",
        description: "Có lỗi xảy ra trong quá trình xóa",
        variant: "destructive",
      });
    },
  });

  // Delete chunks by code mutation
  const { mutate: deleteChunksByCodeMutation } = useMutation({
    mutationFn: (code: string) => deleteChunksByCode(code),
    onSuccess: () => {
      toast({
        title: "Xóa thành công",
        description: "Đã xóa tất cả đoạn văn bản theo mã",
        variant: "default",
      });
      refetchChunks();
      refetchChunksByCode();
    },
    onError: () => {
      toast({
        title: "Xóa không thành công",
        description: "Có lỗi xảy ra trong quá trình xóa",
        variant: "destructive",
      });
    },
  });

  // Extract data from responses
  const chunks = chunksResponse || [];
  const chunksByCode = chunksByCodeResponse?.data?.data || [];
  const singleChunk = singleChunkResponse?.data;
  const pagination = chunksResponse?.data || chunksByCodeResponse?.data;

  return {
    // Data
    chunks,
    chunksByCode,
    chunk: singleChunk,
    pagination,

    // Loading states
    isLoading:
      isFetchingChunks || isFetchingSingleChunk || isFetchingChunksByCode,
    isFetchingChunks,
    isFetchingSingleChunk,
    isFetchingChunksByCode,

    // Actions
    createChunk: createChunkMutation,
    updateChunk: updateChunkMutation,
    deleteChunk: deleteChunkMutation,
    deleteChunksByCode: deleteChunksByCodeMutation,

    // Refetch functions
    refetchChunks,
    refetchChunksByCode,
    refetchSingleChunk,
  };
};

export default useChunk;
