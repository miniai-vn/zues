import { Message, useCS } from "@/hooks/data/cs/useCS";
import { mockUsers } from "@/data/mockChatData";
import { useEffect, useState } from "react";

interface UseChatAreaProps {
  messages?: Message[];
  currentUserId?: string;
}

export const useChatArea = ({
  messages: propMessages = [],
  currentUserId = "1",
}: UseChatAreaProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showContactInfo, setShowContactInfo] = useState(false);

  // Update messages when propMessages changes
  useEffect(() => {
    if (propMessages && propMessages.length > 0) {
      setMessages(propMessages);
    }
  }, [propMessages]);

  // Send a new message
  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      senderId: currentUserId,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      senderType: "text",
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  // Get user information by ID
  const getUserById = (userId: string) => {
    return mockUsers.find((user) => user.id === userId);
  };

  // Toggle contact info sidebar
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
    currentUserId,
    showContactInfo,

    // Actions
    sendMessage,
    getUserById,
    toggleContactInfo,
    handleAttachFile,
    handleEmojiPicker,
    handleMoreOptions,

    // State setters (for advanced usage)
    setShowContactInfo,
  };
};
