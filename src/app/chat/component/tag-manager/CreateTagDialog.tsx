import React, { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/lib/utils";
import useTags, { Tag, TagType } from "@/hooks/data/cs/useTags";

interface CreateTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTagCreated?: (tag: Tag) => void;
}

const CreateTagDialog = ({
  open,
  onOpenChange,
  onTagCreated,
}: CreateTagDialogProps) => {
  const { t } = useTranslations();
  const [tagName, setTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#000000");

  const { createTag, isCreatingTag } = useTags();

  const colorOptions = [
    "#000000",
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#F1C40F",
    "#E67E22",
    "#2ECC71",
    "#3498DB",
    "#9B59B6",
    "#34495E",
  ];

  const handleCreate = () => {
    if (!tagName.trim()) return;

    const createTagData: Tag = {
      name: tagName.trim(),
      color: selectedColor,
      type: TagType.CONVERSATION,
    };

    createTag(createTagData, {
      onSuccess: (newTag) => {
        if (onTagCreated) {
          onTagCreated(newTag);
        }

        // Reset form and close dialog
        setTagName("");
        setSelectedColor("#000000");
        onOpenChange(false);
      },
      onError: (error) => {
        console.error("Failed to create tag:", error);
        // Error is already handled by the useTags hook
      },
    });
  };

  const handleCancel = () => {
    setTagName("");
    setSelectedColor("#000000");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("createTagDialog.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tag-name">{t("createTagDialog.label.name")}</Label>
            <Input
              id="tag-name"
              placeholder={t("createTagDialog.input.placeholder")}
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCreate()}
              disabled={isCreatingTag}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("createTagDialog.label.color")}</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <Button
                  key={color}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-8 h-8 p-0 rounded-full border-2 hover:scale-110 transition-transform",
                    selectedColor === color
                      ? "border-foreground"
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  disabled={isCreatingTag}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isCreatingTag}
            >
              {t("createTagDialog.button.cancel")}
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!tagName.trim() || isCreatingTag}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isCreatingTag
                ? t("createTagDialog.button.creating")
                : t("createTagDialog.button.create")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTagDialog;
