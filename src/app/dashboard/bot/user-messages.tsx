import React from "react";

interface UserMessagesProps {
  messages: string;
  type: "assistance" | "user";
}

const UserMessages: React.FC<UserMessagesProps> = ({ messages, type }) => {
  return (
    <div
      className={`flex items-center ${
        type !== "user" ? "flex-row" : "flex-row-reverse float-right"
      }`}
    >
      {type === "assistance" && (
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
          Bot
        </div>
      )}
      <div className="ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
        {messages}
      </div>
      {type === "user" && (
        <div className="ml-3 flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
          User
        </div>
      )}
    </div>
  );
};

export default UserMessages;
