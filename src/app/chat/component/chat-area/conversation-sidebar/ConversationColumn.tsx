import TagManagementDialog from "@/components/tag-manager/DialogTag";
import { Conversation, useCS } from "@/hooks/data/cs/useCS";
import { useCsStore } from "@/hooks/data/cs/useCsStore";
import { useEffect, useState } from "react";
import { ConversationFilter } from "./ConversationFilter";
import { ConversationList } from "./ConversationList";

interface ConversationColumnProps {
  selectedConversationId?: string;
  onSelectConversation: (conversationId?: string) => void;
}

export const ConversationSidebar = ({
  selectedConversationId,
  onSelectConversation,
}: ConversationColumnProps) => {
  const [page, setPage] = useState(1);

  const {
    filters,
    updateFilters,
    isLoadingConversations,
    markReadConversation,
    stateConversations,
  } = useCS({
    queryParams: {
      page,
      limit: 10,
    },
  });
  const { conversations } = useCsStore();
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [selectedConversationForDialog, setSelectedConversationForDialog] =
    useState<Conversation | null>(null);
  const [hasMoreConversations, setHasMoreConversations] = useState(true);

  const handleOpenTagDialog = (conversation: Conversation) => {
    setSelectedConversationForDialog(conversation);
    setTagDialogOpen(true);
  };
  useEffect(() => {
    if (filters) {
      setPage(1);
      setHasMoreConversations(true);
    }
  }, [filters]);

  const handleLoadMoreConversations = () => {
    if (
      hasMoreConversations &&
      stateConversations?.hasNext &&
      !isLoadingConversations
    ) {
      setPage((prev) => prev + 1);
      setHasMoreConversations(stateConversations?.hasNext);
    }

    if (!stateConversations?.hasNext) {
      setHasMoreConversations(false);
    }
  };

  return (
    <div className="flex border-r">
      <div className="flex flex-col relative items-center justify-center w-64">
        <ConversationFilter filters={filters} onFiltersChange={updateFilters} />
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversationId={(conversationId?: string) => {
            onSelectConversation(conversationId);
            if (conversationId) {
              markReadConversation(conversationId);
            }
          }}
          onTagDialog={handleOpenTagDialog}
          onLoadMore={handleLoadMoreConversations}
          hasMore={hasMoreConversations}
        />

        <TagManagementDialog
          currentTags={selectedConversationForDialog?.tags || []}
          open={tagDialogOpen}
          onOpenChange={setTagDialogOpen}
          conversationId={selectedConversationForDialog?.id}
        />
      </div>
    </div>
  );
};
