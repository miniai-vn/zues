"use client";

import { AlertDialogComponent } from "@/components/dashboard/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useChat } from "@/hooks/data/useChat";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export function SideChat() {
  const { conversations, isLoading, deleteConversation, renameConversation } =
    useChat({});
  const { id: currentChatId } = useParams();
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState<string>("");
  if (isLoading || conversations?.length === 0) {
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
    <div className="">
      {conversations?.map((conversation) => {
        return (
          <div
            key={conversation.id}
            className={`flex justify-between group/item items-center group ${
              conversation.id == currentChatId
                ? "bg-gray-200 opacity-0.5"
                : "bg-transparent"
            } rounded-sm hover:bg-gray-100`}
          >
            <Link
              className="flex flex-1 truncate items-center px-2 pb-1.5 pt-1 text-sm rounded-sm"
              href={`/dashboard/chat/${conversation.id}`}
            >
              <span className="w-full">{conversation.name}</span>
            </Link>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover/item:opacity-100 transition-opacity"
                  tabIndex={-1}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-32 p-2" align="end" side="right">
                <button
                  className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                  onClick={() => {
                    setNewName(conversation.content);
                    setOpen(true);
                  }}
                >
                  Đổi tên
                </button>
                <AlertDialogComponent
                  children={
                    <button className="w-full text-left px-2 py-1 text-sm text-red-600 hover:bg-gray-100 rounded">
                      Xóa
                    </button>
                  }
                  description="
                        Bạn có chắc chắn muốn xóa hội thoại này không? Tất cả tin nhắn trong hội thoại này sẽ bị xóa vĩnh viễn"
                  title="
                        Xóa hội thoại 
                  "
                  onConfirm={() =>
                    deleteConversation(conversation.id as string)
                  }
                  onCancel={() => {}}
                ></AlertDialogComponent>
              </PopoverContent>
            </Popover>
            {/* Dialog đổi tên */}
            <Dialog
              open={open}
              onOpenChange={() => {
                setOpen(false);
              }}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Đổi tên hội thoại</DialogTitle>
                </DialogHeader>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nhập tên mới"
                />
                <DialogFooter>
                  <Button
                    onClick={() => {
                      renameConversation({
                        id: conversation.id as string,
                        name: newName,
                      });
                      setOpen(false);
                    }}
                    disabled={!newName.trim()}
                  >
                    Lưu
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      })}
    </div>
  );
}
