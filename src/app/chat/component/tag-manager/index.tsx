import React, { useState, useEffect } from "react";
import { Plus, X, Tag as TagIcon, Check } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import useTags, { Tag, TagType } from "@/hooks/data/cs/useTags";
import CreateTagDialog from "./CreateTagDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
}: TagManagementSheetProps) => {
  const {
    tags,
    isLoadingTags,
    addTagsToConversation,
    isAddingTagsToConversation,
  } = useTags();

  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [showCreateTagDialog, setShowCreateTagDialog] = useState(false);

  useEffect(() => {
    if (currentTags && currentTags.length > 0) {
      const uniqueTagIds = Array.from(
        new Set(
          currentTags
            .map((tag) => tag?.id)
            .filter((id): id is number => id !== undefined)
        )
      );
      setSelectedTags(uniqueTagIds);
    } else {
      setSelectedTags([]);
    }
  }, [currentTags]);

  const handleTagToggle = (tagId: number) => {
    setSelectedTags((prev) => {
      const uniquePrev = Array.from(new Set(prev));

      if (uniquePrev.includes(tagId)) {
        return uniquePrev.filter((id) => id !== tagId);
      } else {
        return [...uniquePrev, tagId];
      }
    });
  };

  const handleTagCreated = (newTag: Tag) => {
    // Auto-select the newly created tag
    if (newTag.id) {
      setSelectedTags((prev) => {
        const uniquePrev = Array.from(new Set(prev));
        if (!uniquePrev.includes(newTag.id!)) {
          return [...uniquePrev, newTag.id!];
        }
        return uniquePrev;
      });
    }
  };

  const getUniqueSelectedTags = () => {
    return Array.from(new Set(selectedTags));
  };

  const handleSave = async () => {
    if (!addTagsToConversation) {
      console.error("addTagsToConversation method not available");
      return;
    }
    try {
      const uniqueSelectedTags = getUniqueSelectedTags();

      await addTagsToConversation({
        conversationId,
        tagIds: uniqueSelectedTags,
      });

      if (onUpdateTags && tags) {
        const selectedTagObjects = tags.filter((tag) =>
          uniqueSelectedTags.includes(tag.id as number)
        );
        onUpdateTags(conversationId, selectedTagObjects);
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save tags:", error);
    }
  };

  const getTagById = (tagId: number) => {
    return tags?.find((tag) => tag.id === tagId);
  };

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
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-[600px] sm:w-[700px]">
          {" "}
          {/* Increased width for side-by-side layout */}
          <SheetHeader>
            <SheetTitle>Quản lý thẻ phân loại</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 mt-6">
            {/* Current Tags */}
            <div>
              <h4 className="text-sm font-medium mb-3">
                Thẻ hiện tại ({getUniqueSelectedTags().length})
              </h4>
              {getUniqueSelectedTags().length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {getUniqueSelectedTags().map((tagId) => {
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

            {/* Available Tags and Create Tag Section - Side by Side */}
            <div className="gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">Danh sách thẻ có sẵn</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowCreateTagDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Tạo mới
                  </Button>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {tags
                    ?.filter((tag) => tag.type == "customer")
                    ?.map((tag) => (
                      <Button
                        key={tag.id}
                        variant="ghost"
                        className={cn(
                          "w-full justify-between p-3 h-auto rounded-lg border",
                          getUniqueSelectedTags().includes(tag.id as number) &&
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

                        {getUniqueSelectedTags().includes(tag.id as number) && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </Button>
                    ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <Button
                onClick={handleSave}
                className="w-full"
                disabled={isAddingTagsToConversation}
              >
                <TagIcon className="h-4 w-4 mr-2" />
                {isAddingTagsToConversation ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <CreateTagDialog
        open={showCreateTagDialog}
        onOpenChange={setShowCreateTagDialog}
        onTagCreated={handleTagCreated}
      />
    </>
  );
};

export default TagManagementSheet;
