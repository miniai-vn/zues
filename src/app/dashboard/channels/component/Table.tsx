import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "@/hooks/useTranslations";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { Loader2, MoreHorizontal, Plus, Shield, Trash2 } from "lucide-react";
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
  onToggleChannelStatus: (channelId: number, checked: boolean) => void;
  onAddChannel: () => void;
  isLoading?: boolean;
}

const ChannelTable = ({
  platformTitle,
  channels,
  onDeleteChannel,
  onToggleChannelStatus,
  onAddChannel,
  isLoading = false,
}: ChannelTableProps) => {
  const { t } = useTranslations();
  const router = useRouter();
  return (
    <Card className="border border-gray-200 bg-white p-6">
      <div className="mb-6">
        {" "}
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          {t("dashboard.channels.title")} {platformTitle}
        </h4>
        <p className="text-sm text-gray-600">
          {t("dashboard.channels.title")} {platformTitle} đã kết nối
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          <p className="text-gray-500 mt-2">Đang tải dữ liệu...</p>
        </div>
      ) : channels.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            {t("dashboard.channels.noChannels")}
          </p>
          <Button
            onClick={onAddChannel}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus size={16} className="mr-2" />
            {t("dashboard.channels.addFirst")}
          </Button>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("dashboard.channels.avatar")}</TableHead>
                  <TableHead>{t("dashboard.channels.name")}</TableHead>
                  <TableHead>{t("dashboard.channels.status")}</TableHead>
                  <TableHead className="text-center">Active</TableHead>
                  <TableHead>{t("dashboard.channels.createdDate")}</TableHead>
                  <TableHead>{t("dashboard.channels.updatedDate")}</TableHead>
                  <TableHead>{t("dashboard.channels.actions")}</TableHead>
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
                    <TableCell>
                      <div className="flex justify-center">
                        <Switch
                          checked={
                            channel.status === t("dashboard.channels.active")
                          }
                          onCheckedChange={(checked) =>
                            onToggleChannelStatus(channel.id, checked)
                          }
                          aria-label={
                            channel.status === t("dashboard.channels.active")
                              ? t("dashboard.channels.deactivate")
                              : t("dashboard.channels.activate")
                          }
                        />
                      </div>
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
                          {" "}
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/users`)}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            {t("dashboard.channels.permissions")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />{" "}
                          <DropdownMenuItem
                            onClick={() => onDeleteChannel(channel.id)}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t("dashboard.channels.disconnect")}
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
            {" "}
            <p className="text-sm text-gray-600">
              {t("dashboard.channels.total")}:{" "}
              {t("dashboard.channels.channelCount", { count: channels.length })}
            </p>
            <Button
              onClick={onAddChannel}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
              size="sm"
            >
              <Plus size={16} />
              <span>{t("dashboard.channels.add")}</span>
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default ChannelTable;
