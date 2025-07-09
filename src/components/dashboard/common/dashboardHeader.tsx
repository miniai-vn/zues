import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { PageHeader } from "./page-header";
import { NotificationDropdown } from "./NotificationDropdown";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { useNotifications } from "@/hooks/useNotifications";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";

interface DashboardHeaderProps {
  title?: string;
  userName?: string;
  userEmail?: string;
  avatarSrc?: string;
  avatarFallback?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  onViewAllNotifications?: () => void;
}

const DashboardHeader = ({ 
  title = "",
  userName,
  userEmail,
  avatarSrc,
  avatarFallback,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  onViewAllNotifications,
}: DashboardHeaderProps) => {
  const breadcrumbs = useBreadcrumbs(title);
  const {
    notifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const handleSettingsClick = () => {
    onSettingsClick?.();
  };
  return (
    <header className="sticky border-b mb-2 top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 px-4 py-1">
      <div className="flex items-center justify-between">
        <div>
          <PageHeader
            backButtonHref="/dashboard"
            breadcrumbs={breadcrumbs}
          />
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          
          <NotificationDropdown
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onViewAll={onViewAllNotifications}
          />
          
          <Button variant="ghost" size="sm" onClick={handleSettingsClick}>
            <Settings className="h-4 w-4" />
          </Button>
          
          <UserProfileDropdown
            userName={userName}
            userEmail={userEmail}
            avatarSrc={avatarSrc}
            avatarFallback={avatarFallback}
            onProfileClick={onProfileClick}
            onSettingsClick={onSettingsClick}
            onLogoutClick={onLogoutClick}
          />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
