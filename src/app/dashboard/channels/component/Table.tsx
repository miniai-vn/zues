import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Loader2,
  MoreHorizontal,
  Edit,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
// Type definitions
interface ChannelItem {
  id: number;
  name: string;
  avatar?: string;
  status: string;
  createdDate: string;
  updatedDate: string;
}

// Helper function
const getStatusVariant = (status: string) => {
  // Add your status variant logic here
  return status === "active" ? "default" : "secondary";
};

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
}: ChannelTableProps) => {
  const router = useRouter();
  return (
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
                          <img
                            src={channel.avatar}
                            alt={`${channel.name} avatar`}
                            width={40}
                            height={40}
                            className="rounded-full object-cover border border-gray-200"
                            onError={(e) => {
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/users`)}>
                            <Shield className="h-4 w-4 mr-2" />
                            Permissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDeleteChannel(channel.id)}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Disconnect
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
};

export default ChannelTable;
