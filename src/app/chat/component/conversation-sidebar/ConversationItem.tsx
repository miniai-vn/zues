import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Conversation } from "@/hooks/data/cs/useCS";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export const ConversationItem = ({
  conversation,
  isSelected,
  onClick,
}: ConversationItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors border-l-2",
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
    </div>
  );
};
