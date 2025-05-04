import axiosInstance from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
export type Message = {
  id: number;
  content: string;
  createdAt: string;
  senderType: string;
  isBot: boolean;
};

type Conversation = {
  name: string;
  id?: string;
  content: string;
  createdAt?: string;
  type: "direct";
};

const useChat = ({ id }: { id?: string }) => {
  const [input, setInput] = useState("");
  const router = useRouter();

  const {
    data: fetchedMessages,
    isFetching: isLoading,
    refetch: reload,
    error: fetchMessagesError,
  } = useQuery({
    queryKey: ["load_messages", id],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/api/conversations/${id}`);
      return (response.data.messages as Message[]) ?? ([] as Message[]);
      } catch (error) {
        router.push("/dashboard/bot");
        throw new Error("Failed to fetch messages");
      }
    },
    enabled: !!id,
  });

  const {
    mutate: sendMessage,
    isPending: isSendingMessage,
    error: sendMessageError,
  } = useMutation({
    mutationFn: async ({
      content,
      conversation_id,
    }: {
      content: string;
      conversation_id: number;
    }) => {
      const response = await axiosInstance.post("/api/chat", {
        content,
        conversation_id,
      });
      return response.data;
    },
    onError: (error) => {
      console.error("Error sending message:", error);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    conversation_id: number
  ) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ content: input, conversation_id: conversation_id });
      setInput("");
    }
  };

  const {
    data: conversations,
    isLoading: isFetchingConversation,
    refetch: fetchConversations,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/conversations`);
      return (res.data as Conversation[]) || [];
    },
    enabled: !id,
  });

  const { data: conversation } = useQuery({
    queryKey: ["conversation", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/conversations/${id}`);
      return res.data || [];
    },
    enabled: !!id,
  });

  const { mutate: createConversation } = useMutation({
    mutationFn: async (data: Conversation) => {
      const res = await axiosInstance.post(`/api/conversations`, data);
      return res.data as Conversation;
    },
    onSuccess: (data: Conversation) => {
      router.push(`/dashboard/bot/${data.id}`);
      sendMessage({
        content: data.content,
        conversation_id: Number(data.id as string),
      });
      fetchConversations();
    },
    onError: (error) => {},
  });

  return {
    createConversation,
    conversations,
    conversation,
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
