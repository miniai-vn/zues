import { useChatArea } from "@/hooks/data/cs/useChatArea";
import { MessageCircle } from "lucide-react";
import { ChatHeader, EmptyState, Message, MessageInput, MessageList } from "./chat-area";

interface ChatAreaProps {
  messages?: Message[];
  currentUserId?: string;
}

const ChatArea = ({ messages = [], currentUserId = "1" }: ChatAreaProps) => {
  const {
    messages: chatMessages,
    currentUserId: userId,
    showContactInfo,
    sendMessage,
    getUserById,
    toggleContactInfo,
    handleMoreOptions,
  } = useChatArea({ messages, currentUserId });

  // Show empty state if no messages (or you can adjust this logic as needed)
  if (!messages || messages.length === 0) {
    return (
      <EmptyState
        title="Select a conversation"
        description="Choose a conversation to start messaging"
        icon={<MessageCircle className="h-16 w-16" />}
      />
    );
  }

  return (
    <div className="flex-1 flex">
      <div className="flex-1 flex flex-col">
        <ChatHeader
          // You may need to pass conversationName/conversationAvatar from props or context
          conversationName=""
          conversationAvatar=""
          showContactInfo={showContactInfo}
          onToggleContactInfo={toggleContactInfo}
          onMoreOptions={handleMoreOptions}
        />

        <MessageList
          messages={chatMessages}
          currentUserId={userId}
          getUserById={getUserById}
        />

        <MessageInput onSendMessage={sendMessage} />
      </div>
      {/* Remove ContactInfoSidebar if you don't have conversation context */}
    </div>
  );
};

export default ChatArea;
