"use client";
import { axiosInstance } from "@/configs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useToast } from "../../use-toast";
import { ApiResponse } from "@/utils";
import { Tag } from "./useTags";

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

export type Participant = {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
};

export type Conversation = {
  id: number;
  name: string;
  type: ConversationType;
  channelId?: number;
  avatar: string;
  channelType?: string;
  isGroup?: boolean;
  unreadCount?: number;
  lastestMessage?: string;
  unreadMessagesCount: number;
  participants?: Participant[];
  tags?: Tag[];
  createdAt?: string;
  updatedAt?: string;
};

export interface ConversationQueryParams {
  type?: string;
  name?: string;
  channelId?: number;
  userId?: string;
  search?: string;
  channelType?: string;
  shopId?: string;
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
}: { id?: number; conversationId?: number } = {}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [filters, setFilters] = useState<ConversationQueryParams>({});

  const updateFilters = useCallback(
    (newFilters: Partial<ConversationQueryParams>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Get messages for a specific conversation
  const {
    data: messagesData,
    isFetching: isLoadingMessages,
    refetch: refetchMessages,
    error: fetchMessagesError,
  } = useQuery({
    queryKey: ["conversation-messages", id],
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
    enabled: !!conversationId,
  });

  // Create new conversation
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
          params: {
            ...filters,
          },
        });
        return response.data || [];
      } catch (error) {
        throw new Error("Failed to fetch conversations");
      }
    },
    refetchOnWindowFocus: false,
  });

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
  const {
    data: channelsWithUnreadMessage,
    refetch: refetchChannelsWithUnreadMessages,
  } = useQuery({
    queryKey: ["channels", "unead"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/channels/unread-count`);
      return res.data as {
        type: string;
        totalUnreadMessages: number;
      }[];
    },
    refetchOnWindowFocus: false,
  });

  return {
    channelsWithUnreadMessage,
    fullInfoConversationWithMessages: messagesData,
    conversations,
    isLoadingMessages,
    isCreatingConversation,
    isUpdatingConversation,
    isDeletingConversation,
    isLoadingConversations,
    markReadConversation,
    isAddingParticipants,
    fetchMessagesError,
    createConversationError,
    updateConversationError,
    deleteConversationError,
    addParticipantsError,
    queryError,
    refetchMessages,
    createConversation,
    updateConversation,
    deleteConversation,
    addParticipants,
    refetchConversations,
    filters,
    updateFilters,
    resetFilters,
  };
};

export { useCS };
