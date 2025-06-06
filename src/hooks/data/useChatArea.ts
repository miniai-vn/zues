import { Message, useCS } from "@/hooks/data/useCS";
import { mockUsers } from "@/data/mockChatData";
import { useEffect, useState } from "react";

interface UseChatAreaProps {
  conversationId?: number;
  currentUserId?: string;
}

export const useChatArea = ({
  conversationId,
  currentUserId = "1",
}: UseChatAreaProps) => {
  const { fullInfoConversationWithMessages } = useCS({ id: conversationId });
  const [messages, setMessages] = useState<Message[]>([]);
  const [showContactInfo, setShowContactInfo] = useState(false);

  // Update messages when conversation data changes
  useEffect(() => {
    if (fullInfoConversationWithMessages) {
      setMessages(fullInfoConversationWithMessages.messages);
    } else {
      setMessages([]);
    }
  }, [fullInfoConversationWithMessages]);

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
    conversation: fullInfoConversationWithMessages,
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
