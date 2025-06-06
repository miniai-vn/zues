import { Conversation } from "@/hooks/data/cs/useCS";
import { ConversationList } from "./ConversationList";
import { ConversationListFooter } from "./ConversationListFooter";
import { ConversationListHeader } from "./ConversationListHeader";


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
  onNewConversation: () => void;
  onSettings: () => void;
  // New filter props
  employeeFilter: string;
  onEmployeeFilterChange: (filter: string) => void;
  timeFilter: string;
  onTimeFilterChange: (filter: string) => void;
  phoneFilter: string;
  onPhoneFilterChange: (filter: string) => void;
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
  employeeFilter = "all",
  onEmployeeFilterChange = () => {},
  timeFilter = "all",
  onTimeFilterChange = () => {},
  phoneFilter = "all",
  onPhoneFilterChange = () => {},
}: ConversationColumnProps) => {
  const hasActiveFilters =
    searchQuery !== "" || filterStatus !== "all" || selectedPlatform !== "all";

  const totalUnread = conversations.reduce(
    (sum, conv) => sum + (conv.unreadMessagesCount || 0),
    0
  );

  return (
    <div className="flex flex-col items-center justify-center  max-w-[20vw] flex-shrink-0">
      <ConversationListHeader
        employeeFilter={employeeFilter}
        onEmployeeFilterChange={onEmployeeFilterChange}
        timeFilter={timeFilter}
        onTimeFilterChange={onTimeFilterChange}
        phoneFilter={phoneFilter}
        onPhoneFilterChange={onPhoneFilterChange}
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
