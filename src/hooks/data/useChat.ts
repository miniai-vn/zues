"use client";
import { chatApiInstance } from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "../use-toast";
export type Message = {
  id?: number;
  content: string;
  createdAt?: string;
  senderType: string;
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
  const { toast } = useToast();
  const {
    data: fetchedMessages,
    isFetching: isLoading,
    refetch: reload,
    error: fetchMessagesError,
  } = useQuery({
    queryKey: ["load_messages", id],
    queryFn: async () => {
      return [];
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
      department_id,
    }: {
      content: string;
      conversation_id: number;
      department_id: string[];
    }) => {
      const response = await chatApiInstance.post("/api/chat", {
        content,
        conversation_id,
        department_id,
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
    conversation_id: number,
    department_id: string[]
  ) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({
        content: input,
        conversation_id: conversation_id,
        department_id: department_id,
      });
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
      return [];
    },
    enabled: !id,
  });

  const { data: conversation } = useQuery({
    queryKey: ["conversation", id],
    queryFn: async () => {
      const res = await chatApiInstance.get(`/api/conversations/${id}`);
      return res.data || [];
    },
    enabled: !!id,
  });

  const { mutateAsync: createConversation } = useMutation({
    mutationFn: async (data: Conversation) => {
      const res = await chatApiInstance.post(`/api/conversations`, data);
      return res.data;
    },
    onSuccess: (data: Conversation) => {
      fetchConversations();
    },
    onError: (error) => {},
  });

  const { mutate: deleteConversation } = useMutation({
    mutationFn: async (id: string) => {
      const res = await chatApiInstance.delete(`/api/conversations/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Xóa phòng thành công",
        description: "Phòng đã được xóa thành công",
        duration: 2000,
      });
      fetchConversations();
    },
    onError: (error) => {
      toast({
        title: "Xóa phòng thất bại",
        description: "Phòng không thể xóa",
        duration: 2000,
      });
    },
  });

  const { mutate: renameConversation } = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const res = await chatApiInstance.patch(
        `/api/conversations/rename/${id}`,
        {
          name,
        }
      );
      return res.data;
    },
    onSuccess: (data: Conversation) => {
      toast({
        title: "Đổi tên phòng thành công",
        description: "Phòng đã được đổi tên thành công",
        duration: 2000,
      });
      fetchConversations();
    },
    onError: (error) => {
      toast({
        title: "Đổi tên phòng thất bại",
        description: "Phòng không thể đổi tên",
        duration: 2000,
      });
    },
  });

  return {
    createConversation,
    renameConversation,
    deleteConversation,
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
    sendMessage,
  };
};

export { useChat };
