import { Conversation, useCS } from "@/hooks/data/cs/useCS";
import { Tag } from "@/hooks/data/cs/useTags";
import { useState } from "react";
import TagManagementDialog from "../tag-manager/DialogTag";
import { ConversationList } from "./ConversationList";
import { ConversationListFooter } from "./ConversationListFooter";
import { ConversationListHeader } from "./ConversationListHeader";
import { PlatformList } from "./PlatformList";

interface ConversationColumnProps {
  selectedConversationId?: number;
  onSelectConversation: (conversationId?: number) => void;
}

export const ConversationColumn = ({
  selectedConversationId,
  onSelectConversation,
}: ConversationColumnProps) => {
  const { filters, updateFilters, conversations } = useCS({});
  console.log("conversations", conversations);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [selectedConversationForDialog, setSelectedConversationForDialog] =
    useState<Conversation | null>(null);

  const handleOpenTagDialog = (conversation: Conversation) => {
    setSelectedConversationForDialog(conversation);
    setTagDialogOpen(true);
  };

  return (
    <div className="flex h-full border-r">
      <PlatformList
        selectedChannel={filters.channelType}
        onSelectChannel={(channelType: string) =>
          updateFilters({ channelType })
        }
      />
      <div className="flex flex-col items-center justify-center min-w-[20vw] flex-shrink-0">
        <ConversationListHeader
          filters={filters}
          onFiltersChange={updateFilters}
        />

        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversationId={onSelectConversation}
          onTagDialog={handleOpenTagDialog}
        />

        {/* <TagManagementDialog
          open={tagDialogOpen}
          onOpenChange={setTagDialogOpen}
          conversationId={selectedConversationId}
        /> */}
      </div>
    </div>
  );
};
