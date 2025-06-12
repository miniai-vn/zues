"use client";

import { PageHeader } from "@/components/dashboard/common/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Eye, EyeOff, Link, Loader2 } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import useChannels, { Channel, ChannelStatus } from "@/hooks/data/useChannels";

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
    icon: "/channel-imgs/zalo-logo.png",
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
  {
    type: "lazada",
    title: "Lazada",
    description:
      "Kết nối hệ thống bán hàng Lazada. Quản lý nhiều shop cùng lúc.",
    bgColor: "bg-orange-500",
    icon: "/channel-imgs/lazada-icon.png",
  },
  {
    type: "shopee",
    title: "Shopee",
    description:
      "Tích hợp với Shopee để đồng bộ sản phẩm và quản lý bán hàng hiệu quả.",
    bgColor: "bg-orange-600",
    icon: "/channel-imgs/shopee-icon.png",
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

const getStatusVariant = (
  status: ChannelItem["status"]
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Hoạt động":
      return "default";
    case "Đang xử lý":
    case "Đang kết nối":
      return "secondary";
    case "Tạm dừng":
      return "destructive";
    default:
      return "outline";
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
  avatar: channel.url, // Assuming url contains avatar/image URL
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

interface ChannelTableProps {
  platformTitle: string;
  channels: ChannelItem[];
  onDeleteChannel: (channelId: number) => void;
  onAddChannel: () => void;
  isLoading?: boolean;
}

const ChannelTable = ({
  platformTitle,
  channels,
  onDeleteChannel,
  onAddChannel,
  isLoading = false,
}: ChannelTableProps) => (
  <Card className="border border-gray-200 bg-white p-6">
    <div className="mb-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-2">
        Danh sách kênh {platformTitle}
      </h4>
      <p className="text-sm text-gray-600">
        Quản lý tất cả kênh {platformTitle} đã kết nối
      </p>
    </div>

    {isLoading ? (
      <div className="text-center py-8">
        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
        <p className="text-gray-500 mt-2">Đang tải dữ liệu...</p>
      </div>
    ) : channels.length === 0 ? (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Chưa có kênh nào được kết nối</p>
        <Button
          onClick={onAddChannel}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={16} className="mr-2" />
          Thêm kênh đầu tiên
        </Button>
      </div>
    ) : (
      <>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Tên kênh</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Ngày cập nhật</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channels.map((channel) => (
                <TableRow key={channel.id}>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {channel.avatar ? (
                        <Image
                          src={channel.avatar}
                          alt={`${channel.name} avatar`}
                          width={40}
                          height={40}
                          className="rounded-full object-cover border border-gray-200"
                          onError={(e) => {
                            // Fallback to default avatar if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = "/channel-imgs/default-avatar.png";
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm font-medium">
                            {channel.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{channel.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(channel.status)}>
                      {channel.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {channel.createdDate}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {channel.updatedDate}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteChannel(channel.id)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 size={14} />
                      <span className="ml-1">Xóa</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Tổng cộng: {channels.length} kênh
          </p>
          <Button
            onClick={onAddChannel}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
            size="sm"
          >
            <Plus size={16} />
            <span>Thêm kênh</span>
          </Button>
        </div>
      </>
    )}
  </Card>
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
    // TODO: Handle other platform connections
    console.log(`Add channel for ${platformType}`);
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
