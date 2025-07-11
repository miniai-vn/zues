import { cn } from "@/lib/utils";

interface MessageContentProps {
  contentType: string;
  content?: string;
  links?: string[];
}

export const MessageContent = ({ contentType, content, links }: MessageContentProps) => {
  const renderContent = () => {
    switch (contentType) {
      case "image": {
        if (links && links.length > 0) {
          return (
            <div className={cn(
              "space-y-2",
              links.length > 1 ? "grid grid-cols-2 gap-2" : ""
            )}>
              {links.map((imgUrl, idx) => (
                <img
                  key={imgUrl + "-" + idx}
                  src={imgUrl}
                  alt={`Shared image ${idx + 1}`}
                  className="max-w-full h-auto cursor-pointer rounded-lg max-h-64 object-cover"
                  onClick={() => window.open(imgUrl, "_blank")}
                />
              ))}
            </div>
          );
        }
        return <div className="text-muted-foreground text-sm italic">📷 Image not available</div>;
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
                  className="w-16 h-16 object-contain cursor-pointer"
                  onClick={() => window.open(stickerUrl, "_blank")}
                />
              ))}
            </div>
          );
        }
        return <div className="text-muted-foreground text-sm italic">😊 Sticker not available</div>;
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
        return <div className="text-muted-foreground text-sm italic">📎 File not available</div>;
      }

      default:
        return content !== "" ? content : "Tin nhắn chưa được hỗ trợ hiển thị.";
    }
  };

  return <>{renderContent()}</>;
};