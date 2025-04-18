import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";

export interface Chunk {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  resourceId: string;
}

interface UseChunkProps {
  id: string;
  type?: string | null;
}

const updateChunk = async (chunk: Chunk) => {
  const response = await axiosInstance.put(`/api/chunks/${chunk.id}`, chunk);
  return response.data;
};

const deleteChunk = async (id: string) => {
  const response = await axiosInstance.delete(`/api/chunks/${id}`);
  return response.data;
};

const useChunk = ({ id }: UseChunkProps) => {
  const {
    data: chunks,
    isLoading: isFetchingChunk,
    refetch,
  } = useQuery({
    queryKey: ["chunks", id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/chunks/get-by-resource-id/${id}`
      );
      return res.data || [];
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (chunk: Chunk) => updateChunk(chunk),
    onSuccess: () => {
      refetch();
    },
    onError: () => {
      refetch();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteChunk(id),
    onSuccess: () => {
      refetch();
    },
    onError: () => {
      refetch();
    },
  });

  return {
    chunks,
    isFetchingChunk,
    updateChunk: updateMutation.mutate,
    deleteChunk: deleteMutation.mutate,
  };
};

export default useChunk;
