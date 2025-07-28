import TagManagementDialog from "@/components/tag-manager/DialogTag";
import { Conversation, useCS } from "@/hooks/data/cs/useCS";
import { useCsStore } from "@/hooks/data/cs/useCsStore";
import { useState } from "react";
import { ConversationFilter } from "./ConversationFilter";
import { ConversationList } from "./ConversationList";

interface ConversationColumnProps {
  selectedConversationId?: number;
  onSelectConversation: (conversationId?: number) => void;
}

export const ConversationColumn = ({
  selectedConversationId,
  onSelectConversation,
}: ConversationColumnProps) => {
  const { filters, updateFilters, markReadConversation } = useCS({});
  const { conversations } = useCsStore();
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [selectedConversationForDialog, setSelectedConversationForDialog] =
    useState<Conversation | null>(null);

  const handleOpenTagDialog = (conversation: Conversation) => {
    setSelectedConversationForDialog(conversation);
    setTagDialogOpen(true);
  };

  return (
    <div className="flex border-r">
      <div className="flex flex-col items-center justify-center max-w-[24vw] flex-shrink-0">
        <ConversationFilter filters={filters} onFiltersChange={updateFilters} />
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversationId={(conversationId?: number) => {
            onSelectConversation(conversationId);
            if (conversationId) {
              markReadConversation(conversationId);
            }
          }}
          onTagDialog={handleOpenTagDialog}
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
