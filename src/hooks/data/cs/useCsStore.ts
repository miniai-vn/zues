"use client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Conversation, ConversationQueryParams } from "./useCS";
import { Message } from "./useMessage";

interface ChannelUnreadCount {
  type: string;
  totalUnreadMessages: number;
}
export interface QuotedMessage {
  id: string;
  content: string;
  authorId?: string;
  createdAt: string;
}

interface CsStore {
  //selected quote state
  selectedQuote: Map<string, QuotedMessage>;
  setSelectedQuote: (conversationId: string, quote: QuotedMessage) => void;
  deleteQuoteById: (conversationId: string) => void;
  // selected message state
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string | null) => void;
  // Conversations state
  conversations: Conversation[];
  selectedConversationId: string | null;
  selectedConversation: Conversation | null;
  setSelectedConversation: (conv: Conversation | null) => void;

  isLoadingConversations: boolean;
  conversationFilters: ConversationQueryParams;
  // Messages state
  messages: Record<string, Message[]>; // conversationId -> messages
  isLoadingMessages: boolean;

  // Platform unread counts
  channelsUnreadCount: ChannelUnreadCount[];
  totalUnreadCount: number;

  // Actions - Conversations
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  removeConversation: (id: string) => void;
  setSelectedConversationId: (id: string | null) => void;
  setLoadingConversations: (loading: boolean) => void;
  setConversationFilters: (filters: Partial<ConversationQueryParams>) => void;
  resetConversationFilters: () => void;

  // Actions - Messages
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (
    conversationId: string,
    messageId: string,
    updates: Partial<Message>
  ) => void;
  removeMessage: (conversationId: string, messageId: string) => void;
  setLoadingMessages: (loading: boolean) => void;
  clearMessages: (conversationId: string) => void;

  // Actions - Unread counts
  setChannelsUnreadCount: (channels: ChannelUnreadCount[]) => void;
  updateChannelUnreadCount: (channelType: string, count: number) => void;
  incrementUnreadCount: (channelType: string, increment?: number) => void;
  decrementUnreadCount: (channelType: string, decrement?: number) => void;
  markConversationAsRead: (conversationId: string) => void;

  // Utility actions
  reset: () => void;
  getConversationById: (id: string) => Conversation | undefined;
  getMessagesByConversationId: (conversationId: string) => Message[];
  getTotalUnreadCount: () => number;
  getQuoteById: (id: string) => QuotedMessage | undefined;
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
        // selected quote state
        selectedQuote: new Map<string, QuotedMessage>(),
        setSelectedQuote: (conversationId: string, quote: QuotedMessage) =>
          set((state) => {
            const newMap = new Map(state.selectedQuote);
            newMap.set(conversationId, quote);
            return { selectedQuote: newMap };
          }),
        deleteQuoteById: (conversationId: string) =>
          set((state) => {
            const newMap = new Map(state.selectedQuote);
            newMap.delete(conversationId);
            return { selectedQuote: newMap };
          }),
        // selected message state
        selectedMessageId: null,
        setSelectedMessageId: (id) => set({ selectedMessageId: id }),
        // Initial state
        conversations: [],
        selectedConversationId: null,
        selectedConversation: null,

        setSelectedConversation: (conv: Conversation | null) =>
          set(() => ({
            selectedConversation: conv,
          })),

        isLoadingConversations: false,
        conversationFilters: defaultFilters,

        messages: {},
        isLoadingMessages: false,

        channelsUnreadCount: [],
        totalUnreadCount: 0,

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
              Object.entries(state.messages).filter(([key]) => key !== id)
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

        getQuoteById: (id) => {
          const state = get();
          return state.selectedQuote.get(id);
        },
      }),
      {
        name: "cs-store",
        partialize: (state) => ({
          // Only persist certain parts of the state
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
