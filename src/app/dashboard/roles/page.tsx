"use client";
import { DataTable } from "@/components/dashboard/tables/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ProtectedRoute, { Role } from "@/configs/protect-route";
import { useRoles } from "@/hooks/data/useRoles";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useTranslations } from "@/hooks/useTranslations";
import { Plus, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import CreateOrUpdateRoleDialog from "./components/CreateOrUpdateDialog";
import { RoleFilters } from "./components/RoleFilters";
import { RoleLoadingSkeleton } from "./components/RoleLoadingSkeleton";
import { useRoleTableColumns } from "./components/RoleTableColumns";

const RolesPage = () => {
  const { t } = useTranslations();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [columnVisibility, setColumnVisibility] = useState({
    index: true,
    name: true,
    description: true,
    permissions: true,
    created_at: true,
    updated_at: true,
    actions: true,
  });

  const debouncedSearch = useDebouncedValue(search, 500);

  const {
    data: roles,
    isLoading: isFetchingRoles,
    refetch,
    goToPage,
    updatePageSize,
    updateFilter,
    clearFilter,
    paginationInfo,
    createRole,
    updateRole,
    deleteRole,
  } = useRoles({
    initialPage: 1,
    initialPageSize: 10,
    initialFilters: {
      status: "active",
    },
  });

  useEffect(() => {
    if (debouncedSearch) {
      updateFilter("search", debouncedSearch);
    } else {
      clearFilter("search");
    }
  }, [debouncedSearch, updateFilter, clearFilter]);

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    if (status && status !== "all") {
      updateFilter("status", status);
    } else {
      clearFilter("status");
    }
  };

  const handlePaginationChange = (newPage: number) => {
    goToPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    updatePageSize(newSize);
  };

  const columns = useRoleTableColumns({
    onUpdateRole: updateRole,
    onDeleteRole: deleteRole,
  });

  if (isFetchingRoles) {
    return <RoleLoadingSkeleton />;
  }

  const visibleColumns = columns.filter((column) => {
    const columnId = column.id || (column as any).accessorKey;
    return columnVisibility[columnId as keyof typeof columnVisibility];
  });

  return (
    <ProtectedRoute requiredRole={[Role.Admin]}>
      <div className="flex flex-1 flex-col p-4 pt-0 h-screen">
        <Card className="flex flex-col flex-1 overflow-hidden">
          <CardHeader className="px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t("dashboard.roles.roleManagement")}
                </CardTitle>
                <CardDescription>
                  {t("dashboard.roles.roleManagementDescription")}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <CreateOrUpdateRoleDialog
                  onChange={(data) => {
                    createRole({
                      ...data,
                      permissions: (data as any).permissions || {},
                    } as any);
                  }}
                  children={
                    <Button size="sm" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      {t("dashboard.roles.addRole")}
                    </Button>
                  }
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 min-h-0 space-y-4">
            <div className="flex-shrink-0">
              <RoleFilters
                search={search}
                setSearch={setSearch}
                statusFilter={statusFilter}
                handleStatusFilter={handleStatusFilter}
                onRefetch={refetch}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                onCreateRole={createRole}
              />
              <Separator className="mt-4" />
            </div>
            {/* Data Table */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <DataTable
                columns={visibleColumns}
                data={roles.map((role: any) => ({
                  id: role.id,
                  name: role.name,
                  description: role.description,
                  permissions: role.permissions || {},
                  created_at: role.created_at ?? role.createdAt ?? "",
                  updated_at: role.updated_at ?? role.updatedAt ?? "",
                }))}
                pagination={{
                  page: paginationInfo.page,
                  limit: paginationInfo.pageSize,
                  total: paginationInfo.totalItems,
                }}
                onPaginationChange={handlePaginationChange}
                onPageSizeChange={handlePageSizeChange}
                isLoading={isFetchingRoles}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default RolesPage;
