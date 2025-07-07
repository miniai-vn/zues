import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/hooks/data/cs/useCS";
import useTranslations from "@/hooks/useTranslations";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
  showSenderName?: boolean;
  senderName?: string;
  senderAvatar?: string;
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
      case "image":
        const imageUrl = message.url || message.thumb;
        return (
          <div className="max-w-xs">
            <img
              src={imageUrl}
              alt="Shared image"
              className="max-w-full h-auto cursor-pointer"
            />
          </div>
        );

      case "file":
        if (message.links && message.links.length > 0) {
          return (
            <div className="space-y-2">
              {message.links.map((fileUrl, index) => {
                const getFileName = (url: string) => {
                  if ("fileName" in message && message.fileName) {
                    return `${message.fileName}_${index + 1}`;
                  }
                  try {                    
                    const cleanUrl = url.split("?")[0];
                    const urlParts = cleanUrl.split("/");
                    let fileName = urlParts[urlParts.length - 1];
                    if (fileName && fileName.includes(".")) {
                      return fileName;
                    }
                    for (let i = urlParts.length - 1; i >= 0; i--) {
                      if (urlParts[i] && urlParts[i].includes(".")) {
                        return urlParts[i];
                      }
                    }
                    return `File_${index + 1}`;
                  } catch (error) {
                    return `File_${index + 1}`;
                  }
                };
                const fileName = getFileName(fileUrl);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 border rounded-lg bg-background"
                  >
                    <div className="flex-shrink-0">📎</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{fileName}</p>
                    </div>
                    <a
                      href={fileUrl}
                      download={fileName}
                      className="text-xs text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Tải xuống
                    </a>
                  </div>
                );
              })}
            </div>
          );
        }
        return <div>No files available</div>;

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
        {/* Sender name for received messages */}
        {!isOwnMessage && (
          <p className="text-xs text-muted-foreground font-medium">
            {message.sender?.name}
          </p>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            "rounded-lg text-sm break-words",
            // Chỉ thêm background và padding cho text message
            message.contentType === "text" && [
              "px-3 py-2",
              isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted",
            ],
            // Cho image/file/sticker: không có background, chỉ có minimal styling
            (message.contentType === "image" ||
              message.contentType === "file" ||
              message.contentType === "sticker") &&
              "p-0",
          )}
        >
          {renderMessageContent()}
        </div>

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground">
          {formatMessageTime(message.createdAt)}
        </p>

        {/* Người đã đọc message này */}
        {message.readBy && message.readBy.length > 0 && (
          <div className="flex gap-1 mt-1 items-center">
            {message.readBy.map((u) => (
              <div key={u.id}>
                <span className="text-xs text-muted-foreground">
                  Đã đọc bởi: {u.name}
                </span>
                {/* <Avatar className="h-5 w-5" title={u.name}>
                  <AvatarImage src={u.avatar || defaultAvatar} />
                  <AvatarFallback>
                    {u.name?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar> */}
              </div>
            ))}
          </div>
        )}
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
