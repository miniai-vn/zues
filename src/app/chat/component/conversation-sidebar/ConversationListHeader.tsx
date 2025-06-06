import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Settings } from "lucide-react";
import { Filter } from "lucide-react";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PLATFORMS } from "./PlatformList"; // Assuming PLATFORMS is exported from PlatformList or a shared file

interface ConversationListHeaderProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filterStatus: "all" | "unread" | "read";
  onStatusChange: (status: "all" | "unread" | "read") => void;
  selectedPlatform: string;
  onPlatformChange: (platformId: string) => void;
  onNewConversation?: () => void;
  onSettings?: () => void;
  // New filter props
  employeeFilter: string;
  onEmployeeFilterChange: (filter: string) => void;
  timeFilter: string;
  onTimeFilterChange: (filter: string) => void;
  phoneFilter: string;
  onPhoneFilterChange: (filter: string) => void;
}

const employeeTags = {
  "1": ["Support", "VIP"],
  "2": ["Sales", "New"],
  "3": ["Support"],
  "4": ["Sales", "VIP"],
};

const userPhoneStatus = {
  "2": true, // Giselle has phone
  "3": false, // Sun no phone
  "4": true, // Dương has phone
  "5": false, // Tranainu no phone
};

export const ConversationListHeader = ({
  searchQuery,
  onSearchChange,
  filterStatus,
  onStatusChange,
  selectedPlatform,
  onNewConversation,
  onSettings,
  employeeFilter,
  onEmployeeFilterChange,
  timeFilter,
  onTimeFilterChange,
  phoneFilter,
  onPhoneFilterChange,
}: ConversationListHeaderProps) => {
  const selectedPlatformData = PLATFORMS.find((p) => p.id === selectedPlatform);

  return (
    <div className="p-4 border-b w-full">
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

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          className="pl-9"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>

      {/* Status Filter */}
      {/* <div className="mb-3">
        <Select value={filterStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Messages</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
          </SelectContent>
        </Select>
      </div> */}

      {/* Advanced Filters */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Filters
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Select value={employeeFilter} onValueChange={onEmployeeFilterChange}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              <SelectItem value="Support">Support</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="VIP">VIP</SelectItem>
              <SelectItem value="New">New</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeFilter} onValueChange={onTimeFilterChange}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={phoneFilter} onValueChange={onPhoneFilterChange}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Phone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="has-phone">Has Phone</SelectItem>
              <SelectItem value="no-phone">No Phone</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
