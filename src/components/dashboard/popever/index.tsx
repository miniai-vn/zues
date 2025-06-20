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
import useTranslations from "@/hooks/useTranslations";

interface ActionPopoverProps {
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

export default function ActionPopover({
  trigger,
  onConfigure,
  onArchive,
  onDelete,
  onEdit,
  children,
  className = "w-56",
  deleteTitle,
  deleteDescription,
}: ActionPopoverProps) {
  const { t } = useTranslations();

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
              <span>{t("dashboard.departments.detail.segmentDocument")}</span>
            </Button>
          )}

          {onArchive && (
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-2 w-full"
              onClick={onArchive}
            >
              <Archive size={16} />
              <span>{t("dashboard.departments.detail.trainAI")}</span>
            </Button>
          )}

          {onEdit && (
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-2 w-full"
              onClick={onEdit}
            >
              <Pencil size={16} />
              <span>{t("common.edit")}</span>
            </Button>
          )}

          {onDelete && (
            <AlertDialogComponent
              title={deleteTitle || t("common.delete")}
              description={deleteDescription || t("common.confirmDelete")}
              onConfirm={onDelete}
              onCancel={() => {}}
            >
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-2 w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 size={16} />
                <span>{t("common.delete")}</span>
              </Button>
            </AlertDialogComponent>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
