import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
export type Message = {
  id: number;
  content: string;
  createAt: string;
  isBot: boolean;
};
const useChat = () => {
  const { data: messsages, refetch: fetchMessages } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/chat");
      return (response.data as Message[]) ?? [];
    },
  });
  const { mutate: sendMessage } = useMutation({
    mutationFn: async (data: Message) => {
      const response = await axiosInstance.post("/api/chat/send", data);
      return response;
    },
    onSuccess: () => {
      fetchMessages();
    },
    onError: (error) => {
    },
  });
  return { sendMessage, messsages };
};

export { useChat };
