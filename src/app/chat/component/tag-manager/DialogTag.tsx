import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import useTags, { TagType } from "@/hooks/data/cs/useTags";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";

interface TagManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TagManagementDialog = ({
  open,
  onOpenChange,
}: TagManagementDialogProps) => {
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3b82f6");

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

  const handleAddNewTag = async () => {
    console.log("Adding new tag:", newTagName, newTagColor);
  };
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

  const handleCancel = () => {
    setNewTagName("");
    setNewTagColor("#3b82f6");
    onOpenChange(false);
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
                          "flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                        )}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: tag.color || "#6b7280" }}
                          />
                          <span className="text-sm truncate">{tag.name}</span>
                        </div>
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
                {isCreatingTag ? "Đang tạo..." : "Thêm tag"}
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          <Button>Lưu thay đổi</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TagManagementDialog;
