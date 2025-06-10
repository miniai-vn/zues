import { Message } from "@/hooks/data/cs/useCS";
import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useCsStore } from "./useCsStore";

interface UseChatAreaProps {
  currentUserId?: string;
  conversationId: number;
}

export const useChatAreaSocket = ({ conversationId }: UseChatAreaProps) => {
  const [socketChat, setSocketChat] = useState<Socket | null>(null);
  const [isChatConnected, setIsChatConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const { messages: test } = useCsStore();
  const user = localStorage.getItem("user");
  const currentUser = user ? JSON.parse(user) : undefined;
  useEffect(() => {
    const socketChatIo = io(process.env.NEXT_PUBLIC_API_URL as string);
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

    // Listen for incoming messages
    socketChatIo.on("receiveMessage", (data: Message) => {
      console.log("Received message:", data);

      setMessages((prevMessages) => [...prevMessages, data]);
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

  useEffect(() => {
    joinConversation(conversationId, currentUser.id);
  }, [socketChat, isChatConnected, conversationId]);

  useEffect(() => {
    if (test) {
      setMessages(test[conversationId] || []);
    }
  }, [test, conversationId]);

  const toggleContactInfo = () => {
    setShowContactInfo((prev) => !prev);
  };

  // Handle attachment upload
  const handleAttachFile = () => {
    // TODO: Implement file upload functionality
    console.log("Attach file clicked");
  };

  // Handle emoji picker
  const handleEmojiPicker = () => {
    // TODO: Implement emoji picker functionality
    console.log("Emoji picker clicked");
  };

  // Handle more options
  const handleMoreOptions = () => {
    // TODO: Implement more options menu
    console.log("More options clicked");
  };

  return {
    // Data
    messages,
    currentUserId: currentUser?.id || "",
    showContactInfo,

    // Actions
    sendMessage,
    toggleContactInfo,
    handleAttachFile,
    handleEmojiPicker,
    handleMoreOptions,

    setShowContactInfo,
  };
};
