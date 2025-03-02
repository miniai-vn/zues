"use client";
import { useChat } from "@/hooks/data/useChat";
import { useState } from "react";
import Controll from "./control";
import ChatMessages from "./ChatMessages";
import LoadingSpinner from "./LoadingSpinner";
import { ProtectedRoute, Role } from "@/configs/protect-route";

export enum sendType {
  user = "user",
  assistant = "assistant",
}

export default function Page() {
  const { sendMessage, messages, refetchFetchMessages } = useChat();
  const [message, setMessages] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handleChat = async () => {
    try {
      setIsFetching(true);
      await sendMessage(message);
    } catch (error) {
      setIsFetching(false);
      throw new Error(error);
    } finally {
      setIsFetching(false);
      refetchFetchMessages();
    }
  };
  return (
    <ProtectedRoute requiredRole={[Role.Manager, Role.Staff]}>
      <div className="flex h-[82vh] antialiased text-gray-800">
        <div className="flex flex-row h-full w-full overflow-x-hidden">
          <div className="flex flex-col flex-auto h-full p-6">
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
              <div className="flex flex-col h-full overflow-x-auto mb-4">
                <div className="flex flex-col h-full">
                  <ChatMessages allMessages={messages} />
                  {isFetching && <LoadingSpinner />}
                </div>
              </div>
              <Controll handleChat={handleChat} setMessages={setMessages} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
