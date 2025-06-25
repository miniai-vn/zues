import { useChatAreaSocket } from "@/hooks/data/cs/useChatAreaSocket";
import { useCS } from "@/hooks/data/cs/useCS";
import { useTranslations } from "@/hooks/useTranslations";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { ChatHeader, EmptyState, MessageInput, MessageList } from "./chat-area";
import ContactInfoSidebar from "./contact-info/ContactInfoSidebar";
import ParticipantManagementSheet from "./participients-manager";
import TagManagementSheet from "./tag-manager";

interface ChatAreaProps {
  conversationId?: number;
}

const ChatArea = ({ conversationId }: ChatAreaProps) => {
  const { t } = useTranslations();
  const { fullInfoConversationWithMessages: conversation } = useCS({
    conversationId,
  });
  const conversationName = conversation?.name || "";
  const conversationAvatar = conversation?.avatar || "";
  const customerId = conversation?.senderId;
  const {
    messages: chatMessages,
    currentUserId: userId,
    showContactInfo,
    sendMessage,
    toggleContactInfo,
    joinAllConversationWithUserId,
  } = useChatAreaSocket({ ...(conversationId ? { conversationId } : {}) });

  useEffect(() => {
    joinAllConversationWithUserId();
  }, []);

  const [showParticipantManagement, setShowParticipantManagement] =
    useState(false);
  const [showTagManagement, setShowTagManagement] = useState(false);
  if (!conversationId) {
    return (
      <EmptyState
        title={t("dashboard.chat.selectConversation")}
        description={t("dashboard.chat.chooseConversation")}
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
          setShowParticipantManagement={setShowParticipantManagement}
          setShowTagManagement={setShowTagManagement}
        />

        <MessageList messages={chatMessages} currentUserId={userId} />
        <MessageInput
          onSendMessage={(content) => {
            sendMessage({
              conversationId: conversationId as number,
              message: content,
              messageType: "text",
              channelId: conversation?.channelId,
            });
          }}
        />
      </div>

      <ContactInfoSidebar
        onClose={toggleContactInfo}
        customerId={customerId}
        isOpen={showContactInfo}
      />

      <ParticipantManagementSheet
        conversationId={conversationId as number}
        open={showParticipantManagement}
        onOpenChange={setShowParticipantManagement}
      />

      <TagManagementSheet
        open={showTagManagement}
        onOpenChange={setShowTagManagement}
        customerId={customerId}
        onUpdateTags={() => {}}
      />
    </div>
  );
};

export default ChatArea;
