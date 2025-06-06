import { useCS } from "@/hooks/data/useCS";
import { useState } from "react";
import {
  PlatformList,
  ConversationColumn,
  PLATFORMS,
} from "./conversation-sidebar";

interface ConversationSidebarProps {
  selectedConversationId?: number;
  onSelectConversationId: (conversationId: number) => void;
}

const ConversationSidebar = ({
  selectedConversationId,
  onSelectConversationId,
}: ConversationSidebarProps) => {
  const { filters, updateFilters, conversations, isLoadingConversations } =
    useCS();

  // Use filters from global state if available
  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const [filterStatus, setFilterStatus] = useState<"all" | "unread" | "read">(
    (filters.type as any) || "all"
  );
  const [selectedPlatform, setSelectedPlatform] = useState<string>(
    filters.channelType || "all"
  );

  const handlePlatformChange = (platformId: string) => {
    setSelectedPlatform(platformId);
    updateFilters({
      channelType: platformId === "all" ? undefined : platformId,
    });
    console.log("Platform changed to:", filters);
  };

  const handleStatusChange = (status: "all" | "unread" | "read") => {
    setFilterStatus(status);
    updateFilters({ type: status === "all" ? undefined : status });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    updateFilters({ search: e.target.value || undefined });
  };

  const totalUnreadCount = PLATFORMS.filter(
    (platform) => platform.id !== "all"
  ).reduce((sum, platform) => sum + platform.unreadCount, 0);

  if (isLoadingConversations) {
    return <></>;
  }
  return (
    <div className="flex h-full border-r">
      <PlatformList
        selectedPlatform={selectedPlatform}
        onPlatformChange={handlePlatformChange}
        totalUnreadCount={totalUnreadCount}
      />
      <ConversationColumn
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={onSelectConversationId}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filterStatus={filterStatus}
        onStatusChange={handleStatusChange}
        selectedPlatform={selectedPlatform}
        onPlatformChange={handlePlatformChange}
      />
    </div>
  );
};

export default ConversationSidebar;
