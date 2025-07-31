import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useTranslations from "@/hooks/useTranslations";

interface Reader {
  id: string;
  name: string;
  avatar?: string;
}

interface MessageReadReceiptsProps {
  readBy?: Reader[];
}

export const MessageReadReceipts = ({ readBy }: MessageReadReceiptsProps) => {
  const { t } = useTranslations();
  const defaultAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face";

  if (!readBy || readBy.length === 0) return null;

  return (
    <div className="flex -space-x-1">
      {readBy.length <= 3 ? (
        // Display avatars if 3 or fewer readers
        readBy.map((reader) => (
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
                {/* {t("dashboard.chat.readBy", { name: reader.name ?? '' })} */}
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
                    count: readBy.length,
                  })}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              align="end"
              className="text-xs p-2"
            >
              {readBy.map((reader) => reader.name).join(", ")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};