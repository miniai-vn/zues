"use client";
import { PlatformList } from "./conversation-sidebar/PlatformList";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BarChart2, Settings } from "lucide-react";

export const ChatSidebar = () => {
  const router = useRouter();

  return (
    <aside className="border-r flex flex-col justify-vertical h-full bg-gray-50/50 ">
      <PlatformList />
      <div className="p-2 border-b">
        <div className="flex flex-col gap-2 mt-4">
          <Button
            variant="ghost"
            size="icon"
            title="Chat Report"
            onClick={() => router.push("/chat/report")}
            className="w-full"
          >
            <BarChart2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Chat Settings"
            onClick={() => router.push("/chat/settings")}
            className="w-full"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </aside>
  );
};
