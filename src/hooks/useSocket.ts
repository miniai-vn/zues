"use client";
import { useCallback, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Message } from "./data/cs/useCS";

interface UserJoinedEvent {
  message: string;
  userId: string;
  conversationId: number;
}



export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketChat, setSocketChat] = useState<Socket | null>(null);
  const [isChatConnected, setIsChatConnected] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    const socketIo = io(process.env.NEXT_PUBLIC_SOCKET_URL as string);
    const socketChatIo = io(process.env.NEXT_PUBLIC_API_URL as string);
    // Regular socket connection
    socketIo.on("connect", () => {
      console.log("Connected to socket server");
      setIsConnected(true);
    });

    socketIo.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketIo);

    // Chat socket connection with event listeners
    socketChatIo.on("connect", () => {
      console.log("Connected to chat socket server");
      setSocketChat(socketChatIo);
      setIsChatConnected(true);
    });

    socketChatIo.on("disconnect", () => {
      console.log("Disconnected from chat socket server");
      setSocketChat(null);
      setIsChatConnected(false);
    });

    socketChatIo.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    socketChatIo.on("connect_timeout", (err) => {
      console.error("Socket connection timeout:", err);
    });

    // Listen for connection confirmation
    socketChatIo.on("connectionConfirmed", (data) => {
      console.log("Connection confirmed:", data);
    });

    // Listen for force disconnect
    socketChatIo.on("forceDisconnect", (data) => {
      console.log("Force disconnect:", data);
      alert(`You have been disconnected: ${data.reason}`);
    });

    // Listen for joining conversation confirmation
    socketChatIo.on("joinedConversation", (data) => {
      console.log("Joined conversation:", data);
    });

    // Listen for when other users join the conversation
    socketChatIo.on("userJoinedConversation", (data: UserJoinedEvent) => {
      console.log("User joined conversation:", data);
    });

    // Listen for incoming messages
    socketChatIo.on("receiveMessage", (data: Message) => {
      console.log("Received message:", data);
      // const chatMessages = [
      //   ...(messages[data.conversationId as number] || []),
      //   data,
      // ];
      // console.log(
      //   "Updated chat messages:",
      //   messages[data.conversationId as number] || []
      // );
      // setMessages(data.conversationId as number, chatMessages);
      // const chatMessages = [...(messages[data?.conversationId] || [])];
      // setMessages(data.conversationId, [...chatMessages, data.message]);
    });

    // Listen for message read events
    socketChatIo.on("messageRead", (data) => {
      console.log("Message read:", data);
    });

    // Listen for client validation response
    socketChatIo.on("clientValidation", (data) => {
      console.log("Client validation:", data);
    });

    // Listen for server stats
    socketChatIo.on("serverStats", (data) => {
      console.log("Server stats:", data);
    });

    // Listen for errors
    socketChatIo.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return () => {
      socketIo.disconnect();
      socketChatIo.disconnect();
    };
  }, []);

  // Join a conversation room
  const joinConversation = useCallback(
    (conversationId: number, userId?: string) => {
      if (socketChat) {
        socketChat.emit("joinConversation", { conversationId, userId });
      }
    },
    [socketChat]
  );

  // Send a message to the conversation
  const sendMessage = useCallback(
    (
      conversationId: number,
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
    (conversationId: number, userId: string, isTyping: boolean) => {
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
    (conversationId: number, userId: string, messageId?: number) => {
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
