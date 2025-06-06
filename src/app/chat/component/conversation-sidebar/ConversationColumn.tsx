import { ConversationListHeader } from "./ConversationListHeader";
import { ConversationList } from "./ConversationList";
import { ConversationListFooter } from "./ConversationListFooter";
import { Conversation } from "@/hooks/data/useCS";

interface ConversationColumnProps {
  conversations: Conversation[];
  selectedConversationId?: number;
  onSelectConversation: (conversationId: number) => void;
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filterStatus: "all" | "unread" | "read";
  onStatusChange: (status: "all" | "unread" | "read") => void;
  selectedPlatform: string;
  onPlatformChange: (platformId: string) => void;
  onNewConversation?: () => void;
  onSettings?: () => void;
}

export const ConversationColumn = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  searchQuery,
  onSearchChange,
  filterStatus,
  onStatusChange,
  selectedPlatform,
  onPlatformChange,
  onNewConversation,
  onSettings,
}: ConversationColumnProps) => {
  const hasActiveFilters = 
    searchQuery !== "" || 
    filterStatus !== "all" || 
    selectedPlatform !== "all";

  const totalUnread = conversations.reduce(
    (sum, conv) => sum + (conv.unreadMessagesCount || 0),
    0
  );

  return (
    <div className="flex flex-col items-center justify-center max-w-[20vw] flex-shrink-0">
      <ConversationListHeader
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        filterStatus={filterStatus}
        onStatusChange={onStatusChange}
        selectedPlatform={selectedPlatform}
        onPlatformChange={onPlatformChange}
        onNewConversation={onNewConversation}
        onSettings={onSettings}
      />

      <ConversationList
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={onSelectConversation}
        hasActiveFilters={hasActiveFilters}
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        selectedPlatform={selectedPlatform}
      />

      <ConversationListFooter
        totalConversations={conversations.length}
        displayedConversations={conversations.length}
        totalUnread={totalUnread}
      />
    </div>
  );
};
