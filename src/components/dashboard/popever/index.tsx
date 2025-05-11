"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Settings, Archive, Trash2, Pencil } from "lucide-react";
import { AlertDialogComponent } from "../alert-modal";

interface ActionPopoverProps {
  trigger?: React.ReactNode;
  onConfigure?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  children?: React.ReactNode;
  className?: string; // Thêm dòng này
}

export default function ActionPopover({
  trigger,
  onConfigure,
  onArchive,
  onDelete,
  onEdit,
  children,
  className = "w-56", // Thêm dòng này, mặc định là w-56
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
      <PopoverContent className={className} align="end">
        <div className="flex flex-col gap-1">
          {children}

          {onConfigure && (
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-2 w-full"
              onClick={onConfigure}
            >
              <Settings size={16} />
              <span>Cài đặt phân đoạn</span>
            </Button>
          )}

          {onArchive && (
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-2 w-full"
              onClick={onArchive}
            >
              <Archive size={16} />
              <span>Đồng bộ dữ liệu</span>
            </Button>
          )}

          {onEdit && (
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-2 w-full"
              onClick={onEdit}
            >
              <Pencil size={16} />
              <span>Chỉnh sửa</span>
            </Button>
          )}

          {onDelete && (
            <AlertDialogComponent
              title="Xóa người dùng"
              description="Bạn có chắc chắn muốn xóa người dùng này không?"
              onConfirm={onDelete}
              onCancel={() => {}}
            >
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-2 w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 size={16} />
                <span>Xóa</span>
              </Button>
            </AlertDialogComponent>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
