import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tag, TagType } from "@/hooks/data/cs/useTags";
import useTags from "@/hooks/data/cs/useTags";

interface TagManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId?: number;
  currentTags: Tag[];
  onUpdateTags: (conversationId: number, tags: Tag[]) => void;
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
  const [newTagColor, setNewTagColor] = useState("bg-gray-200");

  const {
    tags: availableTags = [],
    isLoadingTags,
    createTag,
    isCreatingTag,
    refetchTags,
  } = useTags();

  useEffect(() => {
    if (open) {
      setSelectedTags(currentTags);
    }
  }, [currentTags, open]);

  const colorOptions = [
    "bg-red-200",
    "bg-yellow-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-orange-200",
    "bg-cyan-200",
    "bg-gray-200",
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

  const handleAddNewTag = () => {
    if (!newTagName.trim()) return;

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

    // createTag(
    //   {
    //     name: newTagName.trim(),
    //     color: newTagColor,
    //     type: TagType.CONVERSATION,
    //   },
    //   {
    //     onSuccess: (newTag: Tag) => {
    //       setSelectedTags((prev) => [...prev, newTag]);
    //       setNewTagName("");
    //       setNewTagColor("bg-gray-200");

    //       refetchTags();
    //     },
    //   }
    // );
  };

  const handleSave = () => {
    if (conversationId === undefined) {
      console.error("Conversation ID is undefined. Cannot save tags.");
      onOpenChange(false);
      return;
    }

    onUpdateTags(conversationId, selectedTags);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedTags(currentTags);
    setNewTagName("");
    setNewTagColor("bg-gray-200");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Quản lý thẻ phân loại
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-3">
              Danh sách thẻ phân loại
            </h4>
            <div className="space-y-2">
              {isLoadingTags ? (
                <p className="text-sm text-gray-500">Đang tải...</p>
              ) : availableTags.length > 0 ? (
                availableTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className={`w-3 h-3 rounded-full ${tag.color}`} />
                      <span className="text-sm">{tag.name}</span>
                    </div>
                    {selectedTags.some(
                      (selectedTag) => selectedTag.id === tag.id
                    ) && (
                      <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-sm" />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Không có thẻ nào.</p>
              )}
            </div>
          </div>

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
                <p className="text-xs text-gray-500 mb-2">Chọn màu:</p>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded-full ${color} border-2 ${
                        newTagColor === color
                          ? "border-gray-800"
                          : "border-transparent"
                      }`}
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

          {selectedTags?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Thẻ đã chọn:</h4>
              <div className="flex flex-wrap gap-1">
                {selectedTags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="text-xs">
                    {tag.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => handleTagToggle(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button onClick={handleSave}>Lưu</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TagManagementDialog;
