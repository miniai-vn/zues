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
  return {
    sendMessage,
    paginatedMessage,
    isLoadingMessages,
    contextedMessage,
    setSelectedMessageId,
  };
};
