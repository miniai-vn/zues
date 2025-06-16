'use client'
import { Message, useCS } from "@/hooks/data/cs/useCS";
import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useCsStore } from "./useCsStore";

interface UseChatAreaProps {
  conversationId?: number;
}

export const useChatAreaSocket = ({ conversationId }: UseChatAreaProps) => {
  const [isChatConnected, setIsChatConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const {
    messages: chatMessages,
    setConversations,
    conversations,
    socketChatIo,
    setSocketChatIo,
  } = useCsStore();
  const { refetchConversations } = useCS();
  const user = typeof window !== 'undefined' ? localStorage.getItem("user") : null;
  const currentUser = user ? JSON.parse(user) : undefined;

  useEffect(() => {
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
      setSocketChatIo(null);
    });

    return () => {
      setSocketChatIo(null);
      socketIo.disconnect();
    };
  }, [setSocketChatIo]);

  useEffect(() => {
    if (!socketChatIo) return;

    const handleReceiveMessage = (data: Message) => {
      if (data.conversationId === conversationId) {
        setMessages((prevMessages) => [...prevMessages, data]);
      } else {
        const existingConversation = conversations.find(
          (conv) => conv.id === data.conversationId
        );
        if (existingConversation) {
          existingConversation.unreadMessagesCount += 1;
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
  }, [socketChatIo, conversationId, conversations, setConversations]);

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
    if (socketChatIo && currentUser?.id) {
      socketChatIo.emit("joinAllConversationsWithUserId", {
        userId: currentUser?.id,
      });
    }
  }, [socketChatIo, currentUser]);

  const sendMessage = useCallback(
    (
      conversationId: number,
      message: string,
      userId: string,
      messageType: string = "text"
    ) => {
      if (socketChatIo) {
        socketChatIo.emit("sendMessageToConversation", {
          conversationId,
          message,
          userId,
          messageType,
        });
      }
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
    currentUserId: currentUser?.id || "",
    showContactInfo,

    // Actions
    joinAllConversationWithUserId,
    sendMessage,
    toggleContactInfo,
    setShowContactInfo,
  };
};
