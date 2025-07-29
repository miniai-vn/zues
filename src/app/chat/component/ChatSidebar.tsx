"use client";
import { PlatformList } from "./conversation-sidebar/PlatformList";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BarChart2, Settings } from "lucide-react";

export const ChatSidebar = () => {
  const router = useRouter();

  return (
    <div className="h-full  flex-col justify-evenly bg-gray-50">
      <div className="border-r w-full justify-between  h-full bg-gray-50/50 ">
        <PlatformList />
        <div className="p-2">
          <div className="flex flex-col gap-2 mt-4">
            <Button
              variant="ghost"
              size="icon"
              title="Chat Report"
              onClick={() => router.push("/chat/reports")}
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
      </div>
    </div>
  );
};
