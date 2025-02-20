import axiosInstance from "@/configs";
import { useQuery } from "@tanstack/react-query";

export type Message = {
  id: number;
  content: string;
  createdAt: string; // Fixed typo: createAt -> createdAt
  isBot: boolean;
};

const useChat = () => {
  const sendMessage = async (data: string) => {
    const response = await axiosInstance.post("/api/chat", {
      content: data,
    });
    return response.data;
  };

  const {
    data: messages, // Fixed typo: mesages -> messages
    isFetching: isFetchingChunk,
    refetch: refetchFetchMessages,
  } = useQuery({
    queryKey: ["load_messages"],
    queryFn: async () => {
      const data = await axiosInstance.get(`/api/conversation/messages`);
      return data ?? [];
    },
  });

  return { sendMessage, messages, isFetchingChunk, refetchFetchMessages };
};

export { useChat };
