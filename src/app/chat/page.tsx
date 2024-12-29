"use client";

import { useChat } from "@/hooks/data/useChat";
import BotMessages from "./bot-messages";
import UserMessages from "./user-messages";

const ChatPage = () => {
  const { sendMessage, messsages } = useChat();

  return (
    <div className="w-full">
      {messsages?.map((message) => {
        if (message.isBot) {
          return (
            // eslint-disable-next-line react/jsx-key
            <div key={message?.id} className="grid pb-11">
              <div className="flex gap-2.5 mb-4 mt-2">
                <img
                  src="https://pagedone.io/asset/uploads/1710412177.png"
                  alt="Shanay image"
                  className="w-10 h-11"
                />
                <div className="grid">
                  <BotMessages
                    content={message.content}
                    time={message.createAt}
                  />
                </div>
              </div>
            </div>
          );
        } else {
          return (
            // eslint-disable-next-line react/jsx-key
            <div className="flex justify-end">
              <div className="">
                <div className="grid mb-2">
                  <UserMessages
                    content={message.content}
                    time={message.createAt}
                  />
                </div>
              </div>
              <img
                src="https://pagedone.io/asset/uploads/1704091591.png"
                alt="Hailey image"
                className="w-10 h-11"
              />
            </div>
          );
        }
      })}
      <div className="w-full pl-3 pr-1 py-1 rounded-3xl border border-gray-200 items-center gap-2 inline-flex justify-between">
        <div className="flex items-center gap-2">
          <input
            className="grow shrink basis-0 text-black text-xs font-medium leading-4 focus:outline-none"
            placeholder="Type here..."
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = e.target.value;
                if (value) {
                  sendMessage({ content: value });
                }
              }
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="items-center flex px-3 py-2 bg-indigo-600 rounded-full shadow ">
            <h3 className="text-white text-xs font-semibold leading-4 px-2">
              Send
            </h3>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
