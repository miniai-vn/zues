import TagManagementSheet from "@/components/tag-manager";
import { useChatAreaSocket } from "@/hooks/data/cs/useChatAreaSocket";
import { useCS } from "@/hooks/data/cs/useCS";
import { useTranslations } from "@/hooks/useTranslations";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import ContactInfoSidebar from "./contact-info/ContactInfoSidebar";
import ParticipantManagementSheet from "../participients-manager";
import { EmptyState } from "./EmptyState";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

interface ChatAreaProps {
  conversationId?: string;
}

const ChatArea = ({ conversationId }: ChatAreaProps) => {
  const { t } = useTranslations();

  const [showParticipantManagement, setShowParticipantManagement] =
    useState(false);
  const [showTagManagement, setShowTagManagement] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(1);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [nextBeforeMessageId, setNextBeforeMessageId] = useState<string | null>(
    null
  );

  const [nextAfterMessageId, setNextAfterMessageId] = useState<string | null>(
    null
  );
  const toggleContactInfo = () => {
    setShowContactInfo((prev) => !prev);
  };

  const { fullInfoConversationWithMessages: conversation, isLoadingMessages } =
    useCS({
      conversationId,
      queryMessageParams: {
        page,
        limit: 20,
        nextBeforeMessageId,
        nextAfterMessageId,
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
      setHasMoreMessages(conversation?.hasNext || chatMessages.length > 10);
    }
  }, [conversationId, chatMessages]);

  useEffect(() => {
    if (conversationId) {
      setPage(1);
    }
  }, [conversationId]);

  const handleLoadMoreMessages = async (stateScroll: string) => {
    if (stateScroll === "bottom") {
      setNextAfterMessageId(conversation?.nextAfterMessageId || null);
      setPage(1);
      return;
    }

    if (
      conversationId &&
      hasMoreMessages &&
      !isLoadingMessages &&
      conversation?.hasNext
    ) {
      setPage((prevPage) => prevPage + 1);
      setHasMoreMessages(true);
    }

    if (!conversation?.hasNext) {
      setHasMoreMessages(false);
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
          onLoadMore={(stateScroll) => handleLoadMoreMessages(stateScroll)}
          hasMore={hasMoreMessages}
          autoScroll={page === 1}
        />
        <MessageInput
          onSendMessage={(content) => {
            sendMessage({
              conversationId: conversationId,
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
        conversationId={conversationId}
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
