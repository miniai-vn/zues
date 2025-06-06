'use client";';
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import ChatArea from "./ChatArea";
import ConversationSidebar from "./ConversationSidebar";

const ChatLayout = () => {
  const [selectedConversationId, setSelectedConversation] = useState<number>();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ConversationSidebar
          selectedConversationId={selectedConversationId}
          onSelectConversationId={setSelectedConversation}
        />

        <ChatArea conversationId={selectedConversationId} />
      </div>
    </SidebarProvider>
  );
};

export default ChatLayout;
