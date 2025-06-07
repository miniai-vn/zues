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
import { Clock, Phone, Settings, Tag, Users } from "lucide-react";
import { Conversation } from "@/hooks/data/cs/useCS";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
  onTagDialog?: () => void;
  onParticipantDialog?: () => void;
}

export const ConversationItem = ({
  conversation,
  isSelected,
  onClick,
  onTagDialog,
  onParticipantDialog,
}: ConversationItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center w-full gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors border-l-2 group",
        isSelected ? "bg-accent border-l-primary" : "border-l-transparent"
      )}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={conversation.avatar} alt={conversation.avatar} />
          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
            {conversation.name?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm truncate">{conversation.name}</h3>
          <span className="text-xs text-muted-foreground">
            {/* Add timestamp formatting when available */}
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
              {conversation.unreadMessagesCount > 99
                ? "99+"
                : conversation.unreadMessagesCount}
            </Badge>
          )}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            <Settings className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Conversation Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onTagDialog}>
            <Tag className="h-4 w-4 mr-2" />
            Manage Tags
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onParticipantDialog}>
            <Users className="h-4 w-4 mr-2" />
            Add Participants
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Clock className="h-4 w-4 mr-2" />
            Set Reminder
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Phone className="h-4 w-4 mr-2" />
            Update Phone Status
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
