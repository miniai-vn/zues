"use client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Conversation, Message, ConversationQueryParams } from "./useCS";
import { Socket } from "socket.io-client";

interface ChannelUnreadCount {
  type: string;
  totalUnreadMessages: number;
}

interface CsStore {
  // channel state
  selectedChannelId?: string | null;
  setSelectedChannelId: (id: string | null) => void;
  // Conversations state
  conversations: Conversation[];
  selectedConversationId: number | null;
  selectedConversation: Conversation | null;
  isLoadingConversations: boolean;
  conversationFilters: ConversationQueryParams;
  socketChatIo: Socket | null;
  setSocketChatIo: (socket: Socket | null) => void;
  // Messages state
  messages: Record<number, Message[]>; // conversationId -> messages
  isLoadingMessages: boolean;

  // Platform unread counts
  channelsUnreadCount: ChannelUnreadCount[];
  totalUnreadCount: number;

  // Actions - Conversations
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: number, updates: Partial<Conversation>) => void;
  removeConversation: (id: number) => void;
  setSelectedConversationId: (id: number | null) => void;
  setLoadingConversations: (loading: boolean) => void;
  setConversationFilters: (filters: Partial<ConversationQueryParams>) => void;
  resetConversationFilters: () => void;

  // Actions - Messages
  setMessages: (conversationId: number, messages: Message[]) => void;
  addMessage: (conversationId: number, message: Message) => void;
  updateMessage: (
    conversationId: number,
    messageId: number,
    updates: Partial<Message>
  ) => void;
  removeMessage: (conversationId: number, messageId: number) => void;
  setLoadingMessages: (loading: boolean) => void;
  clearMessages: (conversationId: number) => void;

  // Actions - Unread counts
  setChannelsUnreadCount: (channels: ChannelUnreadCount[]) => void;
  updateChannelUnreadCount: (channelType: string, count: number) => void;
  incrementUnreadCount: (channelType: string, increment?: number) => void;
  decrementUnreadCount: (channelType: string, decrement?: number) => void;
  markConversationAsRead: (conversationId: number) => void;

  // Utility actions
  reset: () => void;
  getConversationById: (id: number) => Conversation | undefined;
  getMessagesByConversationId: (conversationId: number) => Message[];
  getTotalUnreadCount: () => number;
}

const defaultFilters: ConversationQueryParams = {
  search: "",
  channelType: "",
  participantUserIds: [],
  tagId: undefined,
  phoneFilter: "all",
  dateRange: undefined,
  readStatus: "all",
};

