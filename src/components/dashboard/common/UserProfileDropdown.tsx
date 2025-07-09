import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "@/hooks/useTranslations";

interface UserProfileDropdownProps {
  avatarSrc?: string;
  avatarFallback?: string;
  userName?: string;
  userEmail?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  avatarSrc = "https://github.com/shadcn.png",
  avatarFallback = "M",
  userName,
  userEmail,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
}) => {
  const { t } = useTranslations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-full">
            <AvatarImage src={avatarSrc} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        {(userName || userEmail) && (
          <>
            <div className="flex flex-col space-y-1 p-2">
              {userName && (
                <p className="text-sm font-medium leading-none">{userName}</p>
              )}
              {userEmail && (
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail}
                </p>
              )}
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={onProfileClick}>
          {t("common.profile") || "Profile"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSettingsClick}>
          {t("common.settings") || "Settings"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogoutClick}>
          {t("common.logout") || "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
