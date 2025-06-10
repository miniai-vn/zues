"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ConversationQueryParams } from "@/hooks/data/cs/useCS";
import useTags, { TagType } from "@/hooks/data/cs/useTags";
import { useUsersWithCs } from "@/hooks/data/cs/useUser";
import { cn } from "@/lib/utils";
import { Clock, Phone, Plus, Search, Settings, Tag, User } from "lucide-react";
import { useState } from "react";

interface ConversationFilterProps {
  filters: ConversationQueryParams;
  onFiltersChange: (filters: Partial<ConversationQueryParams>) => void;
  onNewConversation?: () => void;
  onSettings?: () => void;
}

export const ConversationFilter = ({
  filters,
  onFiltersChange,
  onNewConversation,
  onSettings,
}: ConversationFilterProps) => {
  const [activeTab, setActiveTab] = useState(filters.type || "all");

  const { tags } = useTags({
    queryParams: {
      type: TagType.CONVERSATION,
    },
  });

  const { users } = useUsersWithCs({});

  const handleTabChange = (tab: "all" | "unread" | "read") => {
    setActiveTab(tab);
    onFiltersChange({ type: tab });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ search: event.target.value });
  };

  const handleEmployeeToggle = (userId: string) => {
    const currentFilter = filters.participantUserIds || [];
    const isSelected = currentFilter.includes(userId);

    if (isSelected) {
      onFiltersChange({
        participantUserIds: currentFilter.filter((id) => id !== userId),
      });
    } else {
      onFiltersChange({
        participantUserIds: [...currentFilter, userId],
      });
    }
  };

  const handleSelectAllEmployees = () => {
    const currentFilter = filters.participantUserIds || [];

    if (currentFilter.length === users?.length) {
      onFiltersChange({ participantUserIds: [] });
    } else {
      onFiltersChange({
        participantUserIds: users?.map((user) => user.id.toString()) || [],
      });
    }
  };

  const handlePhoneFilterChange = (phoneFilter: string) => {
    onFiltersChange({ phoneFilter });
  };

  const handleTagChange = (tagId?: number) => {
    onFiltersChange({
      tagId: Number(tagId),
    });
  };

  const handleDateRangeChange = (dateRange: any) => {
    onFiltersChange({ dateRange });
  };

  return (
    <div className="border-b w-full">
      {/* Header Section */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Messages</h2>
          <div className="flex gap-1">
            {onNewConversation && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onNewConversation}
                className="p-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            {onSettings && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onSettings}
                className="p-2"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9"
            value={filters.search || ""}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Filters Section */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 mb-3">
          {/* Phone Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-7 text-xs gap-1",
                  filters.phoneFilter !== "all" &&
                    "bg-primary/10 border-primary text-primary"
                )}
              >
                <Phone className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => handlePhoneFilterChange("all")}>
                Tất cả
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handlePhoneFilterChange("has-phone")}
              >
                Có số điện thoại
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handlePhoneFilterChange("no-phone")}
              >
                Không có số
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tag Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-7 text-xs gap-1",
                  filters.tagId && "bg-primary/10 border-primary text-primary"
                )}
              >
                <Tag className="h-3 w-3" />
                {!!filters.tagId && (
                  <span className="ml-1">
                    ({tags?.find((tag) => tag.id === filters.tagId)?.name})
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-48 max-h-80 overflow-y-auto"
            >
              {/* Add "All" option to clear tag filter */}
              <DropdownMenuItem
                onClick={() => handleTagChange(undefined)}
                className={cn(
                  "flex items-center gap-2",
                  !filters.tagId && "bg-accent"
                )}
              >
                Tất cả
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {tags?.map((tag) => (
                <DropdownMenuItem
                  key={tag.id}
                  onClick={() => handleTagChange(tag.id)}
                  className={cn(
                    "flex items-center gap-2",
                    filters.tagId === tag.id && "bg-accent"
                  )}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color || "#gray" }}
                  />
                  <span className="truncate">{tag.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-7 text-xs gap-1",
                  filters.dateRange &&
                    (filters.dateRange.from || filters.dateRange.to) &&
                    "bg-primary/10 border-primary text-primary"
                )}
              >
                <Clock className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange?.from}
                selected={filters.dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Employee Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-7 text-xs gap-1",
                  (filters.participantUserIds?.length || 0) > 0 &&
                    "bg-primary/10 border-primary text-primary"
                )}
              >
                <User className="h-3 w-3" />
                {(filters.participantUserIds?.length || 0) > 0 && (
                  <span className="ml-1">
                    ({filters.participantUserIds?.length})
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-64 max-h-80 overflow-y-auto"
            >
              <div className="p-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id="select-all"
                    checked={
                      (filters.participantUserIds?.length || 0) ===
                        users?.length && (users?.length || 0) > 0
                    }
                    onCheckedChange={handleSelectAllEmployees}
                  />
                  <label
                    htmlFor="select-all"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Chọn tất cả
                  </label>
                </div>
                <DropdownMenuSeparator />
                <div className="space-y-2 mt-2">
                  {users?.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={(filters.participantUserIds || []).includes(
                          user.id.toString()
                        )}
                        onCheckedChange={() =>
                          handleEmployeeToggle(user.id.toString())
                        }
                      />
                      <label
                        htmlFor={`user-${user.id}`}
                        className="text-sm cursor-pointer flex-1 truncate"
                      >
                        {user.name || user.email}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b -mb-px">
          <button
            className={cn(
              "px-3 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === "all"
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            )}
            onClick={() => handleTabChange("all")}
          >
            Tất cả
          </button>
          <button
            className={cn(
              "px-3 py-2 text-sm font-medium border-b-2 transition-colors ml-4",
              activeTab === "unread"
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            )}
            onClick={() => handleTabChange("unread")}
          >
            Chưa đọc
          </button>
          <button
            className={cn(
              "px-3 py-2 text-sm font-medium border-b-2 transition-colors ml-4",
              activeTab === "read"
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            )}
            onClick={() => handleTabChange("read")}
          >
            Đã đọc
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationFilter;
