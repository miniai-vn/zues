import { cn } from "@/lib/utils";
import {
  Heart,
  Share2,
  MoreHorizontal,
  Copy,
  Star,
  Trash2,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { ShareDialog } from "./ShareDialog";
import { MessageActions } from "./MessageActions";
import { useCsStore } from "@/hooks/data/cs/useCsStore";
import { Message } from "@/hooks/data/cs/useMessage";

interface MessageContentProps {
  contentType: string;
  message?: Message;
  links?: string[];
  timestamp?: string;
  isOwner?: boolean; // Thêm prop này
}

export const MessageContent = ({
  contentType,
  message,
  links,
  timestamp,
  isOwner = false, // Mặc định là false
}: MessageContentProps) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const { selectedConversationId, setSelectedQuote } = useCsStore();
  // UI for image, sticker, file, or default text
  const renderContent = () => {
    switch (contentType) {
      case "image": {
        if (links && links.length > 0) {
          return (
            <div
              className={cn(
                "space-y-2",
                links.length > 1 ? "grid grid-cols-2 gap-2" : ""
              )}
            >
              {links.map((imgUrl, idx) => (
                <div key={imgUrl + "-" + idx} className="relative group">
                  <img
                    src={imgUrl}
                    alt={`Shared image ${idx + 1}`}
                    className="max-w-full h-auto cursor-pointer rounded-2xl max-h-64 object-cover border"
                    onClick={() => window.open(imgUrl, "_blank")}
                  />
                  {/* Action buttons on hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 hover:bg-gray-200 rounded-full"
                    >
                      <Quote className="h-3.5 w-3.5 text-gray-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 hover:bg-gray-200 rounded-full"
                      onClick={() => setIsShareOpen(true)}
                    >
                      <Share2 className="h-3.5 w-3.5 text-gray-600" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-gray-200 rounded-full"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5 text-gray-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy ảnh
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Star className="h-4 w-4 mr-2" />
                          Đánh giá ảnh
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa ảnh
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          );
        }
        return (
          <div className="text-muted-foreground text-sm italic">
            📷 Image not available
          </div>
        );
      }

      case "sticker": {
        if (links && links.length > 0) {
          return (
            <div className="flex gap-2">
              {links.map((stickerUrl, idx) => (
                <img
                  key={stickerUrl + "-" + idx}
                  src={stickerUrl}
                  alt={`Sticker ${idx + 1}`}
                  className="w-16 h-16 object-contain cursor-pointer rounded-2xl border"
                  onClick={() => window.open(stickerUrl, "_blank")}
                />
              ))}
            </div>
          );
        }
        return (
          <div className="text-muted-foreground text-sm italic">
            😊 Sticker not available
          </div>
        );
      }

      case "file": {
        if (links && links.length > 0) {
          return (
            <div className="space-y-2">
              {links.map((fileUrl, idx) => {
                const getFileName = (url: string) => {
                  const cleanUrl = url.split("?")[0];
                  const urlParts = cleanUrl.split("/");
                  return urlParts[urlParts.length - 1] || `File_${idx + 1}`;
                };
                const fileName = getFileName(fileUrl);

                return (
                  <div
                    key={fileUrl + "-" + idx}
                    className="flex items-center gap-2 p-2 border rounded-2xl bg-background"
                  >
                    <div className="flex-shrink-0">📎</div>
                    <a
                      href={fileUrl}
                      download={fileName}
                      className="text-xs text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-sm font-medium truncate">
                        {fileName}
                      </span>
                    </a>
                  </div>
                );
              })}
            </div>
          );
        }
        return (
          <div className="text-muted-foreground text-sm italic">
            📎 File not available
          </div>
        );
      }

      default:
        return (
          <div className="group relative">
            <p className="text-sm text-gray-900 break-words">
              {message?.content !== ""
                ? message?.content
                : "Tin nhắn chưa được hỗ trợ hiển thị."}
            </p>
            <MessageActions
              message={message?.content || ""}
              onShare={() => setIsShareOpen(true)}
              onQuote={() => {
                setSelectedQuote(selectedConversationId as string, {
                  id: message?.id as string,
                  content: message?.content as string,
                  authorId: message?.sender?.id as string,
                  createdAt: message?.createdAt as string,
                });
              }}
              positionClass={isOwner ? "right-full mr-2" : "left-full ml-2"}
            />
          </div>
        );
    }
  };

  return (
    <div className="relative group">
      {/* Nội dung message hoặc media */}
      {renderContent()}

      {/* Timestamp và nút heart dưới bubble */}
      {timestamp && (
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-gray-500">{timestamp}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-gray-200 rounded-full"
          >
            <Heart className="h-2 w-2 text-gray-400" />
          </Button>
        </div>
      )}
      <ShareDialog isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </div>
  );
};
