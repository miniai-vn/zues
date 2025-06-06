interface ConversationListFooterProps {
  totalConversations: number;
  displayedConversations: number;
  totalUnread?: number;
}

export const ConversationListFooter = ({
  totalConversations,
  displayedConversations,
  totalUnread,
}: ConversationListFooterProps) => {
  return (
    <div className="p-3 border-t bg-gray-50/50">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {displayedConversations} of {totalConversations} conversations
        </span>
        {totalUnread !== undefined && totalUnread > 0 && (
          <span>
            {totalUnread} unread
          </span>
        )}
      </div>
    </div>
  );
};
