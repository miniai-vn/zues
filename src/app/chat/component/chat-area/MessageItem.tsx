import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/hooks/data/useCS";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
  showSenderName?: boolean;
  senderName?: string;
  senderAvatar?: string;
}

export const MessageItem = ({
  message,
  isOwnMessage,
  showSenderName = true,
  senderName,
  senderAvatar,
}: MessageItemProps) => {
  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const defaultAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face";

  return (
    <div
      className={cn(
        "flex gap-3",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      {/* Left avatar for received messages */}
      {!isOwnMessage && (
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
        
        {/* Message bubble */}
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-sm break-words",
            isOwnMessage
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          )}
        >
          {message.content}
        </div>
        
        {/* Timestamp */}
        <p className="text-xs text-muted-foreground">
          {formatMessageTime(message.createdAt)}
        </p>
      </div>

      {/* Right avatar for sent messages */}
      {isOwnMessage && (
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
