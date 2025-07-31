import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Conversation } from "@/hooks/data/cs/useCS";
import { useCsStore } from "@/hooks/data/cs/useCsStore";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { Circle, MoreHorizontal } from "lucide-react";

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
  const { setSelectedConversation } = useCsStore();
  const defaultAvatar =
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face";

  return (
    <div
      className={cn(
        "flex items-center p-3 hover:bg-chat-sidebar-hover transition-colors border-l-2 border-transparent group cursor-pointer",
        isSelected && "bg-chat-sidebar-hover border-l-chat-sidebar-active"
      )}
      onClick={() => {
        setSelectedConversation(conversation);
        onClick();
      }}
    >
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={conversation.avatar ?? defaultAvatar}
            alt={conversation.name}
          />
          <AvatarFallback>
            {conversation.name?.substring(0, 2) || "?"}
          </AvatarFallback>
        </Avatar>
        {true && (
          <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-green-500 text-green-500" />
        )}
      </div>

      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-chat-sidebar-foreground truncate">
            {conversation.name}
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground group-hover:hidden">
              {conversation.lastMessageAt
                ? dayjs(conversation.lastMessageAt).format("HH:mm")
                : ""}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hidden group-hover:flex items-center justify-center"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <MoreHorizontal
                onClick={() => onTagDialog(conversation)}
                className="h-3 w-3"
              />
            </Button>
            {conversation.unreadMessagesCount > 0 && (
              <Badge
                variant="default"
                className="h-5 w-5 rounded-full text-xs p-0 flex items-center justify-center bg-primary"
              >
                {conversation.unreadMessagesCount > 5
                  ? "5+"
                  : conversation.unreadMessagesCount}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground truncate">
            {conversation.content}
          </p>
          <span className="text-xs text-muted-foreground ml-2">
            {conversation.channel?.name || "No Channel"}
          </span>
        </div>
        {/* Channel and Tags */}
        <div className="flex items-center gap-1 mt-1">
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
    </div>
  );
};
