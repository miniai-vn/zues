"use client";
import { PageHeader } from "@/components/dashboard/common/page-header";
import { DataTable } from "@/components/dashboard/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProtectedRoute, { Role } from "@/configs/protect-route";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Search } from "lucide-react";
import { useRouter } from "next/navigation";

// Giả sử bạn có hook useRoles để lấy danh sách roles
import useRoles from "@/hooks/data/useRoles";
import ActionPopover from "@/components/dashboard/popever";
import CreateOrUpdateRoleDialog from "./components/CreateOrUpdateDialog";

interface RoleType {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const RolesPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();

  const {
    roles,
    isFetchingRolesWithPermissions,
    refetchRolesWithPermissions,
    createRole,
    deleteRole,
    updateRole,
  } = useRoles({
    page,
    limit: pageSize,
    search,
  });

  const columns: ColumnDef<RoleType>[] = [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
      size: 40,
    },
    {
      accessorKey: "name",
      header: "Tên vai trò",
      cell: ({ row }) => (
        <div className="w-full">
          <Badge variant="default" className="whitespace-nowrap">
            {row.original.name}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      cell: ({ row }) => (
        <div className="w-full">
          <p className="break-all line-clamp-2">
            {row.original.description || "Trống"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Ngày tạo",
      cell: ({ row }) => (
        <div>
          {new Date(row.original.created_at).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </div>
      ),
    },
    {
      accessorKey: "updated_at",
      header: "Ngày cập nhật",
      cell: ({ row }) => (
        <div>
          {new Date(row.original.updated_at).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        return (
          <ActionPopover
            className="w-40 p-2"
            children={
              <CreateOrUpdateRoleDialog
                children={
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start gap-2 w-full"
                  >
                    <Pencil size={16} />
                    <span>Chỉnh sửa</span>
                  </Button>
                }
                onChange={(data) => {
                  if ("id" in data) {
                    updateRole(data as any);
                  }
                }}
                role={row.original}
              />
            }
            onDelete={() => {
              //   deleteUser(row.original.id);
              deleteRole(String(row.original.id));
              console.log("Xóa vai trò", row.original.id);
            }}
          ></ActionPopover>
        );
      },
    },
  ];

  const handlePaginationChange = (newPage: number) => setPage(newPage);
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  // Hàm xử lý khi click vào row
  const handleRowClick = (row: RoleType) => {
    router.push(`/dashboard/roles/${row.id}`);
  };

  return (
    <ProtectedRoute requiredRole={[Role.Admin]}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <PageHeader
          backButtonHref="/dashboard"
          breadcrumbs={[
            { label: "Quản lý", href: "/dashboard" },
            { label: "Quản lý vai trò", isCurrentPage: true },
          ]}
        />
        <div className="flex justify-between items-center">
          <Input
            placeholder="Tìm kiếm vai trò"
            className="mr-4 w-full flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <Button
              onClick={() => refetchRolesWithPermissions()}
              className="font-medium px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Search />
              Tìm kiếm
            </Button>
            <CreateOrUpdateRoleDialog
              onChange={(data) => {
                createRole({
                  ...data,
                  permissions: (data as any).permissions || {},
                } as any);
              }}
            />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={roles?.items || []}
          pagination={{
            page: page,
            limit: pageSize,
            total: roles?.totalCount || 0,
          }}
          onPaginationChange={handlePaginationChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={isFetchingRolesWithPermissions}
          onRowClick={handleRowClick} // Thêm dòng này
        />
      </div>
    </ProtectedRoute>
  );
};

export default RolesPage;
