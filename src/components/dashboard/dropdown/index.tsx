"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import React from "react";
import { AlertDialogComponent } from "../alert-modal";

interface ActionDropdownProps {
  trigger?: React.ReactNode;
  onConfigure?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  children?: React.ReactNode;
  className?: string;
  deleteTitle?: string;
  deleteDescription?: string;
}

export default function ActionDropdown({
  trigger,
  onDelete,
  children,
  deleteTitle = "Xóa người dùng",
  deleteDescription = "Bạn có chắc chắn muốn xóa người dùng này không?",
}: ActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            <MoreVertical size={16} />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onSelect={(e) => e.preventDefault()} // Prevent dropdown from closing when clicking delete
        >
          {children}
        </DropdownMenuItem>
        {onDelete && (
          <AlertDialogComponent
            title={deleteTitle}
            description={deleteDescription}
            onConfirm={onDelete}
            onCancel={() => {}}
          >
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
              onSelect={(e) => e.preventDefault()} // Prevent dropdown from closing when clicking delete
            >
              <span>Xóa</span>
            </DropdownMenuItem>
          </AlertDialogComponent>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
