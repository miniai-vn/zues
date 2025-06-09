import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useCS } from "@/hooks/data/cs/useCS";
import { cn } from "@/lib/utils";

export const PLATFORMS = [
  {
    id: "all",
    name: "All Platforms",
    icon: "/channel-imgs/all-platforms.png",
    fallback: "ALL",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    status: "Online",
    description: "All messages",
  },
  {
    id: "zalo",
    name: "Zalo OA",
    icon: "/channel-imgs/zalo-logo.png",
    fallback: "ZA",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    status: "Online",
    description: "Customer messages",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "/channel-imgs/facebook-logo.png",
    fallback: "FB",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    status: "Online",
    description: "Page messages",
  },
  {
    id: "shopee",
    name: "Shopee",
    icon: "/channel-imgs/shopee-logo.png",
    fallback: "SP",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    status: "Online",
    description: "New orders",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "/channel-imgs/tiktok-logo.png",
    fallback: "TT",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    status: "Online",
    description: "TikTok messages",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "/channel-imgs/whatsapp-logo.png",
    fallback: "WA",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    status: "Online",
    description: "WhatsApp messages",
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: "/channel-imgs/telegram-logo.png",
    fallback: "TG",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    status: "Online",
    description: "Telegram messages",
  },
];

interface PlatformListProps {
  selectedChannel?: string;
  onSelectChannel: (platformId: string) => void;
}

export const PlatformList = ({
  selectedChannel,
  onSelectChannel,
}: PlatformListProps) => {
  const { channelsWithUnreadMessage } = useCS({});
  const getUnreadCount = (platformId: string) => {
    if (platformId === "all") {
      return (
        channelsWithUnreadMessage?.reduce(
          (total, channel) => total + channel.totalUnreadMessages,
          0
        ) || 0
      );
    }

    const channel = channelsWithUnreadMessage?.find(
      (channel) => channel.type === platformId
    );
    return channel?.totalUnreadMessages || 0;
  };

  // Filter platforms to only show those that exist in channelsWithUnreadMessage
  const getVisiblePlatforms = () => {
    if (!channelsWithUnreadMessage || channelsWithUnreadMessage.length === 0) {
      return [];
    }

    const allPlatform = PLATFORMS.find((p) => p.id === "all");

    const availablePlatforms = PLATFORMS.filter(
      (platform) =>
        platform.id !== "all" &&
        channelsWithUnreadMessage.some(
          (channel) => channel.type === platform.id
        )
    );

    return allPlatform
      ? [allPlatform, ...availablePlatforms]
      : availablePlatforms;
  };

  const visiblePlatforms = getVisiblePlatforms();

  return (
    <div className="w-16 border-r bg-gray-50/50">
      <div className="p-2 border-b">
        <div className="space-y-2">
          {visiblePlatforms.map((platform) => {
            const isSelected = selectedChannel === platform.id;
            const unreadCount = getUnreadCount(platform.id);

            return (
              <div
                key={platform.id}
                className={cn(
                  "relative flex items-center justify-center p-1 rounded-lg cursor-pointer transition-all duration-200 border",
                  isSelected
                    ? `${platform.bgColor} ${platform.borderColor} shadow-sm`
                    : "hover:bg-white border-transparent hover:border-gray-200"
                )}
                onClick={() => onSelectChannel(platform.id)}
                title={`${platform.name} - ${platform.description}`}
              >
                <div
                  className={cn(
                    "p-1 rounded-lg flex items-center justify-center",
                    platform.bgColor
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={platform.icon}
                      alt={platform.name}
                      className="object-contain p-1"
                    />
                    <AvatarFallback
                      className={cn("text-xs font-semibold", platform.color)}
                    >
                      {platform.fallback}
                    </AvatarFallback>
                  </Avatar>

                  {/* Option 2: Using Next.js Image component (Alternative)
                  <div className="relative h-8 w-8">
                    <Image
                      src={platform.icon}
                      alt={platform.name}
                      fill
                      className="object-contain p-1"
                      sizes="32px"
                    />
                  </div>
                  */}
                </div>

                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs min-w-4"
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
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
    </div>
  );
};