export const useCsStore = create<CsStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Channel state
        selectedChannelId: null,
        setSelectedChannelId: (id) => set({ selectedChannelId: id }),
        // Initial state
        conversations: [],
        selectedConversationId: null,
        selectedConversation: null,
        isLoadingConversations: false,
        conversationFilters: defaultFilters,

        messages: {},
        isLoadingMessages: false,

        channelsUnreadCount: [],
        totalUnreadCount: 0,
        socketChatIo: null,
        setSocketChatIo: (socket) => set({ socketChatIo: socket }),

        // Conversation actions
        setConversations: (conversations) =>
          set((state) => {
            const selectedConversation = state.selectedConversationId
              ? conversations.find(
                  (c) => c.id === state.selectedConversationId
                ) || null
              : null;

            return {
              conversations,
              selectedConversation,
            };
          }),

        addConversation: (conversation) =>
          set((state) => ({
            conversations: [conversation, ...state.conversations],
          })),

        updateConversation: (id, updates) =>
          set((state) => {
            const updatedConversations = state.conversations.map((conv) =>
              conv.id === id ? { ...conv, ...updates } : conv
            );

            const selectedConversation =
              state.selectedConversationId === id && state.selectedConversation
                ? { ...state.selectedConversation, ...updates }
                : state.selectedConversation;

            return {
              conversations: updatedConversations,
              selectedConversation,
            };
          }),

        removeConversation: (id) =>
          set((state) => ({
            conversations: state.conversations.filter((conv) => conv.id !== id),
            selectedConversationId:
              state.selectedConversationId === id
                ? null
                : state.selectedConversationId,
            selectedConversation:
              state.selectedConversationId === id
                ? null
                : state.selectedConversation,
            messages: Object.fromEntries(
              Object.entries(state.messages).filter(
                ([key]) => parseInt(key) !== id
              )
            ),
          })),

        setSelectedConversationId: (id) =>
          set((state) => {
            const selectedConversation = id
              ? state.conversations.find((c) => c.id === id) || null
              : null;

            return {
              selectedConversationId: id,
              selectedConversation,
            };
          }),

        setLoadingConversations: (loading) =>
          set({ isLoadingConversations: loading }),

        setConversationFilters: (filters) =>
          set((state) => ({
            conversationFilters: { ...state.conversationFilters, ...filters },
          })),

        resetConversationFilters: () =>
          set({ conversationFilters: defaultFilters }),

        // Message actions
        setMessages: (conversationId, messages) =>
          set((state) => ({
            messages: {
              ...state.messages,
              [conversationId]: messages,
            },
          })),

        addMessage: (conversationId, message) =>
          set((state) => {
            const currentMessages = state.messages[conversationId] || [];
            const updatedMessages = [...currentMessages, message];

            // Also update the conversation's latest message
            const updatedConversations = state.conversations.map((conv) =>
              conv.id === conversationId
                ? {
                    ...conv,
                    lastestMessage: message.content,
                    unreadMessagesCount: conv.unreadMessagesCount
                      ? conv.unreadMessagesCount + 1
                      : 1,
                  }
                : conv
            );

            return {
              messages: {
                ...state.messages,
                [conversationId]: updatedMessages,
              },
              conversations: updatedConversations,
            };
          }),

        updateMessage: (conversationId, messageId, updates) =>
          set((state) => {
            const currentMessages = state.messages[conversationId] || [];
            const updatedMessages = currentMessages.map((msg) =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            );

            return {
              messages: {
                ...state.messages,
                [conversationId]: updatedMessages,
              },
            };
          }),

        removeMessage: (conversationId, messageId) =>
          set((state) => {
            const currentMessages = state.messages[conversationId] || [];
            const updatedMessages = currentMessages.filter(
              (msg) => msg.id !== messageId
            );

            return {
              messages: {
                ...state.messages,
                [conversationId]: updatedMessages,
              },
            };
          }),

        setLoadingMessages: (loading) => set({ isLoadingMessages: loading }),

        clearMessages: (conversationId) =>
          set((state) => ({
            messages: {
              ...state.messages,
              [conversationId]: [],
            },
          })),

        // Unread count actions
        setChannelsUnreadCount: (channels) =>
          set(() => {
            const totalUnreadCount = channels.reduce(
              (sum, channel) => sum + channel.totalUnreadMessages,
              0
            );
            return {
              channelsUnreadCount: channels,
              totalUnreadCount,
            };
          }),

        updateChannelUnreadCount: (channelType, count) =>
          set((state) => {
            const updatedChannels = state.channelsUnreadCount.map((channel) =>
              channel.type === channelType
                ? { ...channel, totalUnreadMessages: count }
                : channel
            );

            // Add channel if it doesn't exist
            if (!updatedChannels.find((c) => c.type === channelType)) {
              updatedChannels.push({
                type: channelType,
                totalUnreadMessages: count,
              });
            }

            const totalUnreadCount = updatedChannels.reduce(
              (sum, channel) => sum + channel.totalUnreadMessages,
              0
            );

            return {
              channelsUnreadCount: updatedChannels,
              totalUnreadCount,
            };
          }),

        incrementUnreadCount: (channelType, increment = 1) =>
          set((state) => {
            const updatedChannels = state.channelsUnreadCount.map((channel) =>
              channel.type === channelType
                ? {
                    ...channel,
                    totalUnreadMessages:
                      channel.totalUnreadMessages + increment,
                  }
                : channel
            );

            // Add channel if it doesn't exist
            if (!updatedChannels.find((c) => c.type === channelType)) {
              updatedChannels.push({
                type: channelType,
                totalUnreadMessages: increment,
              });
            }

            const totalUnreadCount = updatedChannels.reduce(
              (sum, channel) => sum + channel.totalUnreadMessages,
              0
            );

            return {
              channelsUnreadCount: updatedChannels,
              totalUnreadCount,
            };
          }),

        decrementUnreadCount: (channelType, decrement = 1) =>
          set((state) => {
            const updatedChannels = state.channelsUnreadCount.map((channel) =>
              channel.type === channelType
                ? {
                    ...channel,
                    totalUnreadMessages: Math.max(
                      0,
                      channel.totalUnreadMessages - decrement
                    ),
                  }
                : channel
            );

            const totalUnreadCount = updatedChannels.reduce(
              (sum, channel) => sum + channel.totalUnreadMessages,
              0
            );

            return {
              channelsUnreadCount: updatedChannels,
              totalUnreadCount,
            };
          }),

        markConversationAsRead: (conversationId) =>
          set((state) => {
            const updatedConversations = state.conversations.map((conv) =>
              conv.id === conversationId
                ? { ...conv, unreadMessagesCount: 0, unreadCount: 0 }
                : conv
            );

            return {
              conversations: updatedConversations,
            };
          }),

        // Utility actions
        reset: () =>
          set({
            conversations: [],
            selectedConversationId: null,
            selectedConversation: null,
            isLoadingConversations: false,
            conversationFilters: defaultFilters,
            messages: {},
            isLoadingMessages: false,
            channelsUnreadCount: [],
            totalUnreadCount: 0,
          }),

        getConversationById: (id) => {
          const state = get();
          return state.conversations.find((conv) => conv.id === id);
        },

        getMessagesByConversationId: (conversationId) => {
          const state = get();
          return state.messages[conversationId] || [];
        },

        getTotalUnreadCount: () => {
          const state = get();
          return state.totalUnreadCount;
        },
      }),
      {
        name: "cs-store",
        partialize: (state) => ({
          // Only persist certain parts of the state
          conversations: state.conversations,
          selectedConversationId: state.selectedConversationId,
          conversationFilters: state.conversationFilters,
          channelsUnreadCount: state.channelsUnreadCount,
          totalUnreadCount: state.totalUnreadCount,
        }),
      }
    ),
    {
      name: "cs-store",
    }
  )
);

// Selectors for better performance
export const useConversations = () =>
  useCsStore((state) => state.conversations);
export const useSelectedConversation = () =>
  useCsStore((state) => state.selectedConversation);
export const useSelectedConversationId = () =>
  useCsStore((state) => state.selectedConversationId);
export const useConversationFilters = () =>
  useCsStore((state) => state.conversationFilters);
export const useChannelsUnreadCount = () =>
  useCsStore((state) => state.channelsUnreadCount);
export const useTotalUnreadCount = () =>
  useCsStore((state) => state.totalUnreadCount);
export const useMessagesForConversation = (conversationId: number) =>
  useCsStore((state) => state.messages[conversationId] || []);
