import { useState } from "react";
import ChatArea from "./ChatArea";
import { ConversationColumn } from "./conversation-sidebar";
import { useCsStore } from "@/hooks/data/cs/useCsStore";

const ConversationCsPage = () => {
  const [selectedConversationId, setSelectedConversation] = useState<number>();
  const { setSelectedConversationId } = useCsStore();
  return (
    <div className="flex w-full bg-background">
      <div className="flex h-full border-r">
        <ConversationColumn
          selectedConversationId={selectedConversationId}
          onSelectConversation={(conversationId?: number) => {
            setSelectedConversation(conversationId);
            setSelectedConversationId(conversationId as number);
          }}
        />
      </div>
      <ChatArea conversationId={selectedConversationId} />
    </div>
  );
};

export default ConversationCsPage;
