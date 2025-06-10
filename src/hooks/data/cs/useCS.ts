"use client";
import { axiosInstance } from "@/configs";
import { ApiResponse } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { useToast } from "../../use-toast";
import { User } from "../useAuth";
import { useCsStore } from "./useCsStore";
import { Tag } from "./useTags";

export enum ConversationType {
  DIRECT = "direct",
  GROUP = "group",
}

export type Message = {
  id?: number;
  content: string;
  conversationId?: number;
  createdAt: string;
  senderId: string;
  senderType: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
};
export type MemberSettings = {
  notifications_enabled: boolean;
  role: string;
  isMuted: boolean;
};
export type Participant = {
  id: number;
  conversationId: number;
  memberType: "customer" | "user";
  customerId?: string;
  userId?: string;
  leftAt?: string;
  memberSettings: MemberSettings;
  createdAt: string;
  systemId: string;
  updatedAt: string;
  name?: string; // For customer, this is the customer's name
  avatar?: string; // For customer, this is the customer's avatar
  user?: User;
  role?: string; // Keep this for backward compatibility
};

export type Conversation = {
  id: number;
  name: string;
  channelId?: number;
  avatar: string;
  channelType?: string;
  isGroup?: boolean;
  unreadCount?: number;
  lastestMessage?: string;
  unreadMessagesCount: number;
  participants?: Participant[];
  members?: Participant[];
  senderId?: string;
  messages?: Message[];
  tags?: Tag[];
  createdAt?: string;
  updatedAt?: string;
};

export interface ConversationQueryParams {
  type?: "all" | "unread" | "read";
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
}

export type CreateConversationDto = {
  name: string;
  type: string;
  channelId?: number;
  channelType?: string;
  participantUserIds?: string[];
};

export type UpdateConversationDto = {
  name?: string;
  type?: string;
};

export type AddParticipantsDto = {
  participantUserIds: string[];
};

