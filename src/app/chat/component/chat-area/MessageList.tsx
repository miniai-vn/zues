import { Message } from "@/hooks/data/cs/useMessage";
import { useAuth } from "@/hooks/data/useAuth";
import useTranslations from "@/hooks/useTranslations";
import { useEffect, useRef } from "react";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  autoScroll?: boolean;
  onLoadMore?: (scrollState: string) => void;
  hasMore?: boolean;
  onShare?: (status: boolean, messageId: string) => void; // Optional prop for share action
}

export const MessageList = ({
  messages,
  autoScroll = true,
  onLoadMore,
  hasMore,
  onShare = () => {},
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

  // Infinite scroll lên trên và xuống dưới
  useEffect(() => {
    if (!hasMore || !onLoadMore) return;

    const topObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // onLoadMore("top");
        }
      },
      { threshold: 1 }
    );

    const bottomObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // console.log("Loading more messages at the bottom");
          // onLoadMore("bottom");
        }
      },
      { threshold: 1 }
    );

    if (messagesTopRef.current) {
      topObserver.observe(messagesTopRef.current);
    }
    if (messagesEndRef.current) {
      bottomObserver.observe(messagesEndRef.current);
    }

    return () => {
      if (messagesTopRef.current) {
        topObserver.unobserve(messagesTopRef.current);
      }
      if (messagesEndRef.current) {
        bottomObserver.unobserve(messagesEndRef.current);
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
    <div className={`p-4 space-y-4 flex flex-col-reverse`}>
      <div ref={messagesEndRef} />
      {messages.map((message) => {
        const isOwnMessage =
          message.senderId === user?.id || message.senderType === "channel";
        return (
          <MessageItem
            onShare={onShare}
            key={message.id}
            message={message}
            isOwnMessage={isOwnMessage}
          />
        );
      })}
      {hasMore && <div ref={messagesTopRef} />}

      {hasMore && (
        <div className="py-2 text-center text-xs text-muted-foreground"></div>
      )}
    </div>
  );
};
