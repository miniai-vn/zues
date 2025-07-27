"use client";
import { Message, useCS } from "@/hooks/data/cs/useCS";
import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../useAuth";
import { useCsStore } from "./useCsStore";

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
  const { refetchConversations, sendMessage } = useCS();
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
      // Nếu là cuộc trò chuyện hiện tại
      if (data.conversationId === conversationId) {
        setMessages((prevMessages) => [...prevMessages, data]);
        readConversations(data.conversationId as number);

        // Đưa conversation hiện tại lên đầu nếu chưa ở top
        const currentIndex = conversations.findIndex(
          (conv) => conv.id === data.conversationId
        );
        if (currentIndex > 0) {
          const updatedConversations = [
            conversations[currentIndex],

            ...conversations.slice(0, currentIndex),
            ...conversations.slice(currentIndex + 1),
          ];
          setConversations(updatedConversations);
        }
        return;
      }

      // Tìm cuộc trò chuyện tương ứng
      const existingConversation = conversations.find(
        (conv) => conv.id === data.conversationId
      );
      if (!existingConversation) return;

      // Tạo bản ghi mới cho cuộc trò chuyện vừa nhận tin nhắn
      const updatedConversation = {
        ...existingConversation,
        unreadMessagesCount: existingConversation?.unreadMessagesCount + 1,
        lastestMessage: data.content,
        updatedAt: new Date().toISOString(),
      };
      // Nếu đã ở đầu danh sách, chỉ cần cập nhật
      const isAlreadyAtTop = conversations[0]?.id === data.conversationId;
      if (isAlreadyAtTop) {
        setConversations(
          conversations.map((conv) =>
            conv.id === data.conversationId ? updatedConversation : conv
          )
        );
      } else {
        // Đưa cuộc trò chuyện vừa nhận lên đầu danh sách
        const otherConversations = conversations.filter(
          (conv) => conv.id !== data.conversationId
        );
        setConversations([updatedConversation, ...otherConversations]);
      }
    };

    const handleNewConversation = (data: {
      conversationId: number;
      userId: string;
    }) => {
      joinConversation(data.conversationId, data.userId);
      refetchConversations();
    };

    const handleMarkAsRead = (data: {
      conversationId: number;
      messageId: number;
      userId: string;
      readBy: {
        id: string;
        name: string;
        avatar?: string;
      };
    }) => {
      // Update the message to include the readBy information
      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message.id === data.messageId) {
            return {
              ...message,
              readBy: [
                ...(message.readBy || []),
                {
                  id: data.readBy.id,
                  name: data.readBy.name,
                  avatar: data.readBy.avatar,
                },
              ],
            };
          }
          return message;
        })
      );
    };
    socketChatIo.on("messageRead", handleMarkAsRead);
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
        socketChatIo.emit("joinConversation", {
          conversationId,
          userId,
        });
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

  const readConversations = useCallback(
    (conversationId: number) => {
      if (socketChatIo) {
        socketChatIo.emit("markAsRead", { conversationId, userId: user?.id });
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
    currentUserId: user?.id || "",
    showContactInfo,
    isChatConnected,

    // Actions
    joinAllConversationWithUserId,
    sendMessage: sendMessageToChannels,
    toggleContactInfo,
    setShowContactInfo,
    readConversations,
  };
};
