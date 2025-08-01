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
  const sendMessage = () => {};

  // Send typing indicator
  const sendTypingIndicator = () => {};

  // Mark messages as read
  const markAsRead = () => {};

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
