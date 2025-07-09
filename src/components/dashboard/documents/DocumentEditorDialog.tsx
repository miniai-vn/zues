"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RichEditor } from "@/components/ui/rich-editor";
import { TreeNode } from "@/components/dashboard/tables/tree-helpers";
import useTranslations from "@/hooks/useTranslations";

interface DocumentEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: TreeNode | null;
  content: string;
  onContentChange: (content: string) => void;
  onSave: (content: string) => void;
}

export const DocumentEditorDialog: React.FC<DocumentEditorDialogProps> = ({
  isOpen,
  onClose,
  document,
  content,
  onContentChange,
  onSave,
}) => {
  const { t } = useTranslations();

  const handleSave = () => {
    onSave(content);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t("dashboard.departments.detail.editResource")}: {document?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Type:</span> {document?.type}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                {document?.status}
              </div>
              <div>
                <span className="font-semibold">ID:</span> {document?.id}
              </div>
              <div>
                <span className="font-semibold">Created:</span>{" "}
                {document?.createdAt
                  ? new Date(document.createdAt).toLocaleDateString()
                  : "Unknown"}
              </div>
            </div>
          </div>

          <RichEditor
            content={content}
            editable={true}
            onChange={onContentChange}
            className="min-h-[400px]"
          />
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSave}>{t("common.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
