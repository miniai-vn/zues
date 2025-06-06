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
import { Plus, Trash2, Eye, EyeOff, Link } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

// Types
interface ChannelItem {
  id: number;
  name: string;
  status: "Hoạt động" | "Tạm dừng" | "Đang xử lý" | "Đang kết nối";
  createdDate: string;
  updatedDate: string;
  avatar?: string;
}

interface Platform {
  id: string;
  title: string;
  description: string;
  bgColor: string;
  icon?: string;
}

// Constants
const PLATFORMS: Platform[] = [
  {
    id: "zalo",
    title: "Zalo OA",
    description:
      "Kết nối Zalo OA để tương tác khách hàng và bán hàng qua Zalo.",
    bgColor: "bg-blue-500",
    icon: "/channel-imgs/zalo-logo.png",
  },
  {
    id: "facebook",
    title: "Facebook Shop",
    description: "Tích hợp Facebook Shop để bán hàng trực tiếp trên Facebook.",
    bgColor: "bg-blue-700",
    icon: "/channel-imgs/facebook-logo.png",
  },
  {
    id: "tiktok",
    title: "TikTok Shop",
    description: "Kết nối TikTok Shop để bán hàng qua livestream và video.",
    bgColor: "bg-black",
    icon: "/channel-imgs/tiktok-logo.png",
  },
  {
    id: "lazada",
    title: "Lazada",
    description:
      "Kết nối hệ thống bán hàng Lazada. Quản lý nhiều shop cùng lúc.",
    bgColor: "bg-orange-500",
    icon: "/channel-imgs/lazada-icon.png",
  },
  {
    id: "shopee",
    title: "Shopee",
    description:
      "Tích hợp với Shopee để đồng bộ sản phẩm và quản lý bán hàng hiệu quả.",
    bgColor: "bg-orange-600",
    icon: "/channel-imgs/shopee-icon.png",
  },
//   {
//     id: "instagram",
//     title: "Instagram Shopping",
//     description:
//       "Tích hợp Instagram Shopping để bán hàng qua Stories và Posts.",
//     bgColor: "bg-gradient-to-r from-purple-500 to-pink-500",
//     icon: "/channel-imgs/instagram-icon.png",
//   },
];

const MOCK_DATA: Record<string, ChannelItem[]> = {
  lazada: [
    {
      id: 1,
      name: "Shop Lazada VN",
      status: "Hoạt động",
      createdDate: "15/03/2024",
      updatedDate: "04/06/2025",
      avatar: "/channel-imgs/lazada-avatar-1.png",
    },
    {
      id: 2,
      name: "Lazada Store Premium",
      status: "Tạm dừng",
      createdDate: "22/01/2024",
      updatedDate: "01/06/2025",
      avatar: "/channel-imgs/lazada-avatar-2.png",
    },
  ],
  shopee: [
    {
      id: 1,
      name: "Shopee Mall Official",
      status: "Hoạt động",
      createdDate: "10/02/2024",
      updatedDate: "04/06/2025",
      avatar: "/channel-imgs/shopee-avatar-1.png",
    },
    {
      id: 2,
      name: "Shopee Store Fashion",
      status: "Hoạt động",
      createdDate: "05/04/2024",
      updatedDate: "03/06/2025",
      avatar: "/channel-imgs/shopee-avatar-2.png",
    },
    {
      id: 3,
      name: "Shopee Electronics",
      status: "Đang xử lý",
      createdDate: "20/05/2024",
      updatedDate: "04/06/2025",
      avatar: "/channel-imgs/shopee-avatar-3.png",
    },
  ],
  zalo: [
    {
      id: 1,
      name: "Zalo OA Chính",
      status: "Hoạt động",
      createdDate: "12/03/2024",
      updatedDate: "04/06/2025",
      avatar: "/channel-imgs/zalo-avatar-1.png",
    },
  ],
  facebook: [
    {
      id: 1,
      name: "Facebook Shop Main",
      status: "Hoạt động",
      createdDate: "08/01/2024",
      updatedDate: "03/06/2025",
      avatar: "/channel-imgs/facebook-avatar-1.png",
    },
    {
      id: 2,
      name: "FB Page Store",
      status: "Hoạt động",
      createdDate: "25/02/2024",
      updatedDate: "02/06/2025",
      avatar: "/channel-imgs/facebook-avatar-2.png",
    },
  ],
  tiktok: [
    {
      id: 1,
      name: "TikTok Shop VN",
      status: "Đang kết nối",
      createdDate: "01/06/2025",
      updatedDate: "04/06/2025",
      avatar: "/channel-imgs/tiktok-avatar-1.png",
    },
  ],
  instagram: [
    {
      id: 1,
      name: "Instagram Business",
      status: "Hoạt động",
      createdDate: "18/04/2024",
      updatedDate: "01/06/2025",
      avatar: "/channel-imgs/instagram-avatar-1.png",
    },
  ],
};

// Utility functions
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

// Components
interface PlatformCardProps {
  platform: Platform;
  channels: ChannelItem[];
  isExpanded: boolean;
  onToggle: () => void;
  onAddChannel: () => void;
  onDeleteChannel: (channelId: number) => void;
}

const PlatformCard = ({
  platform,
  channels,
  isExpanded,
  onToggle,
  onAddChannel,
  onDeleteChannel,
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
          >
            {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
            {isExpanded ? "Ẩn" : "Xem"} ({channels.length})
          </Button>
          <Button
            onClick={onAddChannel}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
            size="sm"
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
      />
    )}
  </div>
);

interface ChannelTableProps {
  platformTitle: string;
  channels: ChannelItem[];
  onDeleteChannel: (channelId: number) => void;
  onAddChannel: () => void;
}

const ChannelTable = ({
  platformTitle,
  channels,
  onDeleteChannel,
  onAddChannel,
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

    {channels.length === 0 ? (
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
                    <div className="flex items-center space-x-3">
                      {channel.avatar && (
                        <Image
                          src={channel.avatar}
                          alt={channel.name}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                      )}
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
  const [expandedPlatforms, setExpandedPlatforms] = useState<
    Record<string, boolean>
  >({});
  const [channelData, setChannelData] =
    useState<Record<string, ChannelItem[]>>(MOCK_DATA);

  const togglePlatform = (platformId: string) => {
    setExpandedPlatforms((prev) => ({
      ...prev,
      [platformId]: !prev[platformId],
    }));
  };

  const handleAddChannel = (platformId: string) => {
    // TODO: Open add channel dialog
    console.log(`Add channel for ${platformId}`);
  };

  const handleDeleteChannel = (platformId: string, channelId: number) => {
    setChannelData((prev) => ({
      ...prev,
      [platformId]:
        prev[platformId]?.filter((channel) => channel.id !== channelId) || [],
    }));
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

        <div className="space-y-6">
          {PLATFORMS.map((platform) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              channels={channelData[platform.id] || []}
              isExpanded={expandedPlatforms[platform.id] || false}
              onToggle={() => togglePlatform(platform.id)}
              onAddChannel={() => handleAddChannel(platform.id)}
              onDeleteChannel={(channelId) =>
                handleDeleteChannel(platform.id, channelId)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
