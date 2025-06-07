import { Conversation } from "@/hooks/data/cs/useCS";
import { Tag } from "@/hooks/data/cs/useTags";
import React, { useState } from "react";
import TagManagementDialog from "../tag-manager/DialogTag";
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
  // Tag dialog state
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [selectedConversationForDialog, setSelectedConversationForDialog] =
    useState<Conversation | null>(null);

  // Handler to open tag dialog for a conversation
  const handleOpenTagDialog = (conversation: Conversation) => {
    setSelectedConversationForDialog(conversation);
    setTagDialogOpen(true);
  };
  // Handler to update tags (implement your logic here)
  const handleUpdateTags = (conversationId: number, tags: Tag[]) => {
    // TODO: Update tags for the conversation (API call or state update)
    // Example: updateConversationTags(conversationId, tags);
    console.log("Updating tags for conversation:", conversationId, tags);
    setTagDialogOpen(false);
  };

  // Get tags for the selected conversation (implement your logic here)
  const getConversationTags = (conversationId?: number): Tag[] => {
    const conversation = conversations.find(
      (conv) => conv.id === conversationId
    );
    return conversation?.tags || [];
  };

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
        onTagDialog={handleOpenTagDialog}
      />

      <ConversationListFooter
        totalConversations={conversations.length}
        displayedConversations={conversations.length}
        totalUnread={totalUnread}
      />      <TagManagementDialog
        open={tagDialogOpen}
        onOpenChange={setTagDialogOpen}
        conversationId={selectedConversationForDialog?.id}
        currentTags={getConversationTags(selectedConversationForDialog?.id)}
        onUpdateTags={handleUpdateTags}
      />
    </div>
  );
};
