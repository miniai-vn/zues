"use client";

import {
  Quote,
  Share2,
  MoreHorizontal,
  Copy,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageActionsProps {
  message: string;
  onShare: () => void;
  onCopy?: () => void;
  onRate?: () => void;
  onDelete?: () => void;
  positionClass?: string; // thêm prop này
}

export function MessageActions({
  message,
  onShare,
  onCopy,
  onRate,
  onDelete,
  positionClass = "left-full ml-2", // mặc định bên phải
}: MessageActionsProps) {
  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message);
    onCopy?.();
  };

  const handleRateMessage = () => {
    console.log("Rating message:", message);
    onRate?.();
  };

  const handleDeleteMessage = () => {
    console.log("Deleting message:", message);
    onDelete?.();
  };

  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${positionClass}`}
    >
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 hover:bg-gray-200 rounded-full"
      >
        <Quote className="h-2 w-2 text-gray-600" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 hover:bg-gray-200 rounded-full"
        onClick={onShare}
      >
        <Share2 className="h-2 w-2 text-gray-600" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-gray-200 rounded-full"
          >
            <MoreHorizontal className="h-2 w-2 text-gray-600" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleCopyMessage}>
            <Copy className="h-2 w-2 mr-2" />
            Copy tin nhắn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRateMessage}>
            <Star className="h-2 w-2 mr-2" />
            Đánh giá tin nhắn
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeleteMessage}
            className="text-red-600"
          >
            <Trash2 className="h-2 w-2 mr-2" />
            Xóa tin nhắn
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
