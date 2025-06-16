"use client";

import { PageHeader } from "@/components/dashboard/common/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useChannels, { Channel, ChannelStatus } from "@/hooks/data/useChannels";
import { Eye, EyeOff, Link, Loader2 } from "lucide-react";
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

interface Platform {
  type: string;
  title: string;
  description: string;
  bgColor: string;
  icon?: string;
}

// Constants
const PLATFORMS: Platform[] = [
  {
    type: "zalo",
    title: "Zalo OA",
    description:
      "Kết nối Zalo OA để tương tác khách hàng và bán hàng qua Zalo.",
    bgColor: "bg-blue-500",
    icon: "/channel-imgs/zalo-logo.webp",
  },
  {
    type: "facebook",
    title: "Facebook Shop",
    description: "Tích hợp Facebook Shop để bán hàng trực tiếp trên Facebook.",
    bgColor: "bg-blue-700",
    icon: "/channel-imgs/facebook-logo.png",
  },
  {
    type: "tiktok",
    title: "TikTok Shop",
    description: "Kết nối TikTok Shop để bán hàng qua livestream và video.",
    bgColor: "bg-black",
    icon: "/channel-imgs/tiktok-logo.png",
  },
  // {
  //   type: "lazada",
  //   title: "Lazada",
  //   description:
  //     "Kết nối hệ thống bán hàng Lazada. Quản lý nhiều shop cùng lúc.",
  //   bgColor: "bg-orange-500",
  //   icon: "/channel-imgs/lazada-icon.png",
  // },
  {
    type: "shopee",
    title: "Shopee",
    description:
      "Tích hợp với Shopee để đồng bộ sản phẩm và quản lý bán hàng hiệu quả.",
    bgColor: "bg-orange-600",
    icon: "/channel-imgs/Shopee-logo.png",
  },
];

// Utility functions
const mapChannelStatus = (status: ChannelStatus): ChannelItem["status"] => {
  switch (status) {
    case ChannelStatus.ACTIVE:
      return "Hoạt động";
    case ChannelStatus.INACTIVE:
      return "Tạm dừng";
    default:
      return "Đang xử lý";
  }
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const transformChannelToChannelItem = (channel: Channel): ChannelItem => ({
  id: channel.id,
  name: channel.name,
  status: mapChannelStatus(channel.status),
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
}: PlatformCardProps) => (
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
                {isExpanded ? "Ẩn" : "Xem"}
              </>
            )}
            ({channels.length})
          </Button>
          <Button
            onClick={onAddChannel}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
            size="sm"
            disabled={isLoading}
          >
            <Link size={16} />
            <span>Kết nối</span>
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

// Main Component
export default function ChannelsManagementPage() {
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

    PLATFORMS.forEach((platform) => {
      grouped[platform.type] = [];
    });

    channels?.forEach((channel) => {
      const channelItem = transformChannelToChannelItem(channel);
      if (grouped[channel.type]) {
        grouped[channel.type].push(channelItem);
      } else {
        // Handle unknown platform types
        grouped[channel.type] = [channelItem];
      }
    });

    return grouped;
  }, [channels]);

  useEffect(() => {
    console.log("Current URL:", window.location.href);
  }, [channels]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("appId")) {
      updateShopId({
        appId: params.get("appId") || "",
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
    if(platformType === 'facebook'){
      // Redirect to Facebook Auth URL
      window.open(process.env.NEXT_PUBLIC_OAUTH_FACEBOOK, "_blank")
      return
    }
  };

  const handleDeleteChannel = async (channelId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa kênh này?")) {
      deleteChannel(channelId);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <PageHeader
        backButtonHref="/dashboard"
        breadcrumbs={[
          { label: "Quản lý", href: "/dashboard" },
          { label: "Kênh bán hàng", isCurrentPage: true },
        ]}
      />

      <div className="w-full max-w-6xl mx-auto space-y-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Quản lý kênh bán hàng
          </h2>
          <p className="text-gray-600">
            Kết nối và quản lý nhiều tài khoản trên các nền tảng bán hàng khác
            nhau
          </p>
        </div>

        {isLoadingChannels ? (
          <div className="text-center py-12">
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            <p className="text-gray-500 mt-2">Đang tải danh sách kênh...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {PLATFORMS.map((platform) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
