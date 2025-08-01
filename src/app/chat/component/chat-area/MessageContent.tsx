import { Button } from "@/components/ui/button";
import { useCsStore } from "@/hooks/data/cs/useCsStore";
import { Message } from "@/hooks/data/cs/useMessage";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState } from "react";
import { MessageActions } from "./MessageActions";
import { ShareDialog } from "./ShareDialog";

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
                links.length > 1 ? "grid grid-cols-2 gap-2" : "",
                isOwner ? "justify-end flex" : ""
              )}
            >
              {links.map((imgUrl, idx) => (
                <div key={imgUrl + "-" + idx} className="relative group">
                  <img
                    src={imgUrl}
                    alt={`Shared image ${idx + 1}`}
                    width={256}
                    height={256}
                    className="max-w-full h-auto cursor-pointer  max-h-64 object-cover border"
                    onClick={() => window.open(imgUrl, "_blank")}
                  />
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
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain cursor-pointer rounded-2xl border"
                  onClick={() => window.open(stickerUrl, "_blank")}
                  style={{ width: "4rem", height: "4rem" }}
                />
              ))}
            </div>
          );
        }
        return (
          <div className="text-muted-foreground p-2  text-sm italic">
            😊 Sticker not available
          </div>
        );
      }

      case "file": {
        if (links && links.length > 0) {
          return (
            <div
              className={cn(
                "space-y-2",
                isOwner ? "flex flex-col items-end" : ""
              )}
            >
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
                    className="flex items-center gap-2 p-2 border rounded-2xl"
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
          <div className="text-muted-foreground p-2 text-sm italic">
            📎 File not available
          </div>
        );
      }

      default:
        return (
          <div className="group relative  px-3 py-2">
            <p className="text-sm text-gray-900 break-all">
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
    <div
      className={cn(
        "relative group flex",
        isOwner ? "justify-end" : "justify-start"
      )}
    >
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
