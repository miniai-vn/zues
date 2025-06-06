import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Conversation, useCS } from "@/hooks/data/useCS";
import { cn } from "@/lib/utils";
import {
  Facebook,
  Filter,
  MessageCircle,
  Plus,
  Search,
  Settings,
  Store,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface ConversationSidebarProps {
  selectedConversationId?: number;
  onSelectConversationId: (conversationId: number) => void;
}

// Platform data structure
const PLATFORMS = [
  {
    id: "all",
    name: "All Platforms",
    icon: MessageCircle,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    unreadCount: 10,
    status: "Online",
    description: "All messages",
  },
  {
    id: "zalo",
    name: "Zalo OA",
    icon: Zap,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    unreadCount: 5,
    status: "Online",
    description: "Customer messages",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    unreadCount: 2,
    status: "Online",
    description: "Page messages",
  },
  {
    id: "shopee",
    name: "Shopee",
    icon: Store,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    unreadCount: 3,
    status: "Online",
    description: "New orders",
  },
];

const ConversationSidebar = ({
  // conversations,
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
      {/* Platform Column */}
      <div className="w-16 border-r bg-gray-50/50">
        <div className="p-2 border-b">
          <h3 className="font-semibold text-xs mb-2 text-center">Platforms</h3>
          <div className="space-y-2">
            {PLATFORMS.map((platform) => {
              const IconComponent = platform.icon;
              const isSelected = selectedPlatform === platform.id;

              return (
                <div
                  key={platform.id}
                  className={cn(
                    "relative flex items-center justify-center p-1 rounded-lg cursor-pointer transition-all duration-200 border",
                    isSelected
                      ? `${platform.bgColor} ${platform.borderColor} shadow-sm`
                      : "hover:bg-white border-transparent hover:border-gray-200"
                  )}
                  onClick={() => handlePlatformChange(platform.id)}
                  title={`${platform.name} - ${platform.description}`}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg flex items-center justify-center",
                      platform.bgColor
                    )}
                  >
                    <IconComponent className={cn("h-4 w-4", platform.color)} />
                  </div>

                  {/* Unread Count Badge */}
                  {platform.unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs min-w-4"
                    >
                      {platform.unreadCount > 99 ? "99+" : platform.unreadCount}
                    </Badge>
                  )}

                  {/* Status Indicator */}
                  <div
                    className={cn(
                      "absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white",
                      platform.status === "Online"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Official Account Section */}
        <div className="p-2">
          <div className="relative flex items-center justify-center p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              AI
            </div>

            {/* Total Unread Count */}
            {totalUnreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs min-w-4"
              >
                {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
              </Badge>
            )}

            {/* Online Status */}
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white" />
          </div>
        </div>
      </div>

      {/* Conversation Column */}
      <div className="flex flex-col items-center justify-center max-w-[20vw] flex-shrink-0">
        <div className="p-4 border-b w-full">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Messages</h2>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter Messages</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleStatusChange("all")}>
                    All Messages
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("unread")}
                  >
                    Unread Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("read")}>
                    Read Only
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="ghost">
                <Plus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-9"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {/* Filter Status Indicator */}
          {(filterStatus !== "all" || selectedPlatform !== "all") && (
            <div className="flex items-center gap-2 mt-2">
              {selectedPlatform !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  {PLATFORMS.find((p) => p.id === selectedPlatform)?.name}
                  <button
                    onClick={() => handlePlatformChange("all")}
                    className="ml-1 hover:bg-gray-300 rounded-full w-3 h-3 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filterStatus !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  {filterStatus === "unread" ? "Unread" : "Read"}
                  <button
                    onClick={() => handleStatusChange("all")}
                    className="ml-1 hover:bg-gray-300 rounded-full w-3 h-3 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto w-full">
          {/* Conversation List */}
          <div className="space-y-1 p-2">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium mb-1">
                  {searchQuery ||
                  filterStatus !== "all" ||
                  selectedPlatform !== "all"
                    ? "No matching conversations"
                    : "No conversations yet"}
                </p>
                <p className="text-xs">
                  {searchQuery ||
                  filterStatus !== "all" ||
                  selectedPlatform !== "all"
                    ? "Try adjusting your filters"
                    : "Messages will appear here when customers contact you"}
                </p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors border-l-2",
                    selectedConversationId === conversation.id
                      ? "bg-accent border-l-primary"
                      : "border-l-transparent"
                  )}
                  onClick={() => onSelectConversationId(conversation.id)}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          conversation.avatar ??
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                        }
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                        {conversation.name}
                      </AvatarFallback>
                    </Avatar>
                    {/* {conversation.isGroup && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.participants.length}
                      </div>
                    )} */}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm truncate">
                        {conversation.name}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {/* {formatTime(conversation.lastestMessage.timestamp)} */}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastestMessage}
                      </p>
                      {conversation.unreadMessagesCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="h-5 w-5 flex items-center justify-center p-0 text-xs ml-2 min-w-5"
                        >
                          {conversation.unreadMessagesCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="p-3 border-t bg-gray-50/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {conversations.length} of {conversations.length} conversations
            </span>
            {/* <span>
              {filteredConversations.reduce(
                (sum, conv) => sum + conv.unreadCount,
                0
              )}{" "}
              unread
            </span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationSidebar;
