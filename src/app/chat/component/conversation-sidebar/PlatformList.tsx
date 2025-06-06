import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MessageCircle, Zap, Facebook, Store } from "lucide-react";

// Platform data structure - This could be moved to a shared types/data file
export const PLATFORMS = [
  {
    id: "all",
    name: "All Platforms",
    icon: MessageCircle,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    unreadCount: 10, // This should ideally come from dynamic data
    status: "Online",
    description: "All messages",
  },
  {
    id: "zalo",
    name: "Zalo OA",
    icon: Zap,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    unreadCount: 5,
    status: "Online",
    description: "Customer messages",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    unreadCount: 2,
    status: "Online",
    description: "Page messages",
  },
  {
    id: "shopee",
    name: "Shopee",
    icon: Store,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    unreadCount: 3,
    status: "Online",
    description: "New orders",
  },
];

interface PlatformListProps {
  selectedPlatform: string;
  onPlatformChange: (platformId: string) => void;
  totalUnreadCount: number;
}

export const PlatformList = ({
  selectedPlatform,
  onPlatformChange,
  totalUnreadCount,
}: PlatformListProps) => {
  return (
    <div className="w-16 border-r bg-gray-50/50">
      <div className="p-2 border-b">
        <h3 className="font-semibold text-xs mb-2 text-center">Platforms</h3>
        <div className="space-y-2">
          {PLATFORMS.map((platform) => {
            const IconComponent = platform.icon;
            const isSelected = selectedPlatform === platform.id;

            return (
              <div
                key={platform.id}
                className={cn(
                  "relative flex items-center justify-center p-1 rounded-lg cursor-pointer transition-all duration-200 border",
                  isSelected
                    ? `${platform.bgColor} ${platform.borderColor} shadow-sm`
                    : "hover:bg-white border-transparent hover:border-gray-200"
                )}
                onClick={() => onPlatformChange(platform.id)}
                title={`${platform.name} - ${platform.description}`}
              >
                <div
                  className={cn(
                    "p-2 rounded-lg flex items-center justify-center",
                    platform.bgColor
                  )}
                >
                  <IconComponent className={cn("h-4 w-4", platform.color)} />
                </div>

                {platform.unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs min-w-4"
                  >
                    {platform.unreadCount > 99 ? "99+" : platform.unreadCount}
                  </Badge>
                )}

                <div
                  className={cn(
                    "absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white",
                    platform.status === "Online"
                      ? "bg-green-500"
                      : "bg-gray-400"
                  )}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Account Section */}
      <div className="p-2">
        <div className="relative flex items-center justify-center p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            AI
          </div>

          {totalUnreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs min-w-4"
            >
              {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
            </Badge>
          )}

          <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white" />
        </div>
      </div>
    </div>
  );
};
