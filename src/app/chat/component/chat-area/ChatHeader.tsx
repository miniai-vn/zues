import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/lib/utils";
import { Info, MoreVertical, Tag, Users } from "lucide-react";

interface ChatHeaderProps {
  conversationName?: string;
  conversationAvatar?: string;
  showContactInfo: boolean;
  onToggleContactInfo: () => void;
  onMoreOptions?: () => void;
  isGroup?: boolean;
  participantCount?: number;
  setShowTagManagement: (open: boolean) => void;
  setShowParticipantManagement?: (open: boolean) => void; // Make this optional for flexibility
}

export const ChatHeader = ({
  conversationName,
  conversationAvatar,
  showContactInfo,
  onToggleContactInfo,
  onMoreOptions,
  isGroup = false,
  participantCount = 0,
  setShowTagManagement,
  setShowParticipantManagement, // <-- Destructure here
}: ChatHeaderProps) => {
  const { t } = useTranslations();
  return (
    <div className="border-b p-4 flex items-center justify-between bg-background">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={conversationAvatar} />
          <AvatarFallback>
            {conversationName?.charAt(0)?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>        <div>
          <h3 className="font-medium">
            {conversationName || t("dashboard.chat.unknownConversation")}
          </h3>
          {isGroup && (
            <p className="text-sm text-muted-foreground">
              {participantCount} {t("dashboard.chat.members")}
            </p>
          )}
          {!isGroup && (
            <p className="text-sm text-muted-foreground">{t("dashboard.chat.activeNow")}</p>
          )}
        </div>
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center gap-2">
        {setShowParticipantManagement && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowParticipantManagement(true)}
          >
            <Users className="h-4 w-4" />
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowTagManagement(true)}
        >
          <Tag className="h-4 w-4" />
        </Button>        <Button
          size="sm"
          variant="ghost"
          onClick={onMoreOptions}
          title={t("dashboard.chat.moreOptions")}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onToggleContactInfo}
          className={cn(showContactInfo && "bg-accent")}
          title={showContactInfo ? t("dashboard.chat.hideContactInfo") : t("dashboard.chat.showContactInfo")}
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
