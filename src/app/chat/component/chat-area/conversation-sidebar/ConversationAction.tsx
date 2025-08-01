"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useTags from "@/hooks/data/cs/useTags";
import { MoreHorizontal } from "lucide-react";

export default function ConversationsAction() {
  const { tags } = useTags({});
  console.log("Tags:", tags);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>Ghim hội thoại</DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Phân loại</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem className="flex items-center gap-2">
              <div
                className="w-3 h-3"
                style={{
                  background: "#ef4444", // đỏ
                  clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                }}
              />
              Khách hàng
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <div
                className="w-3 h-3"
                style={{
                  background: "#d946ef", // tím hồng
                  clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                }}
              />
              Gia đình
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <div
                className="w-3 h-3"
                style={{
                  background: "#f59e42", // vàng cam
                  clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                }}
              />
              Bạn bè
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <div
                className="w-3 h-3"
                style={{
                  background: "#fb923c", // cam
                  clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                }}
              />
              Công việc
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <div
                className="w-3 h-3"
                style={{
                  background: "#22c55e", // xanh lá
                  clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                }}
              />
              Trả lời sau
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <div
                className="w-3 h-3"
                style={{
                  background: "#3b82f6", // xanh dương
                  clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                }}
              />
              Đồng nghiệp
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <div
                className="w-3 h-3"
                style={{
                  background: "#b91c1c", // đỏ đậm
                  clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                }}
              />
              Nhóm học
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Quản lý thẻ phân loại</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem>Đánh dấu chưa đọc</DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500">
          Xóa hội thoại
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
