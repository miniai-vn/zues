"use client";
import { PageHeader } from "@/components/dashboard/common/page-header";
import ActionPopover from "@/components/dashboard/popever";
import { DataTable } from "@/components/dashboard/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ProtectedRoute, { Role } from "@/configs/protect-route";
import useChannels, { Channel, ChannelStatus } from "@/hooks/data/useChannels";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { CreateOrUpdateChannelDialog } from "./component/CreateOrUpdateChannelDialog";

const ChannelPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  useDebouncedValue(search, 2000);

  const handlePaginationChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const {
    channels,
    totalCount,
    createChannel,
    updateChannel,
    deleteChannel,
    refetchChannels,
    isFetchingChannels,
    isPendingCreateChannel,
    isPendingUpdateChannel,
    isPendingDeleteChannel,
    updateChannelStatus,
  } = useChannels({ page, limit: pageSize, search });

  useEffect(() => {
    setPage(1);
  }, [search]);

  const columns: ColumnDef<Channel>[] = [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
      size: 40,
    },
    {
      accessorKey: "name",
      header: "Tên kênh",
      cell: ({ row }) => (
        <div className="w-full">
          <p className="break-all line-clamp-2">
            {row.original.name ?? "Trống"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Loại kênh",
      cell: ({ row }) => (
        <Badge variant="default" className="whitespace-nowrap">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      cell: ({ row }) => (
        <div className="w-full">
          <p className="break-all line-clamp-2">
            {row.original.description ?? "Trống"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "department.name",
      header: "Phòng ban",
      cell: ({ row }) => (
        <div className="w-full">
          <p className="break-all line-clamp-2">
            {row.original.department?.name ?? "Trống"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.original.status == ChannelStatus.ACTIVE}
            onCheckedChange={(checked) => {
              updateChannelStatus({
                id: row.original.id,
                status: checked ? ChannelStatus.ACTIVE : ChannelStatus.INACTIVE,
              });
            }}
            className="data-[state=checked]:bg-blue-600"
          />
          <span>
            {row.original.status ? "Đang hoạt động" : "Ngừng hoạt động"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return (
          <div className="text-center">
            {date.toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        return (
          <ActionPopover
            className="w-40"
            children={
              <CreateOrUpdateChannelDialog
                children={
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start gap-2 w-full"
                  >
                    <Pencil size={16} />
                    <span>Chỉnh sửa</span>
                  </Button>
                }
                channel={row.original}
                onChange={(data) => {
                  if (typeof data.id === "number") {
                    updateChannel({ ...data, id: data.id });
                  }
                }}
              />
            }
            onDelete={() => {
              deleteChannel(row.original.id);
            }}
          />
        );
      },
    },
  ];

  return (
    <ProtectedRoute requiredRole={[Role.Admin]}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <PageHeader
          backButtonHref="/dashboard"
          breadcrumbs={[
            {
              label: "Quản lý",
              href: "/dashboard/channels",
            },
            {
              label: "Quản lý kênh",
              isCurrentPage: true,
            },
          ]}
        />
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Tìm kiếm kênh theo tên"
            className="mr-4 w-full flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex items-center gap-3">
            <CreateOrUpdateChannelDialog onChange={createChannel} />
            <Button
              onClick={() => refetchChannels()}
              className="font-medium px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Search />
              Tìm kiếm
            </Button>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={channels || []}
          pagination={{
            page: page,
            limit: pageSize,
            total: totalCount || 0,
          }}
          onPaginationChange={handlePaginationChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={
            isFetchingChannels ||
            isPendingUpdateChannel ||
            isPendingDeleteChannel ||
            isPendingCreateChannel
          }
        />
      </div>
    </ProtectedRoute>
  );
};

export default ChannelPage;
