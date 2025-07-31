"use client";
import { useCallback, useState } from "react";
import { Socket } from "socket.io-client";

interface UserJoinedEvent {
  message: string;
  userId: string;
  conversationId?: string;
}

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketChat, setSocketChat] = useState<Socket | null>(null);
  const [isChatConnected, setIsChatConnected] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Join a conversation room
  const joinConversation = useCallback(
    (conversationId?: string, userId?: string) => {
      if (socketChat) {
        socketChat.emit("joinConversation", { conversationId, userId });
      }
    },
    [socketChat]
  );

  // Send a message to the conversation
  const sendMessage = useCallback(
    (
      conversationId?: string,
      message: string,
      userId: string,
      messageType: string = "text"
    ) => {
      if (socketChat) {
        socketChat.emit("sendMessageToConversation", {
          conversationId,
          message,
          userId,
          messageType,
        });
      }
    },
    [socketChat]
  );

  // Send typing indicator
  const sendTypingIndicator = useCallback(
    (conversationId?: string, userId: string, isTyping: boolean) => {
      if (socketChat) {
        socketChat.emit("typing", {
          conversationId,
          userId,
          isTyping,
        });
      }
    },
    [socketChat]
  );

  // Mark messages as read
  const markAsRead = useCallback(
    (conversationId?: string, userId: string, messageId?: number) => {
      if (socketChat) {
        socketChat.emit("markAsRead", {
          conversationId,
          userId,
          messageId,
        });
      }
    },
    [socketChat]
  );

  // Validate client connection
  const validateClient = useCallback(() => {
    if (socketChat) {
      socketChat.emit("validateClient");
    }
  }, [socketChat]);

  // Get server stats
  const getServerStats = useCallback(() => {
    if (socketChat) {
      socketChat.emit("getServerStats");
    }
  }, [socketChat]);

  return {
    socket,
    socketChat,
    isConnected,
    isChatConnected,
    // Methods
    joinConversation,
    sendMessage,
    sendTypingIndicator,
    markAsRead,
    validateClient,
    getServerStats,
  };
}
