import { Message } from "@/hooks/data/cs/useCS";
import { useEffect, useRef } from "react";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  autoScroll?: boolean;
}

export const MessageList = ({
  messages,
  currentUserId,
  autoScroll = true,
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">No messages yet</p>
          <p className="text-xs mt-1">
            Start the conversation by sending a message
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 space-y-4 h-40 overflow-y-auto">
      {messages.map((message, index) => {
        const isOwnMessage = message.senderId === currentUserId;

        const previousMessage = index > 0 ? messages[index - 1] : null;
        const showSenderName =
          !isOwnMessage &&
          (!previousMessage || previousMessage.senderId !== message.senderId);

        return (
          <MessageItem
            key={message.id}
            message={message}
            isOwnMessage={isOwnMessage}
            showSenderName={showSenderName}
            senderName={message?.sender?.name}
            senderAvatar={message?.sender?.avatar}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
