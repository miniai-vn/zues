"use client";
import { axiosInstance } from "@/configs";
import { PaginatedResponse } from "@/types/api";
import { ApiResponse } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { Channel } from "../useChannels";
import { useCsStore } from "./useCsStore";
import { Message } from "./useMessage";
import { Participant } from "./useParticipants";
import { Tag } from "./useTags";

export enum ConversationType {
  DIRECT = "direct",
  GROUP = "group",
}

export type Conversation = {
  id: number;
  name: string;
  channelId?: number;
  isBot?: boolean;
  avatar: string;
  channelType?: string;
  isGroup?: boolean;
  unreadCount?: number;
  lastestMessage?: string;
  unreadMessagesCount: number;
  members?: Participant[];
  senderId?: string;
  content?: string;
  messages?: Message[];
  tags?: Tag[];
  channel: Channel;
  createdAt?: string;
  updatedAt?: string;
};

export interface ConversationQueryParams {
  name?: string;
  channelId?: number;
  userId?: string;
  search?: string;
  channelType?: string;
  shopId?: string;
  participantUserIds?: string[];
  tagId?: number;
  phoneFilter?: string;
  dateRange?: DateRange;
  readStatus?: "all" | "read" | "unread";
  page?: number;
  limit?: number;
}

export type CreateConversationDto = {
  name: string;
  type: string;
  channelId?: number;
  channelType?: string;
  participantUserIds?: string[];
};

const useCS = ({
  id,
  conversationId,
  initialFilters = {},
  queryParams = {
    page: 1,
    limit: 20,
  },
  queryMessageParams = {
    page: 1,
    limit: 20,
    nextBeforeMessageId: null,
    nextAfterMessageId: null,
  },
}: {
  id?: number;
  conversationId?: number;
  initialFilters?: Partial<ConversationQueryParams>;
  queryParams?: {
    page?: number;
    limit?: number;
  };
  queryMessageParams?: {
    page?: number;
    limit?: number;
    nextBeforeMessageId?: number | null;
    nextAfterMessageId?: number | null;
  };
} = {}) => {
  // Store actions and state
  const {
    conversations,
    setConversations,
    setLoadingConversations,
    isLoadingConversations,
    conversationFilters,
    setConversationFilters,
    resetConversationFilters,
    setMessages,
    setLoadingMessages,
    isLoadingMessages,
    channelsUnreadCount,
    setSelectedConversationId,
    selectedConversationId,
    getMessagesByConversationId,
  } = useCsStore();

  // Initialize filters on mount
  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      setConversationFilters(initialFilters);
    }
  }, [initialFilters, setConversationFilters]);

  const updateFilters = useCallback(
    (newFilters: Partial<ConversationQueryParams>) => {
      setConversationFilters(newFilters);
    },
    [setConversationFilters]
  );

  const resetFilters = useCallback(() => {
    resetConversationFilters();
  }, [resetConversationFilters]);

  // Transform filters for API call
  const apiFilters = useCallback(() => {
    const params: Record<string, any> = {};

    if (conversationFilters.search) {
      params.search = conversationFilters.search;
    }

    if (conversationFilters.readStatus) {
      params.readStatus = conversationFilters.readStatus;
    }

    if (
      conversationFilters.channelType &&
      conversationFilters.channelType !== "all"
    ) {
      params.channelType = conversationFilters.channelType;
    }

    if (
      conversationFilters.participantUserIds &&
      conversationFilters.participantUserIds.length > 0
    ) {
      params.participantUserIds = conversationFilters.participantUserIds;
    }

    if (conversationFilters.tagId) {
      params.tagId = conversationFilters.tagId;
    }

    if (
      conversationFilters.phoneFilter &&
      conversationFilters.phoneFilter !== "all"
    ) {
      params.phoneFilter = conversationFilters.phoneFilter === "has-phone";
    }

    if (conversationFilters.channelId) {
      params.channelId = conversationFilters.channelId;
    }
    if (conversationFilters.page) {
      params.page = conversationFilters.page;
    }

    if (conversationFilters.limit) {
      params.limit = conversationFilters.limit;
    }
    params.channelType = "zalo";
    return params;
  }, [conversationFilters]);

  // Get conversations with filters
  const {
    data: stateConversations,
    isFetching: isFetchingConversations,
    refetch: refetchConversations,
  } = useQuery({
    queryKey: ["conversation-query", conversationFilters, queryParams],
    queryFn: async () => {
      setLoadingConversations(true);
      try {
        const response: PaginatedResponse<Conversation> =
          await axiosInstance.get("/api/conversations", {
            params: {
              ...apiFilters(),
              ...queryParams,
            },
          });
        const data = response?.data;
        if (queryParams.page === 1) {
          setConversations(data);
          return {
            conversations: data,
            ...response,
          };
        }
        const newConversations = conversations.concat(data);
        const set = new Set();
        const uniqueConversations = newConversations.filter((item) => {
          if (set.has(item.id)) {
            return false;
          }
          set.add(item.id);
          return true;
        });
        setConversations(uniqueConversations);
        return {
          conversations: uniqueConversations,
          ...response,
        };
      } catch {
        throw new Error("Failed to fetch conversations");
      } finally {
        setLoadingConversations(false);
      }
    },
    refetchOnWindowFocus: false,
    enabled: !id,
  });

  const { mutate: sendMessage } = useMutation({
    mutationFn: async (message: Message) => {
      const response = await axiosInstance.post(`/api/chat/sms`, message);
      return response.data;
    },
  });

  // Get messages for a specific conversation
  const {
    data: messagesData,
    isFetching: isFetchingMessages,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["conversation-messages", conversationId, queryMessageParams],
    queryFn: async () => {
      if (!conversationId) return null;
      setLoadingMessages(true);
      try {
        const response = await axiosInstance.get(
          `/api/conversations/${conversationId}/messages`,
          {
            params: {
              ...queryMessageParams,
            },
          }
        );
        const data = response.data;
        if (data) {
          const currentMessages = getMessagesByConversationId(conversationId);
          const allMessages = currentMessages.concat(data.messages);
          const uniqueMessage = new Set();
          const filteredMessages = allMessages.filter((item) => {
            if (uniqueMessage.has(item.id)) {
              return false;
            }
            uniqueMessage.add(item.id);
            return true;
          });
          setMessages(conversationId, filteredMessages);
        }
        return data;
      } catch {
        throw new Error("Failed to fetch messages");
      } finally {
        setLoadingMessages(false);
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!conversationId,
  });

  const { mutateAsync: markReadConversation } = useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.put<ApiResponse<Conversation>>(
        `/api/conversations/${id}/mark-read`
      );
      return response.data;
    },
  });

  return {
    // Data from store
    channelsWithUnreadMessage: channelsUnreadCount,
    fullInfoConversationWithMessages: messagesData,
    stateConversations,

    // Loading states
    isLoadingMessages: isLoadingMessages || isFetchingMessages,
    isLoadingConversations: isLoadingConversations || isFetchingConversations,
    // ...other loading states...

    // Actions
    markReadConversation,
    refetchMessages,
    refetchConversations,
    // ...other mutations...

    // Filters
    filters: conversationFilters,
    updateFilters,
    resetFilters,

    setSelectedConversation: setSelectedConversationId,
    selectedConversationId,

    sendMessage,
  };
};

export { useCS };

