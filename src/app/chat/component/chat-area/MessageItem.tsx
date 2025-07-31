import { cn } from "@/lib/utils";
import { MessageAvatar } from "./MessageAvatar";
import { MessageContent } from "./MessageContent";
import { MessageReadReceipts } from "./MessageReadReceipts";
import { MessageTimestamp } from "./MessageTimestamp";
import { Message } from "@/hooks/data/cs/useMessage";

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
}

export const MessageItem = ({ message, isOwnMessage }: MessageItemProps) => {
  return (
    <div
      className={cn(
        "flex gap-3",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      {/* Left avatar for received messages */}
      {!isOwnMessage && (
        <MessageAvatar
          avatar={message.sender?.avatar}
          name={message.sender?.name}
        />
      )}

      {/* Message content */}
      <div
        className={cn(
          "max-w-[70%] space-y-1 flex flex-col",
          isOwnMessage ? "items-end" : "items-start"
        )}
      >
        {/* Message bubble */}
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-sm break-words",
            isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          <MessageContent
            contentType={message.contentType ?? ""}
            message={message}
            links={message.links}
            isOwner={isOwnMessage}
          />
        </div>

        {/* Timestamp and Read receipts */}
        <div className="flex items-center gap-1.5">
          <MessageTimestamp timestamp={message.createdAt} />
          <MessageReadReceipts readBy={message.readBy} />
        </div>
      </div>

      {/* Right avatar for sent messages */}
      {isOwnMessage && (
        <MessageAvatar
          avatar={message.sender?.avatar}
          name={message.sender?.name}
          isOwnMessage={true}
        />
      )}
    </div>
  );
};
