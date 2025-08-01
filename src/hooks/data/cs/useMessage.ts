import { axiosInstance } from "@/configs";
import { PaginatedResponse } from "@/types/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCsStore } from "./useCsStore";
export type Message = {
  id?: string;
  content: string;
  conversationId?: string;
  createdAt: string;
  senderId: string;
  senderType: string;
  channelId?: number;
  messageType: string;
  links?: string[];
  url?: string;
  thumb?: string;
  contentType?: string;
  readBy?: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
};
export const useMessage = ({
  queryParams,
  onSuccess,
}: {
  onSuccess?: (message?: string) => void;
  queryParams?: {
    senderId?: string;
    dateRange?: string;
    conversationId?: string;
    page?: number;
    limit?: number;
    search?: string;
  };
}) => {
  const {
    selectedMessageId,
    setSelectedMessageId,
    setMessages,
    selectedConversationId,
  } = useCsStore();
  const { data: contextedMessage } = useQuery({
    queryKey: ["message", selectedMessageId],
    queryFn: async () => {
      if (!selectedMessageId) return null;
      const response = await axiosInstance.get(`/api/messages/context`, {
        params: {
          messageId: selectedMessageId,
          conversationId: queryParams?.conversationId,
        },
      });
      setMessages(selectedConversationId as string, response.data);
      return response.data as Message;
    },
    enabled: !!selectedMessageId,
    refetchOnWindowFocus: false,
  });

  const { data: paginatedMessage, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["messages", queryParams],
    queryFn: async () => {
      const response: PaginatedResponse<Message> = await axiosInstance.get(
        `/api/messages/query`,
        { params: queryParams }
      );

      return response;
    },
    enabled: !!queryParams?.search && !!queryParams?.conversationId,
    refetchOnWindowFocus: false,
  });

  const { mutate: sendMessage } = useMutation({
    mutationFn: async (message: Message & { quotedMsgId?: string }) => {
      const response = await axiosInstance.post(`/api/chat/sms`, message);
      return response.data;
    },
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data.content);
      }
    },
  });

  const { mutate: sendAttechment } = useMutation({
    mutationFn: async (data: { file: File; conversationId: string }) => {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("conversationId", data.conversationId);
      const response = await axiosInstance.post(
        `/api/chat/attachment`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data.content);
      }
    },
  });

  const { mutate: sendMessageImages } = useMutation({
    mutationFn: async (data: {
      files: File[];
      conversationId: string;
      content: string;
    }) => {
      const formData = new FormData();
      data.files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("conversationId", data.conversationId);
      formData.append("content", data.content);
      const response = await axiosInstance.post(`/api/chat/images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data.content);
      }
    },
  });

  const { mutate: handleForwardMessage } = useMutation({
    mutationFn: async (data: {
      customerIds: string[];
      messageId: string;
      conversationId: string;
    }) => {
      const response = await axiosInstance.post(`/api/chat/forward`, data);
      return response.data;
    },
  });

  return {
    sendMessageImages,
    sendAttechment,
    sendMessage,
    paginatedMessage,
    handleForwardMessage,
    isLoadingMessages,
    contextedMessage,
    setSelectedMessageId,
  };
};
