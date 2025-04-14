import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export type Message = {
  id: number;
  content: string;
  createdAt: string;
  senderType: string;
  isBot: boolean;
};

const useChat = () => {
  const [input, setInput] = useState("");

  const {
    data: fetchedMessages,
    isFetching: isLoading,
    refetch: reload,
    error: fetchMessagesError,
  } = useQuery({
    queryKey: ["load_messages"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/conversation/messages`);
      return response.data ?? ([] as Message[]);
    },
  });

  const {
    mutate: sendMessage,
    isPending: isSendingMessage,
    error: sendMessageError,
  } = useMutation({
    mutationFn: async (content: string) => {
      const response = await axiosInstance.post("/api/chat", { content });
      return response.data;
    },
    onSuccess: () => {
      reload();
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  return {
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isLoading || isSendingMessage,
    reload,
    fetchMessagesError,
    fetchedMessages,
    sendMessageError,
  };
};

export { useChat };
