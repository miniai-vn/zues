import TagManagementSheet from "@/components/tag-manager";
import { useChatAreaSocket } from "@/hooks/data/cs/useChatAreaSocket";
import { useCS } from "@/hooks/data/cs/useCS";
import { useTranslations } from "@/hooks/useTranslations";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { ChatHeader, EmptyState, MessageInput, MessageList } from "./chat-area";
import ContactInfoSidebar from "./contact-info/ContactInfoSidebar";
import ParticipantManagementSheet from "./participients-manager";

interface ChatAreaProps {
  conversationId?: number;
}

const ChatArea = ({ conversationId }: ChatAreaProps) => {
  const { t } = useTranslations();

  const [showParticipantManagement, setShowParticipantManagement] =
    useState(false);
  const [showTagManagement, setShowTagManagement] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(1);
  const [showContactInfo, setShowContactInfo] = useState(false);

  const toggleContactInfo = () => {
    setShowContactInfo((prev) => !prev);
  };

  const { fullInfoConversationWithMessages: conversation, isLoadingMessages } =
    useCS({
      conversationId,
      queryMessageParams: {
        page,
        limit: 20,
      },
    });

  const {
    messages: chatMessages,
    currentUserId: userId,
    sendMessage,
    joinAllConversationWithUserId,
  } = useChatAreaSocket({ ...(conversationId ? { conversationId } : {}) });

  useEffect(() => {
    joinAllConversationWithUserId();
  }, []);

  useEffect(() => {
    if (conversationId) {
      setHasMoreMessages(chatMessages.length >= 20);
    }
  }, [conversationId, chatMessages]);

  useEffect(() => {
    if (conversationId) {
      setPage(1);
    }
  }, [conversationId]);

  const handleLoadMoreMessages = async () => {
    if (conversationId && hasMoreMessages && !isLoadingMessages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

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
          showContactInfo={showContactInfo}
          onToggleContactInfo={toggleContactInfo}
          setShowParticipantManagement={setShowParticipantManagement}
          setShowTagManagement={setShowTagManagement}
        />

        <MessageList
          messages={chatMessages}
          currentUserId={userId}
          onLoadMore={handleLoadMoreMessages}
          hasMore={hasMoreMessages}
          autoScroll={page === 1}
        />
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
        customerId={conversation?.senderId}
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
        customerId={conversation?.senderId}
        onUpdateTags={() => {}}
      />
    </div>
  );
};

export default ChatArea;
