import { Message } from "@/hooks/data/cs/useCS";
import useTranslations from "@/hooks/useTranslations";
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
  const { t } = useTranslations();
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
          <p className="text-sm">{t("dashboard.chat.noMessages")}</p>
          <p className="text-xs mt-1">
            {t("dashboard.chat.startConversation")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 h-[72vh] overflow-y-auto">
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
