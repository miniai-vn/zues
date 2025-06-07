import { useChatArea } from "@/hooks/data/cs/useChatArea";
import useTags, { Tag } from "@/hooks/data/cs/useTags";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import {
  ChatHeader,
  EmptyState,
  Message,
  MessageInput,
  MessageList,
} from "./chat-area";
import ContactInfoSidebar from "./contact-info/ContactInfoSidebar";
import ParticipantManagementSheet from "./participients-manager";
import TagManagementSheet from "./tag-manager";

interface ChatAreaProps {
  messages?: Message[];
  tags?: Tag[];
  currentUserId?: string;
  customerId?: string;
  conversationName?: string;
  conversationAvatar?: string;
  conversationId?: number;
}

const ChatArea = ({
  messages = [],
  customerId,
  currentUserId = "1",
  conversationName = "",
  conversationAvatar = "",
  conversationId = 1,
  tags = [], // Using the tags prop directly
}: ChatAreaProps) => {
  const {
    messages: chatMessages,
    currentUserId: userId,
    showContactInfo,
    sendMessage,
    getUserById,
    toggleContactInfo,
    handleMoreOptions,
  } = useChatArea({ messages, currentUserId });

  const [showParticipantManagement, setShowParticipantManagement] =
    useState(false);
  const [showTagManagement, setShowTagManagement] = useState(false);

  const handleUpdateTags = (conversationId: number, updatedTags: Tag[]) => {
    // TODO: Implement API call to update conversation tags
    console.log("Updating tags for conversation:", conversationId, updatedTags);
    // You might want to call a parent component callback here to update the tags
    // or trigger a refetch of the conversation data
  };

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
          conversationName={conversationName}
          conversationAvatar={conversationAvatar}
          showContactInfo={showContactInfo}
          onToggleContactInfo={toggleContactInfo}
          onMoreOptions={handleMoreOptions}
          setShowParticipantManagement={setShowParticipantManagement}
          setShowTagManagement={setShowTagManagement}
        />

        <MessageList
          messages={chatMessages}
          currentUserId={userId}
          getUserById={getUserById}
        />

        <MessageInput onSendMessage={sendMessage} />
      </div>

      <ContactInfoSidebar
        onClose={toggleContactInfo}
        customerId={customerId}
        isOpen={showContactInfo}
      />

      <ParticipantManagementSheet
        open={showParticipantManagement}
        onOpenChange={setShowParticipantManagement}
      />

      <TagManagementSheet
        open={showTagManagement}
        onOpenChange={setShowTagManagement}
        conversationId={conversationId}
        currentTags={tags} // Using the tags prop directly
        onUpdateTags={handleUpdateTags}
      />
    </div>
  );
};

export default ChatArea;
