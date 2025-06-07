import React, { useState, useEffect } from "react";
import { Plus, X, Tag as TagIcon, Check } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import useTags, { Tag, TagType } from "@/hooks/data/cs/useTags";

interface TagManagementSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: number;
  currentTags: Tag[];
  onUpdateTags: (conversationId: number, tags: Tag[]) => void;
  shopId?: string;
}

const TagManagementSheet = ({
  open,
  onOpenChange,
  conversationId,
  currentTags = [],
  onUpdateTags,
  shopId = "",
}: TagManagementSheetProps) => {
  const {
    tags,
    isLoadingTags,
    createTag,
    isCreatingTag,
    createTagError,
    addTagsToConversation, // Add this method from useTags
    isAddingTagsToConversation, // Add loading state for adding tags
  } = useTags();

  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#6b7280");

  // Initialize selected tags from current tags
  useEffect(() => {
    console.log("Current tags:", currentTags);
    if (currentTags && currentTags.length > 0) {
      setSelectedTags(
        currentTags
          .map((tag) => tag?.id)
          .filter((id): id is number => id !== undefined)
      );
    }
  }, [currentTags]);

  const handleTagToggle = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;

    const createTagData: Tag = {
      name: newTagName.trim(),
      color: newTagColor,
      type: TagType.CONVERSATION,
    };

    createTag(createTagData, {
      onSuccess: (newTag) => {
        // Auto-select the newly created tag
        if (newTag.id) {
          setSelectedTags((prev) => [...prev, newTag.id!]);
        }
        setNewTagName("");
        setNewTagColor("#6b7280");
      },
    });
  };

  const handleSave = async () => {
    if (!addTagsToConversation) {
      console.error("addTagsToConversation method not available");
      return;
    }

    try {
      // Call the addTagsToConversation method with conversation ID and selected tag IDs
      await addTagsToConversation({
        conversationId,
        tagIds: selectedTags,
      });

      // If successful, update parent component
      if (onUpdateTags && tags) {
        const selectedTagObjects = tags.filter((tag) =>
          selectedTags.includes(tag.id as number)
        );
        onUpdateTags(conversationId, selectedTagObjects);
      }

      // Close the sheet
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save tags:", error);
      // Error handling is managed by the useTags hook
    }
  };

  const getTagById = (tagId: number) => {
    return tags?.find((tag) => tag.id === tagId);
  };

  const colorOptions = [
    "#ef4444", // red
    "#ec4899", // pink
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#3b82f6", // blue
    "#a855f7", // purple
    "#06b6d4", // cyan
    "#6b7280", // gray
    "#6366f1", // indigo
    "#14b8a6", // teal
    "#84cc16", // lime
  ];

  if (isLoadingTags) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Quản lý thẻ phân loại</SheetTitle>
          </SheetHeader>
          <div className="flex items-center justify-center h-40">
            <div className="text-sm text-muted-foreground">Đang tải...</div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Quản lý thẻ phân loại</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Current Tags */}
          <div>
            <h4 className="text-sm font-medium mb-3">
              Thẻ hiện tại ({selectedTags.length})
            </h4>
            {selectedTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tagId) => {
                  const tag = getTagById(tagId);
                  if (!tag) return null;

                  return (
                    <Badge
                      key={tagId}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: tag.color || "#6b7280" }}
                      />
                      {tag.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => handleTagToggle(tagId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Chưa có thẻ nào được chọn
              </p>
            )}
          </div>

          <Separator />

          {/* Available Tags */}
          <div>
            <h4 className="text-sm font-medium mb-3">Danh sách thẻ có sẵn</h4>
            <div className="space-y-2 max-h-20 overflow-y-auto">
              {tags?.map((tag) => (
                <Button
                  key={tag.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-between p-3 h-auto rounded-lg border",
                    selectedTags.includes(tag.id as number) &&
                      "bg-accent border-primary"
                  )}
                  onClick={() => handleTagToggle(tag.id as number)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tag.color || "#6b7280" }}
                    />
                    <span className="text-sm">{tag.name}</span>
                  </div>

                  {selectedTags.includes(tag.id as number) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Create New Tag */}
          <div>
            <h4 className="text-sm font-medium mb-3">Tạo thẻ mới</h4>
            <div className="space-y-3">
              <Input
                placeholder="Nhập tên thẻ mới..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreateTag()}
              />

              <div>
                <p className="text-xs text-muted-foreground mb-2">Chọn màu:</p>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <Button
                      key={color}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "w-6 h-6 p-0 rounded-full border-2",
                        newTagColor === color
                          ? "border-foreground"
                          : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewTagColor(color)}
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={handleCreateTag}
                disabled={!newTagName.trim() || isCreatingTag}
                className="w-full"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isCreatingTag ? "Đang tạo..." : "Tạo thẻ mới"}
              </Button>

              {createTagError && (
                <p className="text-sm text-red-500">
                  Lỗi tạo thẻ: {createTagError.message}
                </p>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <Button
              onClick={handleSave}
              className="w-full"
              disabled={isAddingTagsToConversation} // Disable while saving
            >
              <TagIcon className="h-4 w-4 mr-2" />
              {isAddingTagsToConversation ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TagManagementSheet;
