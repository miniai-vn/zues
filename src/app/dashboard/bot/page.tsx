"use client";
import { useChat } from "@/hooks/data/useChat";
import { useState } from "react";
import Controll from "./control";
import UserMessages from "./user-messages";
enum sendType {
  user = "user",
  assitant = "assitant",
}
export default function Page() {
  const { sendMessage, mesages: allMessages, refetchFetchMessages } = useChat();
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
    <div className="flex h-[82vh] antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col flex-auto h-full p-6">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-12 gap-y-2 ">
                  {allMessages?.map((message, index) => {
                    if (message.senderType === sendType.assitant) {
                      return (
                        <div
                          key={index}
                          className="col-start-1 col-end-8 p-3 rounded-lg"
                        >
                          <UserMessages
                            type="assitance"
                            messages={message.content}
                          />
                        </div>
                      );
                    }
                    return (
                      <div
                        key={index}
                        className="col-start-6 col-end-13 p-3 rounded-lg float-right w-full"
                      >
                        <UserMessages type="user" messages={message.content} />
                      </div>
                    );
                  })}
                </div>
                {isFetching && (
                  <div className="flex justify-center items-center gap-2 dark:invert">
                    <span className="sr-only">Loading...</span>
                    <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 bg-black rounded-full animate-bounce"></div>
                  </div>
                )}
              </div>
            </div>
            <Controll handleChat={handleChat} setMessages={setMessages} />
          </div>
        </div>
      </div>
    </div>
  );
}
