import { Message } from "@/hooks/data/cs/useCS";
import useTranslations from "@/hooks/useTranslations";
import { useEffect, useRef } from "react";
import { MessageItem } from "./MessageItem";
import { useAuth } from "@/hooks/data/useAuth";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  autoScroll?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const MessageList = ({
  messages,
  autoScroll = true,
  onLoadMore,
  hasMore,
}: MessageListProps) => {
  const { t } = useTranslations();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesTopRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth({});

  // Auto scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  // Infinite scroll lên trên
  useEffect(() => {
    if (!hasMore || !onLoadMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 1 }
    );
    if (messagesTopRef.current) {
      observer.observe(messagesTopRef.current);
    }
    return () => {
      if (messagesTopRef.current) {
        observer.unobserve(messagesTopRef.current);
      }
    };
  }, [hasMore, onLoadMore]);

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
    <div className="p-4 space-y-4 h-[78vh] max-h-[78vh] overflow-y-auto flex flex-col-reverse">
      <div ref={messagesEndRef} />
      {messages.map((message) => {
        const isOwnMessage =
          message.senderId === user?.id || message.senderType === "channel";
        return (
          <MessageItem
            key={message.id}
            message={message}
            isOwnMessage={isOwnMessage}
          />
        );
      })}
      <div ref={messagesTopRef} />
      {hasMore && (
        <div className="py-2 text-center text-xs text-muted-foreground">
          Đang tải thêm...
        </div>
      )}
    </div>
  );
};
