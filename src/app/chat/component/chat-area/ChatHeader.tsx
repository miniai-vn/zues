import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Info, MoreVertical } from "lucide-react";

interface ChatHeaderProps {
  conversationName?: string;
  conversationAvatar?: string;
  showContactInfo: boolean;
  onToggleContactInfo: () => void;
  onMoreOptions?: () => void;
  isGroup?: boolean;
  participantCount?: number;
}

export const ChatHeader = ({
  conversationName,
  conversationAvatar,
  showContactInfo,
  onToggleContactInfo,
  onMoreOptions,
  isGroup = false,
  participantCount = 0,
}: ChatHeaderProps) => {
  return (
    <div className="border-b p-4 flex items-center justify-between bg-background">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={conversationAvatar} />
          <AvatarFallback>
            {conversationName?.charAt(0)?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">
            {conversationName || "Unknown Conversation"}
          </h3>
          {isGroup && (
            <p className="text-sm text-muted-foreground">
              {participantCount} members
            </p>
          )}
          {!isGroup && (
            <p className="text-sm text-muted-foreground">Active now</p>
          )}
        </div>
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={onMoreOptions}
          title="More options"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onToggleContactInfo}
          className={cn(showContactInfo && "bg-accent")}
          title={showContactInfo ? "Hide contact info" : "Show contact info"}
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
