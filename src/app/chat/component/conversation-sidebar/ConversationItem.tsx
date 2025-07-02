import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Conversation, useCS } from "@/hooks/data/cs/useCS";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Tag } from "lucide-react";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
  onTagDialog: (conversation: Conversation) => void;
}

export const ConversationItem = ({
  conversation,
  isSelected,
  onClick,
  onTagDialog,
}: ConversationItemProps) => {
  const { updateConversationStatusBot } = useCS();
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
        <div className="flex items-center justify-between w-full">
          <h3 className="font-medium text-sm truncate">{conversation.name}</h3>
        </div>

        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-muted-foreground truncate">
            {conversation.lastestMessage}
          </p>
          {conversation.unreadMessagesCount > 0 && (
            <Badge
              variant="destructive"
              className="h-5 w-5 flex items-center justify-center p-0 text-xs ml-2 min-w-5"
            >
              {conversation.unreadMessagesCount > 5
                ? "5+"
                : conversation.unreadMessagesCount}
            </Badge>
          )}
        </div>

        {/* Channel and Tags in one line */}
        <div className="flex items-center gap-1">
          {conversation.channel && (
            <span className="truncate flex items-center px-2 rounded-full text-xs max-w-20 text-slate-700 border border-slate-200 dark:text-slate-300">
              {conversation.channel.name}
            </span>
          )}
          {conversation.tags && conversation.tags.length > 0 && (
            <>
              {conversation.tags.slice(0, 3).map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color || "#6b7280" }}
                  />
                  <span className="truncate max-w-16 text-slate-700 dark:text-slate-300">
                    {tag.name}
                  </span>
                </div>
              ))}
              {conversation.tags.length > 3 && (
                <div className="flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  +{conversation.tags.length - 3}
                </div>
              )}
            </>
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
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onTagDialog(conversation)}>
            <Tag className="h-4 w-4 mr-2" />
            Manage Tags
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => updateConversationStatusBot(conversation.id)}
          >
            <Tag className="h-4 w-4 mr-2" />
            Toggle Bot
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
