import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useTranslations from "@/hooks/useTranslations";

interface MessageAvatarProps {
  avatar?: string;
  name?: string;
  isOwnMessage?: boolean;
}

export const MessageAvatar = ({ avatar, name, isOwnMessage }: MessageAvatarProps) => {
  const { t } = useTranslations();
  
  const defaultAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face";

  return (
    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
      <AvatarImage src={avatar ?? defaultAvatar} />
      <AvatarFallback>
        {isOwnMessage 
          ? name?.charAt(0)?.toUpperCase() || t("dashboard.chat.you")
          : name?.charAt(0)?.toUpperCase() || "?"
        }
      </AvatarFallback>
    </Avatar>
  );
};