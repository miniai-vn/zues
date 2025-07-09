import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/hooks/data/cs/useCS";
import useTranslations from "@/hooks/useTranslations";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
}

export const MessageItem = ({ message, isOwnMessage }: MessageItemProps) => {
  const { t } = useTranslations();

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const defaultAvatar =
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face";

  const renderMessageContent = () => {
    switch (message.contentType) {
      case "image": {
        if (message.links && message.links.length > 1) {
          return (
            <div className="grid grid-cols-2 gap-2 max-w-lg">
              {message.links.map((imgUrl, idx) => {
                return (
                  <img
                    key={imgUrl + "-" + idx}
                    src={imgUrl}
                    alt={`Shared image ${idx + 1}`}
                    className="max-w-full h-auto cursor-pointer rounded-lg"
                    onClick={() => window.open(imgUrl, "_blank")}
                  />
                );
              })}
            </div>
          );
        }
        const imageUrl =
          message.links && message.links.length === 1
            ? message.links[0]
            : message.url || message.content;
        return (
          <div className="max-w-xs">
            <img
              src={imageUrl}
              alt="Shared image"
              className="max-w-full h-auto cursor-pointer rounded-lg"
              onClick={() => window.open(imageUrl, "_blank")}
            />
          </div>
        );
      }

      case "file": {
        if (message.links && message.links.length > 1) {
          return (
            <div className="space-y-2">
              {message.links.map((fileUrl, idx) => {
                const getFileName = (url: string) => {
                  const cleanUrl = url.split("?")[0];
                  const urlParts = cleanUrl.split("/");
                  return urlParts[urlParts.length - 1] || `File_${idx + 1}`;
                };
                const fileName = getFileName(fileUrl);
                return (
                  <div
                    key={fileUrl + "-" + idx}
                    className="flex items-center gap-2 p-2 border rounded-lg bg-background"
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
        const fileUrl =
          message.links && message.links.length === 1
            ? message.links[0]
            : message.url || message.content;
        const getFileName = (url: string) => {
          const cleanUrl = url.split("?")[0];
          const urlParts = cleanUrl.split("/");
          return urlParts[urlParts.length - 1] || "File";
        };
        const fileName = getFileName(fileUrl);
        return (
          <div className="flex items-center gap-2 p-2 border rounded-lg bg-background">
            <div className="flex-shrink-0">📎</div>
            <a
              href={fileUrl}
              download={fileName}
              className="text-xs text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-sm font-medium truncate">{fileName}</span>
            </a>
          </div>
        );
      }

      default:
        return message.content !== ""
          ? message.content
          : "Tin nhắn chưa được hỗ trợ hiển thị.";
    }
  };

  return (
    <div
      className={cn(
        "flex gap-3",
        isOwnMessage ? "justify-end" : "justify-start",
      )}
    >
      {/* Left avatar for received messages */}
      {!isOwnMessage && (
        <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
          <AvatarImage src={message.sender?.avatar ?? defaultAvatar} />
          <AvatarFallback>
            {message.sender?.name?.charAt(0)?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message content */}
      <div
        className={cn(
          "max-w-[70%] space-y-1 flex flex-col",
          isOwnMessage ? "items-end" : "items-start",
        )}
      >
        {/* Message bubble */}
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-sm break-words",
            isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted",
          )}
        >
          {renderMessageContent()}
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1.5">
          <p className="text-xs text-muted-foreground">
            {formatMessageTime(message.createdAt)}
          </p>

          {/* Read receipts - only show for own messages */}
          {message.readBy && message.readBy.length > 0 && (
            <div className="flex -space-x-1">
              {message.readBy.length <= 3 ? (
                // Display avatars if 3 or fewer readers
                message.readBy.map((reader) => (
                  <TooltipProvider key={reader.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="h-4 w-4 border border-background">
                          <AvatarImage src={reader.avatar ?? defaultAvatar} />
                          <AvatarFallback className="text-[8px]">
                            {reader.name?.charAt(0)?.toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        align="end"
                        className="text-xs p-2"
                      >
                        {t("dashboard.chat.readBy", { name: reader.name })}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))
              ) : (
                // Show count if more than 3 readers
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="text-[10px]">
                          {t("dashboard.chat.readCount", {
                            count: message.readBy.length,
                          })}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      align="end"
                      className="text-xs p-2"
                    >
                      {message.readBy.map((reader) => reader.name).join(", ")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right avatar for sent messages */}
      {isOwnMessage && (
        <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
          <AvatarImage src={message.sender?.avatar ?? defaultAvatar} />
          <AvatarFallback>
            {message.sender?.name?.charAt(0)?.toUpperCase() ||
              t("dashboard.chat.you")}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
