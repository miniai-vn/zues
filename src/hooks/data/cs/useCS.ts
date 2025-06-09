"use client";
import { axiosInstance } from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useToast } from "../../use-toast";
import { ApiResponse } from "@/utils";
import { Tag } from "./useTags";
import { Customer } from "../useCustomers";
import { User } from "../useAuth";
import { DateRange } from "react-day-picker";

export enum ConversationType {
  DIRECT = "direct",
  GROUP = "group",
}

export type Message = {
  id?: number;
  content: string;
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
  participantIds?: string[];
  tagId?: number;
  phoneFilter?: string;
  dateRange?: DateRange;
}

export type CreateConversationDto = {
  name: string;
  type: string;
  channelId?: number;
  channelType?: string;
  participantIds?: string[];
};

export type UpdateConversationDto = {
  name?: string;
  type?: string;
};

export type AddParticipantsDto = {
  participantIds: string[];
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

  // Initialize filters with defaults
  const [filters, setFilters] = useState<ConversationQueryParams>({
    type: "all",
    search: "",
    channelType: "",
    participantIds: [],
    tagId: undefined,
    phoneFilter: "all",
    dateRange: undefined,
    ...initialFilters,
  });

  const updateFilters = useCallback(
    (newFilters: Partial<ConversationQueryParams>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters({
      type: "all",
      search: "",
      channelType: "",
      participantIds: [],
      tagId: undefined,
      phoneFilter: "all",
      dateRange: undefined,
    });
  }, []);

  // Transform filters for API call
  const apiFilters = useCallback(() => {
    const params: any = {};

    // if (filters.type && filters.type !== "all") {
    //   params.type = filters.type;
    // }

    if (filters.search) {
      params.search = filters.search;
    }

    if (filters.channelType) {
      params.channelType = filters.channelType;
    }

    if (filters.participantIds && filters.participantIds.length > 0) {
      params.participantIds = filters.participantIds.join(",");
    }

    if (filters.tagId) {
      params.tagId = filters.tagId;
    }

    if (filters.phoneFilter && filters.phoneFilter !== "all") {
      params.phoneFilter = filters.phoneFilter === "has-phone";
    }

    if (filters.dateRange?.from) {
      params.timeFrom = filters.dateRange.from.toISOString();
    }

    if (filters.dateRange?.to) {
      params.timeTo = filters.dateRange.to.toISOString();
    }

    return params;
  }, [filters]);

  // Get conversations with filters
  const {
    data: conversations,
    isFetching: isLoadingConversations,
    refetch: refetchConversations,
    error: queryError,
  } = useQuery({
    queryKey: ["conversation-query", filters],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/api/conversations", {
          params: apiFilters(),
        });
        console.log("Conversations response:", response);
        return (response?.data || []) as Conversation[];
      } catch (error) {
        throw new Error("Failed to fetch conversations");
      }
    },
    enabled: !id,
    refetchOnMount: true,
    // retry: false,
  });

  // Get messages for a specific conversation
  const {
    data: messagesData,
    isFetching: isLoadingMessages,
    refetch: refetchMessages,
    error: fetchMessagesError,
  } = useQuery({
    queryKey: ["conversation-messages", conversationId],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(
          `/api/conversations/${conversationId}/messages`
        );
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch messages");
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
      return res.data as {
        type: string;
        totalUnreadMessages: number;
      }[];
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
    onSuccess: () => {
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

  return {
    // Data
    channelsWithUnreadMessage,
    fullInfoConversationWithMessages: messagesData,
    conversations,

    // Loading states
    isLoadingMessages,
    isCreatingConversation,
    isUpdatingConversation,
    isDeletingConversation,
    isLoadingConversations,
    isAddingParticipants,

    // Errors
    fetchMessagesError,
    createConversationError,
    updateConversationError,
    deleteConversationError,
    addParticipantsError,
    queryError,

    // Actions
    markReadConversation,
    refetchMessages,
    createConversation,
    updateConversation,
    deleteConversation,
    addParticipants,
    refetchConversations,

    // Filters
    filters,
    updateFilters,
    resetFilters,
  };
};

export { useCS };
