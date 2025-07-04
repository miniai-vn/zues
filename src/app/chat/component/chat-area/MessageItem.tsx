import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/hooks/data/cs/useCS";
import useTranslations from "@/hooks/useTranslations";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
}

export const MessageItem = ({ message, isOwnMessage }: MessageItemProps) => {
  const { t } = useTranslations();

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const defaultAvatar =
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face";

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
          <AvatarImage src={message.sender?.avatar ?? defaultAvatar} />
          <AvatarFallback>
            {message.sender?.name?.charAt(0)?.toUpperCase() || "?"}
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
        {/* {!isOwnMessage && (
          <p className="text-xs text-muted-foreground font-medium">
            {message.sender?.name}
          </p>
        )} */}

        {/* Message bubble */}
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-sm break-words",
            isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          {message.content !== ""
            ? message.content
            : "Tin nhắn chưa được hỗ trợ hiển thị."}
        </div>

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground">
          {formatMessageTime(message.createdAt)}
        </p>
      </div>

      {/* Right avatar for sent messages */}
      {isOwnMessage && (
        <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
          <AvatarImage src={message.sender?.avatar ?? defaultAvatar} />
          <AvatarFallback>
            {message.sender?.name?.charAt(0)?.toUpperCase() ||
              t("dashboard.chat.you")}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
