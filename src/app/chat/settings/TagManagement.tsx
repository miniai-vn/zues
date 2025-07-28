import { DataTable } from "@/components/dashboard/tables/data-table";
import CreateTagDialog from "@/components/tag-manager/CreateTagDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useTags, { Tag } from "@/hooks/data/cs/useTags";
import { ColumnDef } from "@tanstack/react-table";
import { Download, Plus, Search } from "lucide-react";
import { useState } from "react";

export const TagManagement = () => {
  const [openCreateTag, setOpenCreateTag] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Lấy dữ liệu tags từ API
  const { tags, isLoadingTags, createTag, deleteTag } = useTags({
    queryParams: { page, limit: pageSize, name: search },
  });

  // Cấu hình cột cho DataTable
  const columns: ColumnDef<Tag>[] = [
    {
      accessorKey: "name",
      header: "Tên thẻ",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "type",
      header: "Loại thẻ",
      cell: ({ row }) => <span>{row.original.type}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => <span>{row.original.createdAt?.slice(0, 10)}</span>,
    },
    {
      accessorKey: "color",
      header: "Màu sắc",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: row.original.color }}
          ></div>
          <span className="capitalize">{row.original.color}</span>
        </div>
      ),
    },
    {
      accessorKey: "conversationCount",
      header: "Số cuộc trò chuyện",
      cell: ({ row }) => <span>{row.original.conversationCount || 0}</span>,
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteTag(row.original.id!)}
          >
            Xóa
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Quản lý thẻ</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tìm kiếm thẻ..."
              className="pl-10 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => setOpenCreateTag(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tạo thẻ mới
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Sắp xếp
          </Button>
        </div>
      </div>

      <CreateTagDialog
        open={openCreateTag}
        onOpenChange={setOpenCreateTag}
        onTagCreated={createTag}
      />

      <Card>
        <DataTable
          columns={columns}
          data={tags ?? []}
          pagination={{
            page,
            limit: pageSize,
            total: tags?.length ?? 0,
          }}
          onPaginationChange={setPage}
          onPageSizeChange={setPageSize}
          isLoading={isLoadingTags}
          noResultsMessage="Không có dữ liệu"
        />
      </Card>
    </div>
  );
};
