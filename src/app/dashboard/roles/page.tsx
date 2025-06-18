"use client";
import { PageHeader } from "@/components/dashboard/common/page-header";
import { DataTable } from "@/components/dashboard/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProtectedRoute, { Role } from "@/configs/protect-route";
import { useTranslations } from "@/hooks/useTranslations";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Giả sử bạn có hook useRoles để lấy danh sách roles
import ActionPopover from "@/components/dashboard/popever";
import useRoles from "@/hooks/data/useRoles";
import CreateOrUpdateRoleDialog from "./components/CreateOrUpdateDialog";

interface RoleType {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const RolesPage = () => {
  const { t } = useTranslations();
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
    },    {
      accessorKey: "name",
      header: t("dashboard.roles.name"),
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
      header: t("dashboard.roles.description"),
      cell: ({ row }) => (
        <div className="w-full">
          <p className="break-all line-clamp-2">
            {row.original.description || t("dashboard.roles.empty")}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: t("dashboard.roles.createdDate"),
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
      header: t("dashboard.roles.updatedDate"),
      cell: ({ row }) => (
        <div>
          {new Date(row.original.updated_at).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </div>
      ),
    },    {
      id: "actions",
      header: t("dashboard.roles.actions"),
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
                    <span>{t("dashboard.roles.edit")}</span>
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
              console.log(t("dashboard.roles.deleteRole"), row.original.id);
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
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">        <PageHeader
          backButtonHref="/dashboard"
          breadcrumbs={[
            { label: t("dashboard.roles.breadcrumbs.management"), href: "/dashboard" },
            { label: t("dashboard.roles.breadcrumbs.roleManagement"), isCurrentPage: true },
          ]}
        />
        <div className="flex justify-between items-center">          <Input
            placeholder={t("dashboard.roles.searchPlaceholder")}
            className="mr-4 w-full flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-3">            <Button
              onClick={() => refetchRolesWithPermissions()}
              className="font-medium px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Search />
              {t("dashboard.roles.search")}
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
          data={(roles?.items || []).map((role: any) => ({
            id: role.id,
            name: role.name,
            description: role.description,
            created_at: role.created_at ?? "",
            updated_at: role.updated_at ?? "",
          }))}
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
