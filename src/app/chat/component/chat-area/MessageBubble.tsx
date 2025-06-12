import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, Clock, Reply, MoreHorizontal } from "lucide-react";
import { MessageStatus } from "./types";

interface MessageBubbleProps {
  content: string;
  timestamp: string;
  isOwnMessage: boolean;
  senderName?: string;
  senderAvatar?: string;
  status?: MessageStatus;
  isEdited?: boolean;
  showAvatar?: boolean;
  showSenderName?: boolean;
  onReply?: () => void;
  onMore?: () => void;
  className?: string;
}

export const MessageBubble = ({
  content,
  timestamp,
  isOwnMessage,
  senderName,
  senderAvatar,
  status = "sent",
  isEdited = false,
  showAvatar = true,
  showSenderName = true,
  onReply,
  onMore,
  className,
}: MessageBubbleProps) => {
  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = () => {
    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case "failed":
        return <Badge variant="destructive" className="text-xs">Failed</Badge>;
      default:
        return null;
    }
  };

  const defaultAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face";

  return (
    <div
      className={cn(
        "group flex gap-3 relative",
        isOwnMessage ? "justify-end" : "justify-start",
        className
      )}
    >
      {/* Left avatar for received messages */}
      {!isOwnMessage && showAvatar && (
        <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
          <AvatarImage src={senderAvatar ?? defaultAvatar} />
          <AvatarFallback>
            {senderName?.charAt(0)?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message content */}
      <div
        className={cn(
          "max-w-[70%] space-y-1 flex flex-col",
          isOwnMessage ? "items-end" : "items-start"
        )}
      >
        {/* Sender name for received messages */}
        {!isOwnMessage && showSenderName && senderName && (
          <p className="text-xs text-muted-foreground font-medium">
            {senderName}
          </p>
        )}
        
        {/* Message bubble with hover actions */}
        <div className="relative group/message">
          <div
            className={cn(
              "rounded-lg px-3 py-2 text-sm break-words relative",
              isOwnMessage
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            {content}
            
            {/* Hover actions */}
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 opacity-0 group-hover/message:opacity-100 transition-opacity flex gap-1",
                isOwnMessage ? "-left-20" : "-right-20"
              )}
            >
              {onReply && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 bg-background shadow-sm"
                  onClick={onReply}
                  title="Reply"
                >
                  <Reply className="h-3 w-3" />
                </Button>
              )}
              {onMore && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 bg-background shadow-sm"
                  onClick={onMore}
                  title="More options"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer with timestamp and status */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{formatMessageTime(timestamp)}</span>
          {isEdited && <span>• edited</span>}
          {isOwnMessage && getStatusIcon()}
        </div>
      </div>

      {/* Right avatar for sent messages */}
      {isOwnMessage && showAvatar && (
        <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
          <AvatarImage src={senderAvatar ?? defaultAvatar} />
          <AvatarFallback>
            {senderName?.charAt(0)?.toUpperCase() || "You"}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
