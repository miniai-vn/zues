import { axiosInstance } from "@/configs";
import { PaginatedResponse } from "@/types/api";
import { Message } from "./useCS";
import { useQuery } from "@tanstack/react-query";
import { useCsStore } from "./useCsStore";

export const useMessage = ({
  queryParams,
}: {
  queryParams: {
    conversationId: number;
    page?: number;
    limit?: number;
    search?: string;
  };
}) => {
  const {
    selectedMessageId,
    setSelectedMessageId,
    setMessages,
    getMessagesByConversationId,
    selectedConversationId,
  } = useCsStore();
  const { data: contextedMessage } = useQuery({
    queryKey: ["message", selectedMessageId],
    queryFn: async () => {
      if (!selectedMessageId) return null;
      const response = await axiosInstance.get(`/api/messages/context`, {
        params: {
          messageId: selectedMessageId,
          conversationId: queryParams.conversationId,
        },
      });
      const currentMessages = getMessagesByConversationId(
        selectedConversationId as number
      );
      const allMessages = currentMessages.concat(response.data);
      const uniqueMessage = new Set();
      debugger
      const filteredMessages = allMessages.filter((item) => {
        if (uniqueMessage.has(item.id)) {
          return false;
        }
        uniqueMessage.add(item.id);
        return true;
      });
      setMessages(selectedConversationId as number, filteredMessages);
      return response.data as Message;
    },
    enabled: !!selectedMessageId,
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
  });
  return {
    paginatedMessage,
    isLoadingMessages,
    contextedMessage,
    setSelectedMessageId,
  };
};
