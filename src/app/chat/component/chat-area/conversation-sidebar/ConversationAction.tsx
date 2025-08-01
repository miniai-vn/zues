// "use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useTags from "@/hooks/data/cs/useTags";
import { MoreHorizontal } from "lucide-react";

interface ConversationsActionProps {
  conversationId: string;
  handleOpenTagDialog: () => void;
}
export default function ConversationsAction({
  conversationId,
  handleOpenTagDialog,
}: ConversationsActionProps) {
  const { tags, addTagsToConversation } = useTags({});
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>Ghim hội thoại</DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Phân loại</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {tags?.map((tag) => (
              <DropdownMenuItem
                onClick={() => {
                  if (conversationId) {
                    addTagsToConversation({
                      conversationId,
                      tagIds: [tag.id as number],
                    });
                  }
                }}
                key={tag.id}
                className="flex items-center gap-2"
              >
                <div
                  className="w-3 h-3"
                  style={{
                    background: tag.color,
                    clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                  }}
                />
                {tag.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleOpenTagDialog}>
              Quản lý thẻ phân loại
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem>Đánh dấu chưa đọc</DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500">
          Xóa hội thoại
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
