"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Settings, Archive, Trash2 } from "lucide-react";

interface ActionPopoverProps {
  trigger?: React.ReactNode;
  onConfigure?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
}

export default function ActionPopover({
  trigger,
  onConfigure,
  onArchive,
  onDelete,
}: ActionPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            ...
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            className="flex items-center justify-start gap-2 w-full"
            onClick={onConfigure}
          >
            <Settings size={16} />
            <span>Cài đặt phân đoạn</span>
          </Button>

          <Button
            variant="ghost"
            className="flex items-center justify-start gap-2 w-full"
            onClick={onArchive}
          >
            <Archive size={16} />
            <span>Đồng bộ dữ liệu</span>
          </Button>

          <Button
            variant="ghost"
            className="flex items-center justify-start gap-2 w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onDelete}
          >
            <Trash2 size={16} />
            <span>Xóa</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
