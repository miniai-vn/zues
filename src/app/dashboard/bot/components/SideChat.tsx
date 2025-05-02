"use client";

import { useChat } from "@/hooks/data/useChat";
import Link from "next/link";
import { useParams } from "next/navigation";

export function SideChat() {
  const { conversations } = useChat({});
  const { id: currentChatId } = useParams(); // Get the current chat ID from the route
    return (
    <div className="px-2">
        <span className="px-2 py-1 text-xs">Hiện tại</span>
      {conversations?.map((conversation) => (
        <Link
          key={conversation.id}
          className={`flex items-center px-2 pb-1.5 pt-1 text-black text-sm rounded-lg ${
            conversation.id == currentChatId
              ? "bg-transparent bg-gray-300 "
              : "bg-transparent hover:bg-gray-100"
          }`}
          href={`/dashboard/bot/${conversation.id}`} // Link to the specific conversation
        >
          <span className="w-full truncate">{conversation.content}</span>
        </Link>
      ))}
    </div>
  );
}
