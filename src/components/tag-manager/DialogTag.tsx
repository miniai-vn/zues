import React, { useState, useEffect } from "react";
import { Plus, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tag, TagType } from "@/hooks/data/cs/useTags";
import useTags from "@/hooks/data/cs/useTags";
import { useCS } from "@/hooks/data/cs/useCS";
import { cn } from "@/lib/utils";

interface TagManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId?: string;
  currentTags: Tag[];
  onUpdateTags?: (conversationId?: string, tags: Tag[]) => void;
}

const TagManagementDialog = ({
  open,
  onOpenChange,
  conversationId,
  currentTags,
  onUpdateTags,
}: TagManagementDialogProps) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(currentTags);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3b82f6");

  const { fullInfoConversationWithMessages } = useCS({
    conversationId: conversationId,
  });

  const {
    tags: availableTags = [],
    isLoadingTags,
    createTag,
    isCreatingTag,
    refetchTags,
  } = useTags({
    queryParams: {
      type: TagType.CONVERSATION,
    },
  });

  const { addTagsToConversation } = useTags();

  // Use conversation tags if available, otherwise use prop tags
  const conversationTags =
    fullInfoConversationWithMessages?.tags || currentTags;

  useEffect(() => {
    if (open && conversationTags.length >= 0) {
      setSelectedTags(
        conversationTags.filter((tag: Tag) => tag.type === TagType.CONVERSATION)
      );
    }
  }, [conversationTags, open]);

  const colorOptions = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#6b7280", // gray
  ];

  const handleTagToggle = (tag: Tag) => {
    setSelectedTags((prev) => {
      const isSelected = prev.some((selectedTag) => selectedTag.id === tag.id);
      if (isSelected) {
        return prev.filter((selectedTag) => selectedTag.id !== tag.id);
      } else {
        return [...prev, tag];
      }
    });
  };

  const handleAddNewTag = async () => {
    if (!newTagName.trim()) return;

    // Check if tag already exists
    const existingTag = availableTags.find(
      (tag) => tag.name.toLowerCase() === newTagName.toLowerCase()
    );

    if (existingTag) {
      const isAlreadySelected = selectedTags.some(
        (tag) => tag.id === existingTag.id
      );
      if (!isAlreadySelected) {
        setSelectedTags((prev) => [...prev, existingTag]);
      }
      setNewTagName("");
      return;
    }

    // Create new tag
    try {
      await createTag(
        {
          name: newTagName.trim(),
          color: newTagColor,
          type: TagType.CONVERSATION,
        },
        {
          onSuccess: (newTag: Tag) => {
            setSelectedTags((prev) => [...prev, newTag]);
            setNewTagName("");
            setNewTagColor("#3b82f6");
            refetchTags();
          },
        }
      );
    } catch (error) {
      console.error("Failed to create tag:", error);
    }
  };

  const handleSave = () => {
    if (conversationId === undefined) {
      return;
    }
    addTagsToConversation({
      conversationId,
      tagIds: selectedTags.map((tag) => Number(tag.id)),
    });

    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedTags(conversationTags);
    setNewTagName("");
    setNewTagColor("#3b82f6");
    onOpenChange(false);
  };

  const isTagSelected = (tag: Tag) => {
    return selectedTags?.some((selectedTag) => selectedTag.id === tag.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[92vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Quản lý thẻ phân loại</DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-6 overflow-hidden">
          {/* Available Tags Section */}
          <div>
            <h4 className="text-sm font-medium mb-3">
              Danh sách thẻ phân loại ({availableTags.length})
            </h4>
            <ScrollArea className="h-48 border rounded-md">
              <div className="p-2 space-y-1">
                {isLoadingTags ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2 text-sm text-muted-foreground">
                      Đang tải...
                    </span>
                  </div>
                ) : availableTags.length > 0 ? (
                  availableTags.map((tag, index) => (
                    <div key={tag.id}>
                      <div
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors",
                          isTagSelected(tag) && "bg-accent"
                        )}
                        onClick={() => handleTagToggle(tag)}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: tag.color || "#6b7280" }}
                          />
                          <span className="text-sm truncate">{tag.name}</span>
                        </div>
                        {isTagSelected(tag) && (
                          <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      {index < availableTags.length - 1 && (
                        <Separator className="my-1" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Không có thẻ nào.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Create New Tag Section */}
          <div>
            <h4 className="text-sm font-medium mb-3">Tạo thẻ mới</h4>
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Nhập tên thẻ mới..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddNewTag()}
              />

              <div>
                <p className="text-xs text-muted-foreground mb-2">Chọn màu:</p>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 transition-all",
                        newTagColor === color
                          ? "border-primary scale-110"
                          : "border-border hover:border-primary/50"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewTagColor(color)}
                    />
                  ))}
                </div>
              </div>

              <Button
                size="sm"
                onClick={handleAddNewTag}
                disabled={isCreatingTag || !newTagName.trim()}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-1" />
                {isCreatingTag ? "Đang tạo..." : "Thêm phân loại"}
              </Button>
            </div>
          </div>

          {/* Selected Tags Section */}
          {selectedTags?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">
                Thẻ đã chọn ({selectedTags.length}):
              </h4>
              <ScrollArea className="max-h-20">
                <div className="flex flex-wrap gap-1 p-1">
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="text-xs flex items-center gap-1"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: tag.color || "#6b7280" }}
                      />
                      {tag.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1 hover:bg-transparent"
                        onClick={() => handleTagToggle(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={!conversationId}>
            Lưu thay đổi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TagManagementDialog;
