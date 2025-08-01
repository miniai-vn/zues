import { useChatAreaSocket } from "@/hooks/data/cs/useChatAreaSocket";
import { useCS } from "@/hooks/data/cs/useCS";
import { useCsStore } from "@/hooks/data/cs/useCsStore";
import { useMessage } from "@/hooks/data/cs/useMessage";
import { useTranslations } from "@/hooks/useTranslations";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import ParticipantManagementSheet from "../participients-manager";
import TagManagementSheet from "../tag-manager";
import { ChatHeader } from "./ChatHeader";
import ContactInfoSidebar from "./contact-info/ContactInfoSidebar";
import { EmptyState } from "./EmptyState";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { ShareDialog } from "./ShareDialog";

const ChatArea = () => {
  const { t } = useTranslations();

  const [showParticipantManagement, setShowParticipantManagement] =
    useState(false);
  const [showTagManagement, setShowTagManagement] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [showQuotedMessage, setShowQuotedMessage] = useState<boolean>(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [nextBeforeMessageId, setNextBeforeMessageId] = useState<string | null>(
    null
  );

  const [nextAfterMessageId, setNextAfterMessageId] = useState<string | null>(
    null
  );

  const { sendAttechment, sendMessageImages, handleForwardMessage } =
    useMessage({});
  const { selectedConversationId, getQuoteById } = useCsStore();

  const { fullInfoConversationWithMessages: conversation, isLoadingMessages } =
    useCS({
      conversationId: selectedConversationId as string,
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
  } = useChatAreaSocket({
    ...(selectedConversationId
      ? { conversationId: selectedConversationId }
      : {}),
  });

  useEffect(() => {
    joinAllConversationWithUserId();
  }, []);

  const quotedMessage = getQuoteById(selectedConversationId as string);
  useEffect(() => {
    if (quotedMessage) {
      setShowQuotedMessage(true);
    } else {
      setShowQuotedMessage(false);
    }
  }, [quotedMessage]);

  useEffect(() => {
    if (selectedConversationId) {
      setHasMoreMessages(conversation?.hasNext || chatMessages.length > 10);
    }
  }, [selectedConversationId, chatMessages]);

  useEffect(() => {
    if (selectedConversationId) {
      setPage(1);
    }
  }, [selectedConversationId]);

  const handleRemoveQuote = () => setShowQuotedMessage(false);
  const toggleContactInfo = () => {
    setShowContactInfo((prev) => !prev);
  };

  const handleLoadMoreMessages = async (stateScroll: string) => {
    if (stateScroll === "bottom") {
      setNextAfterMessageId(conversation?.nextAfterMessageId || null);
      setPage(1);
      return;
    }

    if (
      selectedConversationId &&
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

  if (!selectedConversationId) {
    return (
      <EmptyState
        title={t("dashboard.chat.selectConversation")}
        description={t("dashboard.chat.chooseConversation")}
        icon={<MessageCircle className="h-16 w-16" />}
      />
    );
  }

  return (
    <>
      <div className="flex flex-col bg-gray-100 h-screen">
        <div className="sticky top-0 z-10">
          <ChatHeader
            showContactInfo={showContactInfo}
            onToggleContactInfo={toggleContactInfo}
            setShowParticipantManagement={setShowParticipantManagement}
            setShowTagManagement={setShowTagManagement}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <MessageList
            messages={chatMessages}
            currentUserId={userId}
            onLoadMore={(stateScroll) => handleLoadMoreMessages(stateScroll)}
            onShare={(status, messageId) => {
              console.log("Share message:", status, messageId);
              if (status) {
                setIsShareOpen(true);
                setSelectedMessageId(messageId);
              }
            }}
            hasMore={hasMoreMessages}
            autoScroll={page === 1}
          />
        </div>

        <div>
          <MessageInput
            showQuotedMessage={showQuotedMessage}
            handleRemoveQuote={handleRemoveQuote}
            quotedMessage={quotedMessage}
            onAttachFile={(files: FileList) => {
              if (files && files.length > 0) {
                sendAttechment({
                  file: files[0],
                  conversationId: selectedConversationId as string,
                });
              }
            }}
            onMessageImages={(files: File[], content: string) => {
              if (files && files.length > 0) {
                sendMessageImages({
                  files,
                  conversationId: selectedConversationId as string,
                  content,
                });
              }
            }}
            onSendMessage={(content) => {
              sendMessage({
                conversationId: selectedConversationId,
                message: content,
                messageType: "text",
                channelId: conversation?.channelId,
              });
            }}
          />
        </div>
      </div>

      <ShareDialog
        messageId={selectedMessageId}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        handleForward={(customerIds) => {
          handleForwardMessage({
            customerIds,
            messageId: selectedMessageId as string,
            conversationId: selectedConversationId as string,
          });
        }}
      />

      <ContactInfoSidebar
        onClose={toggleContactInfo}
        customerId={conversation?.senderId}
        isOpen={showContactInfo}
      />

      <ParticipantManagementSheet
        conversationId={selectedConversationId}
        open={showParticipantManagement}
        onOpenChange={setShowParticipantManagement}
      />

      <TagManagementSheet
        open={showTagManagement}
        onOpenChange={setShowTagManagement}
        customerId={conversation?.senderId}
        onUpdateTags={() => {}}
      />
    </>
  );
};

export default ChatArea;
