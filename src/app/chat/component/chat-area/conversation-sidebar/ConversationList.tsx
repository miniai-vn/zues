import { Conversation } from "@/hooks/data/cs/useCS";
import { MessageCircle } from "lucide-react";
import { ConversationItem } from "./ConversationItem";
import { useRef, useEffect } from "react";

interface ConversationListProps {
  selectedConversationId?: number;
  onSelectConversationId: (conversationId?: number) => void;
  onTagDialog: (conversation: Conversation) => void;
  conversations?: Conversation[];
}

export const ConversationList = ({
  selectedConversationId,
  onSelectConversationId,
  onTagDialog,
  conversations = [],
  onLoadMore,
  hasMore,
}: ConversationListProps & { onLoadMore?: () => void; hasMore?: boolean }) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

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
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, onLoadMore]);

  const getEmptyStateMessage = () => {
    if (conversations && conversations.length === 0) {
      return {
        title: "No matching conversations",
        subtitle: "Try adjusting your filters",
      };
    }
    return {
      title: "No conversations yet",
      subtitle: "Messages will appear here when customers contact you",
    };
  };

  const emptyState = getEmptyStateMessage();

  return (
    <div className="w-full overflow-y-auto h-[64vh]">
      <div className="space-y-1 p-2">
        {conversations?.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground w-full">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium mb-1">{emptyState.title}</p>
            <p className="text-xs">{emptyState.subtitle}</p>
          </div>
        ) : (
          <>
            {conversations?.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversationId === conversation.id}
                onClick={() => onSelectConversationId(conversation.id)}
                onTagDialog={onTagDialog}
              />
            ))}
            {hasMore && (
              <div
                ref={loadMoreRef}
                className="py-4 text-center text-xs text-muted-foreground"
              >
                Đang tải thêm...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
