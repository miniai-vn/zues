import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useCsStore } from "@/hooks/data/cs/useCsStore";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
export interface Platform {
  id: string;
  type: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  fallback: string;
  color: string;
  bgColor: string;
  borderColor: string;
  isPublic?: boolean;
  status: "Online" | "Offline";
}

export const getPlatforms = (t: (key: string) => string): Platform[] => [
  {
    id: "all",
    type: "all",
    name: t("platforms.all.name"),
    title: t("platforms.all.title"),
    description: t("platforms.all.description"),
    icon: "/channel-imgs/all-platforms.png",
    fallback: "ALL",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    status: "Online",
    isPublic: false,
  },
  {
    id: "zalo",
    type: "zalo",
    name: t("platforms.zalo.name"),
    title: t("platforms.zalo.title"),
    description: t("platforms.zalo.description"),
    icon: "/channel-imgs/zalo-logo.webp",
    fallback: "ZA",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    status: "Online",
    isPublic: true,
  },
  {
    id: "facebook",
    type: "facebook",
    name: t("platforms.facebook.name"),
    title: t("platforms.facebook.title"),
    description: t("platforms.facebook.description"),
    icon: "/channel-imgs/facebook-logo.png",
    fallback: "FB",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    status: "Online",
    isPublic: true,
  },
  {
    id: "shopee",
    type: "shopee",
    name: t("platforms.shopee.name"),
    title: t("platforms.shopee.title"),
    description: t("platforms.shopee.description"),
    icon: "/channel-imgs/Shopee-logo.png",
    fallback: "SP",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    status: "Online",
    isPublic: true,
  },
  {
    id: "tiktok",
    type: "tiktok",
    name: t("platforms.tiktok.name"),
    title: t("platforms.tiktok.title"),
    description: t("platforms.tiktok.description"),
    icon: "/channel-imgs/tiktok-logo.png",
    fallback: "TT",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    status: "Online",
    isPublic: true,
  },
  {
    id: "whatsapp",
    type: "whatsapp",
    name: t("platforms.whatsapp.name"),
    title: t("platforms.whatsapp.title"),
    description: t("platforms.whatsapp.description"),
    icon: "/channel-imgs/whatsapp-logo.png",
    fallback: "WA",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    status: "Online",
    isPublic: false,
  },
  {
    id: "telegram",
    type: "telegram",
    name: t("platforms.telegram.name"),
    title: t("platforms.telegram.title"),
    description: t("platforms.telegram.description"),
    icon: "/channel-imgs/telegram-logo.png",
    fallback: "TG",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    status: "Online",
    isPublic: false,
  },
];

export const PlatformList = () => {
  const { t } = useTranslations();
  const { channelsUnreadCount: channelsWithUnreadMessage } = useCsStore();
  const router = useRouter();

  const platforms = getPlatforms(t);
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

    const allPlatform = platforms.find((p: Platform) => p.id === "all");

    const availablePlatforms = platforms.filter(
      (platform: Platform) =>
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
    <div className=" border-r h-full bg-gray-50/50  ">
      <div className="p-2 ">
        <div className="space-y-2  ">
          {visiblePlatforms.map((platform: Platform) => {
            const isSelected = true;
            const unreadCount = getUnreadCount(platform.id);

            return (
              <div
                key={platform.id}
                className={cn(
                  "relative flex items-center justify-center p-1 rounded-lg cursor-pointer  border",
                  isSelected
                    ? `${platform.bgColor} ${platform.borderColor} shadow-sm`
                    : "hover:bg-white border-transparent hover:border-gray-200"
                )}
                onClick={() => {
                  router.push("/chat");
                }}
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
                </div>

                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs min-w-4"
                  >
                    {unreadCount > 5 ? "5+" : unreadCount}
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
          <div
            className={cn(
              "relative flex items-center justify-center p-1 rounded-lg cursor-pointer transition-all duration-200 border hover:bg-white border-transparent hover:border-gray-200"
            )}
            onClick={() => router.push("/dashboard/channels")}
          >
            <div
              className={cn(
                "p-1 rounded-lg flex items-center justify-center hover:bg-white border-transparent hover:border-gray-200"
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="link.png" className="object-contain p-1" />
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
