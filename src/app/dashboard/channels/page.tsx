"use client";

import { getPlatforms } from "@/app/chat/component/chat-area/conversation-sidebar";
import { Platform } from "@/app/chat/component/chat-area/conversation-sidebar/PlatformList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useChannels, { Channel, ChannelStatus } from "@/hooks/data/useChannels";
import { useTranslations } from "@/hooks/useTranslations";
import { Eye, EyeOff, Link, Loader2, Settings } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import ChannelTable from "./component/Table";

// Types
interface ChannelItem {
  id: number;
  name: string;
  status: "Hoạt động" | "Tạm dừng" | "Đang xử lý" | "Đang kết nối";
  createdDate: string;
  updatedDate: string;
  avatar?: string;
  type: string;
}

// Utility functions
const mapChannelStatus = (
  status: ChannelStatus,
  t: any
): ChannelItem["status"] => {
  switch (status) {
    case ChannelStatus.ACTIVE:
      return t("dashboard.channels.active");
    case ChannelStatus.INACTIVE:
      return t("dashboard.channels.inactive");
    default:
      return t("dashboard.channels.processing");
  }
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const transformChannelToChannelItem = (
  channel: Channel,
  t: any
): ChannelItem => ({
  id: channel.id,
  name: channel.name,
  status: mapChannelStatus(channel.status, t),
  createdDate: formatDate(channel.createdAt),
  updatedDate: formatDate(channel.updatedAt),
  avatar: channel.avatar, // Assuming url contains avatar/image URL
  type: channel.type,
});

// Components
interface PlatformCardProps {
  platform: Platform;
  channels: ChannelItem[];
  isExpanded: boolean;
  onToggle: () => void;
  onAddChannel: () => void;
  onDeleteChannel: (channelId: number) => void;
  onToggleChannelStatus: (channelId: number, checked: boolean) => void;
  isLoading?: boolean;
}

const PlatformCard = ({
  platform,
  channels,
  isExpanded,
  onToggle,
  onAddChannel,
  onDeleteChannel,
  onToggleChannelStatus,
  isLoading = false,
}: PlatformCardProps) => {
  const { t } = useTranslations();

  return (
    <div className="space-y-4">
      <Card className="border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src={platform.icon ?? "/channel-imgs/default-icon.png"}
              alt={`${platform.title} icon`}
              width={40}
              height={40}
              className="object-contain"
              priority={true}
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {platform.title}
              </h3>
              <p className="text-gray-600 text-sm">{platform.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={onToggle}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
                  {isExpanded
                    ? t("dashboard.channels.hide")
                    : t("dashboard.channels.show")}
                </>
              )}
              ({channels.length})
            </Button>
            <Button
              onClick={onAddChannel}
              className="flex items-center space-x-2"
              size="sm"
              disabled={isLoading}
            >
              <Link size={16} />
              <span>{t("dashboard.channels.connect")}</span>
            </Button>
          </div>
        </div>
      </Card>

      {isExpanded && (
        <ChannelTable
          platformTitle={platform.title}
          channels={channels}
          onDeleteChannel={onDeleteChannel}
          onToggleChannelStatus={onToggleChannelStatus}
          onAddChannel={onAddChannel}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

// Main Component
export default function ChannelsManagementPage() {
  const { t } = useTranslations();
  const platforms = getPlatforms(t);
  const {
    channels,
    isLoadingChannels,
    deleteChannel,
    isDeletingChannel,
    updateShopId,
    updateStatus,
    syncConversations,
    syncFaceBookConversations,
  } = useChannels({
    limit: 100, // Get all channels
  });

  const [expandedPlatforms, setExpandedPlatforms] = useState<
    Record<string, boolean>
  >({});
  // Group channels by platform type
  const channelsByPlatform = useMemo(() => {
    const grouped: Record<string, ChannelItem[]> = {};

    platforms
      .filter((platform: Platform) => !platform.isPublic)
      .forEach((platform: Platform) => {
        grouped[platform.type] = [];
      });

    channels?.forEach((channel) => {
      const channelItem = transformChannelToChannelItem(channel, t);
      if (grouped[channel.type]) {
        grouped[channel.type].push(channelItem);
      } else {
        grouped[channel.type] = [channelItem];
      }
    });

    return grouped;
  }, [channels, t]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const appIdParam = params.get("appId");
    const appType = params.get("type");
    if (!appIdParam || !appType) {
      return;
    }

    if (appType === "zalo") {
      updateShopId({ appId: appIdParam });
      syncConversations(appIdParam);
    } else {
      const appIds = appIdParam.includes(",")
        ? appIdParam.split(",")
        : [appIdParam];

      appIds.forEach((id) => {
        updateShopId({ appId: id });
        syncFaceBookConversations(id);
      });
    }
  }, []);

  const togglePlatform = (platformType: string) => {
    setExpandedPlatforms((prev) => ({
      ...prev,
      [platformType]: !prev[platformType],
    }));
  };

  const handleAddChannel = (platformType: string) => {
    if (platformType === "zalo") {
      // Redirect to Zalo OA authentication URL
      window.open(process.env.NEXT_PUBLIC_OAUTH_ZALO, "_blank");
      return;
    }
    if (platformType === "facebook") {
      // Redirect to Facebook Auth URL
      window.open(process.env.NEXT_PUBLIC_OAUTH_FACEBOOK, "_blank");

      return;
    }
  };

  const handleDeleteChannel = async (channelId: number) => {
    if (window.confirm(t("dashboard.channels.confirmDelete"))) {
      deleteChannel(channelId);
    }
  };

  const handleToggleChannelStatus = async (
    channelId: number,
    checked: boolean
  ) => {
    updateStatus({
      channelId,
      status: checked ? ChannelStatus.ACTIVE : ChannelStatus.INACTIVE,
    });
  };

  return (
    <div className="flex flex-1 flex-col p-4 pt-0 h-screen">
      <Card className="flex flex-col flex-1 overflow-hidden">
        <CardHeader className="px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t("dashboard.channels.title")}
              </CardTitle>
              <CardDescription>
                {t("dashboard.channels.description")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 min-h-0 space-y-4">
          <div className="w-full max-w-6xl mx-auto space-y-6">
            {isLoadingChannels ? (
              <div className="text-center py-12">
                <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                <p className="text-gray-500 mt-2">
                  {t("dashboard.channels.loading")}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {platforms
                  .filter((platform: Platform) => platform.isPublic)
                  .map((platform: Platform) => (
                    <PlatformCard
                      key={platform.type}
                      platform={platform}
                      channels={channelsByPlatform[platform.type] || []}
                      isExpanded={expandedPlatforms[platform.type] || false}
                      onToggle={() => togglePlatform(platform.type)}
                      onAddChannel={() => handleAddChannel(platform.type)}
                      onDeleteChannel={handleDeleteChannel}
                      onToggleChannelStatus={handleToggleChannelStatus}
                      isLoading={isDeletingChannel}
                    />
                  ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
