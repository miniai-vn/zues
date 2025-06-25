"use client";
import { Message, useCS } from "@/hooks/data/cs/useCS";
import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useCsStore } from "./useCsStore";
import { useAuth, useUserStore } from "../useAuth";

interface UseChatAreaProps {
  conversationId?: number;
}

export const useChatAreaSocket = ({ conversationId }: UseChatAreaProps) => {
  const [isChatConnected, setIsChatConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [socketChatIo, setSocketChatIo] = useState<Socket | null>(null);

  const {
    messages: chatMessages,
    setConversations,
    conversations,
  } = useCsStore();
  const { refetchConversations, markReadConversation, sendMessage } = useCS();
  const { user } = useAuth({});
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");

    const socketIo = io(process.env.NEXT_PUBLIC_API_URL as string, {
      auth: {
        token,
      },
    });
    setSocketChatIo(socketIo);

    socketIo.on("connect", () => {
      console.log("Connected to chat socket server");
      setIsChatConnected(true);
    });

    socketIo.on("disconnect", () => {
      console.log("Disconnected from chat socket server");
      setIsChatConnected(false);
    });

    return () => {
      socketIo.disconnect();
      setSocketChatIo(null);
    };
  }, []);

  useEffect(() => {
    if (!socketChatIo) return;

    const handleReceiveMessage = (data: Message) => {
      console.log("Received message:", data);
      if (data.conversationId === conversationId) {
        setMessages((prevMessages) => [...prevMessages, data]);
        markReadConversation(data.conversationId as number);
      } else {
        const existingConversation = conversations.find(
          (conv) => conv.id === data.conversationId
        );
        if (existingConversation) {
          existingConversation.unreadMessagesCount += 1;
          existingConversation.lastestMessage = data.content;
          setConversations(conversations);
        }
      }
    };

    const handleNewConversation = (data: {
      conversationId: number;
      userId: string;
    }) => {
      joinConversation(data.conversationId, data.userId);
      refetchConversations();
    };

    socketChatIo.on("receiveMessage", handleReceiveMessage);
    socketChatIo.on("newConversation", handleNewConversation);

    return () => {
      socketChatIo.off("newConversation", handleNewConversation);
      socketChatIo.off("receiveMessage", handleReceiveMessage);
    };
  }, [socketChatIo, conversationId, conversations]);

  useEffect(() => {
    if (chatMessages && conversationId) {
      setMessages(chatMessages[conversationId] || []);
    }
  }, [chatMessages, conversationId]);

  const joinConversation = useCallback(
    (conversationId: number, userId?: string) => {
      if (socketChatIo) {
        socketChatIo.emit("joinConversation", { conversationId, userId });
      }
    },
    [socketChatIo]
  );

  const joinAllConversationWithUserId = useCallback(() => {
    if (socketChatIo && user?.id) {
      socketChatIo.emit("joinAllConversationsWithUserId", {
        userId: user?.id,
      });
    }
  }, [socketChatIo, user]);

  const sendMessageToChannels = useCallback(
    ({
      conversationId,
      message,
      messageType = "text",
      channelId,
    }: {
      conversationId: number;
      message: string;
      messageType: string;
      channelId: number;
    }) => {
      sendMessage({
        conversationId,
        content: message,
        messageType: messageType,
        channelId,
        createdAt: new Date().toISOString(),
        senderId: user?.id || "",
        senderType: "user", // or another appropriate value
      });
    },
    [socketChatIo]
  );

  useEffect(() => {
    if (socketChatIo && isChatConnected) {
      joinAllConversationWithUserId();
    }
  }, [socketChatIo, isChatConnected, joinAllConversationWithUserId]);

  const toggleContactInfo = () => {
    setShowContactInfo((prev) => !prev);
  };

  return {
    // Data
    messages,
    currentUserId: user?.id || "",
    showContactInfo,
    isChatConnected,

    // Actions
    joinAllConversationWithUserId,
    sendMessage: sendMessageToChannels,
    toggleContactInfo,
    setShowContactInfo,
  };
};
