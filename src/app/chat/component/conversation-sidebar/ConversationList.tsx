import { Conversation } from "@/hooks/data/cs/useCS";
import { MessageCircle } from "lucide-react";
import { ConversationItem } from "./ConversationItem";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: number;
  onSelectConversation: (conversationId: number) => void;
  hasActiveFilters: boolean;
  searchQuery: string;
  filterStatus: "all" | "unread" | "read";
  selectedPlatform: string;
  onTagDialog?: (conversation: Conversation) => void;
  onParticipantDialog?: (conversation: Conversation) => void;
}

export const ConversationList = ({
  selectedConversationId,
  onSelectConversation,
  hasActiveFilters,
  conversations,
  onTagDialog,
  onParticipantDialog,
}: ConversationListProps) => {
  const getEmptyStateMessage = () => {
    if (hasActiveFilters) {
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
    <div className="flex-1 w-full overflow-y-auto">
      <div className="space-y-1 p-2">
        {conversations.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium mb-1">{emptyState.title}</p>
            <p className="text-xs">{emptyState.subtitle}</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversationId === conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              onTagDialog={onTagDialog ? () => onTagDialog(conversation) : undefined}
              onParticipantDialog={onParticipantDialog ? () => onParticipantDialog(conversation) : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
};
