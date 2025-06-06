import { useChatArea } from "@/hooks/data/useChatArea";
import { MessageCircle } from "lucide-react";
import { ChatHeader, EmptyState, MessageInput, MessageList } from "./chat-area";
import ContactInfoSidebar from "./ContactInfoSidebar";

interface ChatAreaProps {
  conversationId?: number;
}

const ChatArea = ({ conversationId }: ChatAreaProps) => {
  const {
    conversation,
    messages,
    currentUserId,
    showContactInfo,
    sendMessage,
    getUserById,
    toggleContactInfo,
    handleAttachFile,
    handleEmojiPicker,
    handleMoreOptions,
  } = useChatArea({ conversationId });

  // Show empty state if no conversation is selected
  if (!conversationId) {
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
          conversationName={conversation?.name}
          conversationAvatar={conversation?.avatar}
          showContactInfo={showContactInfo}
          onToggleContactInfo={toggleContactInfo}
          onMoreOptions={handleMoreOptions}
        />

        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          getUserById={getUserById}
        />

        <MessageInput
          onSendMessage={sendMessage}
          onAttachFile={handleAttachFile}
          onEmojiPicker={handleEmojiPicker}
        />
      </div>
      {/* <ContactInfoSidebar
        conversation={conversation}
        isOpen={showContactInfo}
        onClose={() => toggleContactInfo()}
      /> */}
    </div>
  );
};

export default ChatArea;
