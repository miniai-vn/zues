import { useChatArea } from "@/hooks/data/cs/useChatArea";
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
import { Conversation } from "@/hooks/data/cs/useCS";
import { Tag } from "@/hooks/data/cs/useTags";

interface ChatAreaProps {
  conversation: Conversation;
}

const ChatArea = ({ conversation }: ChatAreaProps) => {
  // Extract data from conversation object
  const conversationId = conversation?.id;
  const conversationName = conversation?.name || "";
  const conversationAvatar = conversation?.avatar || "";
  const customerId = conversation?.senderId;
  const tags = conversation?.tags || [];
  const currentUserId = "1"; // You might want to get this from auth context

  const {
    messages: chatMessages,
    currentUserId: userId,
    showContactInfo,
    sendMessage,
    getUserById,
    toggleContactInfo,
    handleMoreOptions,
  } = useChatArea({
    messages: conversation?.messages as Message[],
    currentUserId,
  });

  const [showParticipantManagement, setShowParticipantManagement] =
    useState(false);
  const [showTagManagement, setShowTagManagement] = useState(false);

  const handleUpdateTags = (conversationId: number, updatedTags: Tag[]) => {
    // TODO: Update the conversation tags
    // You might want to call a mutation to update the conversation
    // or trigger a parent component callback
    console.log("Updating tags for conversation:", conversationId, updatedTags);
  };

  // Show empty state if no messages (or you can adjust this logic as needed)
  if (!conversation?.messages || conversation?.messages.length === 0) {
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
        conversationId={conversationId}
        open={showParticipantManagement}
        onOpenChange={setShowParticipantManagement}
      />

      <TagManagementSheet
        open={showTagManagement}
        onOpenChange={setShowTagManagement}
        conversationId={conversationId}
        currentTags={tags}
        onUpdateTags={handleUpdateTags}
      />
    </div>
  );
};

export default ChatArea;
