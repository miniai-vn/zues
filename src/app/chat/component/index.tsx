import { useState } from "react";
import ChatArea from "./ChatArea";
import { ConversationColumn } from "./conversation-sidebar";

const ConversationCsPage = () => {
  const [selectedConversationId, setSelectedConversation] = useState<number>();

  return (
    <div className="min-h-screen flex w-full bg-background">
      <div className="flex h-full border-r">
        <ConversationColumn
          selectedConversationId={selectedConversationId}
          onSelectConversation={(conversationId?: number) => {
            setSelectedConversation(conversationId);
          }}
        />
      </div>
      <ChatArea conversationId={selectedConversationId} />
    </div>
  );
};

export default ConversationCsPage;