export type PaginatedConversations = {
  conversations: Conversation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const useCS = ({
  id,
  conversationId,
  initialFilters = {},
}: {
  id?: number;
  conversationId?: number;
  initialFilters?: Partial<ConversationQueryParams>;
} = {}) => {
  const router = useRouter();
  const { toast } = useToast();

  // Store actions and state
  const {
    conversations,
    setConversations,
    setLoadingConversations,
    isLoadingConversations,
    conversationFilters,
    setConversationFilters,
    resetConversationFilters,
    messages,
    setMessages,
    setLoadingMessages,
    isLoadingMessages,
    channelsUnreadCount,
    setChannelsUnreadCount,
    addMessage,
    markConversationAsRead,
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
    const params: any = {};

    if (conversationFilters.search) {
      params.search = conversationFilters.search;
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

    if (conversationFilters.dateRange?.from) {
      params.timeFrom = conversationFilters.dateRange.from.toISOString();
    }

    if (conversationFilters.dateRange?.to) {
      params.timeTo = conversationFilters.dateRange.to.toISOString();
    }

    return params;
  }, [conversationFilters]);

  // Get conversations with filters
  const {
    data: conversationsData,
    isFetching: isFetchingConversations,
    refetch: refetchConversations,
    error: queryError,
  } = useQuery({
    queryKey: ["conversation-query", conversationFilters],
    queryFn: async () => {
      setLoadingConversations(true);
      try {
        const response = await axiosInstance.get("/api/conversations", {
          params: apiFilters(),
        });
        const data = (response?.data || []) as Conversation[];
        setConversations(data);
        return data;
      } catch (error) {
        throw new Error("Failed to fetch conversations");
      } finally {
        setLoadingConversations(false);
      }
    },
    enabled: !id,
    refetchOnMount: true,
  });

  // Get messages for a specific conversation
  const {
    data: messagesData,
    isFetching: isFetchingMessages,
    refetch: refetchMessages,
    error: fetchMessagesError,
  } = useQuery({
    queryKey: ["conversation-messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return null;

      setLoadingMessages(true);
      try {
        const response = await axiosInstance.get(
          `/api/conversations/${conversationId}/messages`
        );
        const data = response.data;
        if (data?.messages) {
          setMessages(conversationId, data.messages);
        }
        return data;
      } catch (error) {
        throw new Error("Failed to fetch messages");
      } finally {
        setLoadingMessages(false);
      }
    },
    retry: false,
    enabled: !!conversationId,
  });

  // Get channels with unread messages
  const {
    data: channelsWithUnreadMessage,
    refetch: refetchChannelsWithUnreadMessages,
  } = useQuery({
    queryKey: ["channels", "unread"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/channels/unread-count`);
      const data = res.data as {
        type: string;
        totalUnreadMessages: number;
      }[];
      setChannelsUnreadCount(data);
      return data;
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Create new conversation
  const {
    mutate: createConversation,
    isPending: isCreatingConversation,
    error: createConversationError,
  } = useMutation({
    mutationFn: async (data: CreateConversationDto) => {
      const response = await axiosInstance.post<ApiResponse<Conversation>>(
        "/api/conversations",
        data
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Tạo cuộc trò chuyện thành công",
        description: `Cuộc trò chuyện "${data.name}" đã được tạo`,
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("Error creating conversation:", error);
      toast({
        title: "Tạo cuộc trò chuyện thất bại",
        description: "Không thể tạo cuộc trò chuyện mới",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  // Update conversation
  const {
    mutate: updateConversation,
    isPending: isUpdatingConversation,
    error: updateConversationError,
  } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateConversationDto;
    }) => {
      const response = await axiosInstance.put<ApiResponse<Conversation>>(
        `/api/conversations/${id}`,
        data
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Cập nhật thành công",
        description: `Cuộc trò chuyện "${data.name}" đã được cập nhật`,
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("Error updating conversation:", error);
      toast({
        title: "Cập nhật thất bại",
        description: "Không thể cập nhật cuộc trò chuyện",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  // Delete conversation
  const {
    mutate: deleteConversation,
    isPending: isDeletingConversation,
    error: deleteConversationError,
  } = useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete<ApiResponse<{ id: number }>>(
        `/api/conversations/${id}`
      );
      return response.data.data;
    },
    onSuccess: () => {
      toast({
        title: "Xóa cuộc trò chuyện thành công",
        description: "Cuộc trò chuyện đã được xóa",
        duration: 3000,
      });
      router.push("/chat");
    },
    onError: (error) => {
      console.error("Error deleting conversation:", error);
      toast({
        title: "Xóa cuộc trò chuyện thất bại",
        description: "Không thể xóa cuộc trò chuyện",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  // Add participants to conversation
  const {
    mutate: addParticipants,
    isPending: isAddingParticipants,
    error: addParticipantsError,
  } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: AddParticipantsDto;
    }) => {
      const response = await axiosInstance.post<ApiResponse<Conversation>>(
        `/api/conversations/${id}/participants`,
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      toast({
        title: "Thêm thành viên thành công",
        description: "Đã thêm thành viên vào cuộc trò chuyện",
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("Error adding participants:", error);
      toast({
        title: "Thêm thành viên thất bại",
        description: "Không thể thêm thành viên vào cuộc trò chuyện",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const { mutateAsync: markReadConversation } = useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.put<ApiResponse<Conversation>>(
        `/api/conversations/${id}/mark-read`
      );
      return response.data;
    },
    onSuccess: (_, conversationId) => {
      markConversationAsRead(conversationId);
      refetchMessages();
      refetchChannelsWithUnreadMessages();
      refetchConversations();
    },
    onError: (error) => {
      console.error("Error marking conversation as read:", error);
      toast({
        title: "Đánh dấu đã đọc thất bại",
        description: "Không thể đánh dấu cuộc trò chuyện là đã đọc",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  // Helper to get messages for current conversation
  const currentMessages = conversationId
    ? getMessagesByConversationId(conversationId)
    : [];

  return {
    // Data from store
    conversations,
    channelsWithUnreadMessage: channelsUnreadCount,
    fullInfoConversationWithMessages: messagesData,
    currentMessages,

    // Loading states
    isLoadingMessages: isLoadingMessages || isFetchingMessages,
    isLoadingConversations: isLoadingConversations || isFetchingConversations,
    // ...other loading states...

    // Errors
    fetchMessagesError,
    // ...other errors...

    // Actions
    markReadConversation,
    refetchMessages,
    refetchConversations,
    // ...other mutations...

    // Filters
    filters: conversationFilters,
    updateFilters,
    resetFilters,

    // Store actions
    addMessageToStore: addMessage,
    setSelectedConversation: setSelectedConversationId,
    selectedConversationId,
  };
};

export { useCS };
