"use client";

import { useChat } from "@/hooks/data/useChat";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export function SideChat() {
  const { conversations, isLoading } = useChat({});
  const { id: currentChatId } = useParams();
  if (isLoading) {
    return (
      <div className="px-2">
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="flex items-center pb-1.5 pt-1 text-sm rounded-lg mb-1"
            >
              <Skeleton className="h-5 w-full" />
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="px-2">
      {conversations?.map((conversation) => (
        <Link
          key={conversation.id}
          className={`flex items-center px-2 pb-1.5 pt-1 text-sm rounded-sm ${
            conversation.id == currentChatId
              ? "bg-gray-200 "
              : "bg-transparent hover:bg-gray-100"
          }`}
          href={`/dashboard/chat/${conversation.id}`}
        >
          <span className="w-full truncate">{conversation.content}</span>
        </Link>
      ))}
    </div>
  );
}
