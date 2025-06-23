"use client";
import { DataTable } from "@/components/dashboard/tables/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useTranslations } from "@/hooks/useTranslations";
import { useUsers } from "@/hooks/useUser";
import { Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateOrUpdateUserDialog } from "./components/CreateOrUpdateUserModal";
import { UserFilters } from "./components/UserFilters";
import { UserLoadingSkeleton } from "./components/UserLoadingSkeleton";
import { useUserTableColumns } from "./components/UserTableColumns";
import { Button } from "@/components/ui/button";

const UserManager = () => {
  const { t } = useTranslations();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [columnVisibility, setColumnVisibility] = useState({
    index: true,
    name: true,
    username: true,
    phone: true,
    roles: true,
    departments: true,
    actions: true,
  });

  const debouncedSearch = useDebouncedValue(search, 500);

  const {
    data: users,
    isLoading: isFetchingUserHasPagination,
    refetch,
    goToPage,
    updatePageSize,
    updateFilter,
    clearFilter,
    paginationInfo,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers({
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

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    if (role && role !== "all") {
      updateFilter("role", role);
    } else {
      clearFilter("role");
    }
  };

  const handlePaginationChange = (newPage: number) => {
    goToPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    updatePageSize(newSize);
  };

  const columns = useUserTableColumns({
    onUpdateUser: updateUser,
    onDeleteUser: deleteUser,
  });

  if (isFetchingUserHasPagination) {
    return <UserLoadingSkeleton />;
  }

  const visibleColumns = columns.filter((column) => {
    const columnId = column.id || (column as any).accessorKey;
    return columnVisibility[columnId as keyof typeof columnVisibility];
  });

  return (
    <div className="flex flex-1 flex-col p-4 pt-0 h-screen">
      <Card className="flex flex-col flex-1 overflow-hidden">
        <CardHeader className="px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t("dashboard.users.userManagement")}
              </CardTitle>
              <CardDescription>
                {t("dashboard.users.userManagementDescription")}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <CreateOrUpdateUserDialog
                children={
                  <Button size="sm" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {t("dashboard.users.addUser")}
                  </Button>
                }
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 min-h-0 space-y-4">
          <div className="flex-shrink-0">
            <UserFilters
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              handleStatusFilter={handleStatusFilter}
              roleFilter={roleFilter}
              handleRoleFilter={handleRoleFilter}
              onRefetch={refetch}
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
              onCreateUser={createUser}
            />
            <Separator className="mt-4" />
          </div>
          {/* Data Table */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <DataTable
              columns={visibleColumns}
              data={users?.data || []}
              pagination={{
                page: paginationInfo.page,
                limit: paginationInfo.pageSize,
                total: paginationInfo.totalItems,
              }}
              onPaginationChange={handlePaginationChange}
              onPageSizeChange={handlePageSizeChange}
              isLoading={isFetchingUserHasPagination}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManager;
