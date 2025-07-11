import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "@/hooks/useTranslations";
import { Notification } from "@/hooks/data/useNotifications";
import { Bell } from "lucide-react";

interface NotificationDropdownProps {
  notifications?: Notification[];
  unreadCount?: number;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onViewAll?: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications = [],
  unreadCount: propUnreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewAll,
}) => {
  const { t } = useTranslations();
  const unreadCount = propUnreadCount ?? notifications.filter(n => !n.isRead).length;

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = (id: string) => {
    onMarkAsRead?.(id);
  };

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead?.();
  };

  const handleViewAll = () => {
    onViewAll?.();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="flex items-center justify-between p-2 border-b">
          <span className="font-semibold">
            {t("common.notifications") || "Notifications"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            {t("common.markAllAsRead") || "Mark all as read"}
          </Button>
        </div>
        <div className="max-h-[400px] overflow-auto py-1">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b last:border-0 hover:bg-muted/50 cursor-pointer ${
                  !notification.isRead ? "bg-muted/20" : ""
                }`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      notification.isRead ? "bg-transparent" : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{notification.title}</div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.body}
                    </p>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {formatTimeAgo(notification.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {t("common.noNotifications") || "No notifications"}
            </div>
          )}
        </div>
        <div className="p-2 border-t text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs"
            onClick={handleViewAll}
          >
            {t("common.viewAllNotifications") || "View all notifications"}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
