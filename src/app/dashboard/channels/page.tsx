"use client";

import { PLATFORMS } from "@/app/chat/component/conversation-sidebar";
import { PageHeader } from "@/components/dashboard/common/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useChannels, { Channel, ChannelStatus } from "@/hooks/data/useChannels";
import { Eye, EyeOff, Link, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import ChannelTable from "./component/Table";
import { Platform } from "@/app/chat/component/conversation-sidebar/PlatformList";
import { useTranslations } from "@/hooks/useTranslations";

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
  isLoading?: boolean;
}

const PlatformCard = ({
  platform,
  channels,
  isExpanded,
  onToggle,
  onAddChannel,
  onDeleteChannel,
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
  const {
    channels,
    isLoadingChannels,
    deleteChannel,
    isDeletingChannel,
    updateShopId,
  } = useChannels({
    limit: 100, // Get all channels
  });

  const [expandedPlatforms, setExpandedPlatforms] = useState<
    Record<string, boolean>
  >({});
  // Group channels by platform type
  const channelsByPlatform = useMemo(() => {
    const grouped: Record<string, ChannelItem[]> = {};

    PLATFORMS.filter((platform) => !platform.isPublic).forEach((platform) => {
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

    if (appIdParam) {
      if (appType === "zalo") {
        updateShopId({ appId: appIdParam });
      } else {
        const appIds = appIdParam.includes(",")
          ? appIdParam.split(",")
          : [appIdParam];
        appIds.forEach((id) => updateShopId({ appId: id }));
      }
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

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <PageHeader
        backButtonHref="/dashboard"
        breadcrumbs={[
          { label: t("dashboard.channels.management"), href: "/dashboard" },
          { label: t("dashboard.channels.salesChannels"), isCurrentPage: true },
        ]}
      />

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
            {PLATFORMS.filter((platform) => platform.isPublic).map(
              (platform) => (
                <PlatformCard
                  key={platform.type}
                  platform={platform}
                  channels={channelsByPlatform[platform.type] || []}
                  isExpanded={expandedPlatforms[platform.type] || false}
                  onToggle={() => togglePlatform(platform.type)}
                  onAddChannel={() => handleAddChannel(platform.type)}
                  onDeleteChannel={handleDeleteChannel}
                  isLoading={isDeletingChannel}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
