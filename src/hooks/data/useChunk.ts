import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";

interface Chunk {
  id: string;
  text: string;
}

interface UseChunkProps {
  id: string;
  type: string | null;
}

const fetchChunks = async (id: string, type: string | null) => {
  const response = await axiosInstance.get(`/api/chunks/${id}`, {
    params: { type },
  });
  console.log(response);
  return response || [];
};

const updateChunk = async (chunk: Chunk) => {
  const response = await axiosInstance.put(`/api/chunks/${chunk.id}`, chunk);
  return response.data;
};

const deleteChunk = async (id: string) => {
  const response = await axiosInstance.delete(`/api/chunks/${id}`);
  return response.data;
};

const useChunk = ({ id, type }: UseChunkProps) => {
  const {
    data: chunks,
    isLoading: isFetchingChunk,
    refetch,
  } = useQuery({
    queryKey: ["chunks", id, type],
    queryFn: () => fetchChunks(id, type),
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
