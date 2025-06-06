import { useCS } from "@/hooks/data/cs/useCS";
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

  // New filter states
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [phoneFilter, setPhoneFilter] = useState("all");

  const handlePlatformChange = (platformId: string) => {
    setSelectedPlatform(platformId);
    updateFilters({
      channelType: platformId === "all" ? undefined : platformId,
    });
  };

  const handleStatusChange = (status: "all" | "unread" | "read") => {
    setFilterStatus(status);
    updateFilters({ type: status === "all" ? undefined : status });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    updateFilters({ search: e.target.value || undefined });
  };

  const handleEmployeeFilterChange = (filter: string) => {
    setEmployeeFilter(filter);
    // You can also update global filters if needed
    // updateFilters({ employeeTag: filter === "all" ? undefined : filter });
  };

  const handleTimeFilterChange = (filter: string) => {
    setTimeFilter(filter);
    // You can also update global filters if needed
    // updateFilters({ timeRange: filter === "all" ? undefined : filter });
  };

  const handlePhoneFilterChange = (filter: string) => {
    setPhoneFilter(filter);
    // You can also update global filters if needed
    // updateFilters({ phoneStatus: filter === "all" ? undefined : filter });
  };

  const handleNewConversation = () => {
    // Implement new conversation logic
    console.log("New conversation clicked");
  };

  const handleSettings = () => {
    // Implement settings logic
    console.log("Settings clicked");
  };

  if (isLoadingConversations) {
    return (
      <div className="flex h-full border-r">
        <div className="w-16 border-r bg-gray-50/50 animate-pulse"></div>
        <div className="max-w-[30vw] flex-shrink-0 animate-pulse bg-gray-50/30"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full border-r">
      <PlatformList
        selectedPlatform={selectedPlatform}
        onPlatformChange={handlePlatformChange}
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
        onNewConversation={handleNewConversation}
        onSettings={handleSettings}
        employeeFilter={employeeFilter}
        onEmployeeFilterChange={handleEmployeeFilterChange}
        timeFilter={timeFilter}
        onTimeFilterChange={handleTimeFilterChange}
        phoneFilter={phoneFilter}
        onPhoneFilterChange={handlePhoneFilterChange}
      />
    </div>
  );
};

export default ConversationSidebar;
