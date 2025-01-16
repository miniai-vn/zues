"use client";
import { useChat } from "@/hooks/data/useChat";
import { Message } from "postcss";
import { useState } from "react";
import ProductList from "./product-list";
import UserMessages from "./user-messages";

export default function Page() {
  const { sendMessage } = useChat();
  const [message, setMessages] = useState<string>("");
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const handleChat = async () => {
    try {
      setIsFetching(true);
      const data = await sendMessage(message);
      if (data) {
        setAllMessages(data);
      }
    } catch (error) {
      console.log(error);
      setIsFetching(false);
    } finally {
      setIsFetching(false);
    }
  };
  return (
    <div className="flex h-[82vh] antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col flex-auto h-full p-6">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
            <div className="flex flex-col h-full overflow-x-auto mb-4">
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-12 gap-y-2">
                  {allMessages?.map((message, index) => {
                    if (message.senderType === "assitance") {
                      return (
                        <>
                          <div
                            key={index}
                            className="col-start-1 col-end-8 p-3 rounded-lg"
                          >
                            <UserMessages
                              type="assitance"
                              messages={message.content}
                            />
                            <ProductList products={message.extraContent} />
                          </div>
                        </>
                      );
                    }
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <div
                        key={index}
                        className="col-start-6 col-end-13 p-3 rounded-lg"
                      >
                        <UserMessages type="user" messages={message.content} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
              <div>
                <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                  </svg>
                </button>
              </div>
              <div className="flex-grow ml-4">
                <div className="relative w-full">
                  <input
                    type="text"
                    onChange={(e) => setMessages(e.target.value as string)}
                    className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                  />
                  <button className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="ml-4">
                <button
                  onClick={handleChat}
                  className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                >
                  <span>Send</span>
                  <span className="ml-2">
                    <svg
                      className="w-4 h-4 transform rotate-45 -mt-px"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
