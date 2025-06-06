import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Settings } from "lucide-react";
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
}

export const ConversationListHeader = ({
  searchQuery,
  onSearchChange,
  filterStatus,
  onStatusChange,
  selectedPlatform,
  onNewConversation,
  onSettings,
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
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          className="pl-9"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
    </div>
  );
};
