import { CreateOrUpdateUserDialog } from "@/app/dashboard/users/components/CreateOrUpdateUserModal";
import { useUserTableColumns } from "@/app/dashboard/users/components/UserTableColumns";
import { DataTable } from "@/components/dashboard/tables/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User } from "@/hooks/data/useAuth";
import { useUsers } from "@/hooks/useUser";
import { Download, Search } from "lucide-react";
import { useState } from "react";

export const UserManagement = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Sử dụng useUsers để lấy dữ liệu và mutation
  const {
    data,
    page,
    pageSize,
    goToPage,
    updatePageSize,
    createUser,
    updateUser,
    deleteUser,
    refetch,
    totalItems,
  } = useUsers({ initialPage: 1, initialPageSize: 10 });

  const handleCreateOrUpdate = async (formData: any) => {
    if (selectedUser) {
      await updateUser({ id: selectedUser.id, data: formData });
    } else {
      await createUser(formData);
    }
    setSelectedUser(null);
    refetch();
  };

  const handleDelete = async (userId: string) => {
    await deleteUser(userId);
    refetch();
  };

  // Sử dụng hook column giống dashboard
  const columns = useUserTableColumns({
    onUpdateUser: handleCreateOrUpdate,
    onDeleteUser: handleDelete,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          Quản lý nhân viên
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Tìm kiếm thẻ..." className="pl-10 w-full" />
          </div>
          <CreateOrUpdateUserDialog
            user={selectedUser ?? undefined}
            onChange={handleCreateOrUpdate}
          >
            <Button className="mb-4 min-w-[150px]">Thêm Người Dùng</Button>
          </CreateOrUpdateUserDialog>
          <Button variant="outline" className="min-w-[120px]">
            <Download className="h-4 w-4 mr-2" />
            Sắp xếp
          </Button>
        </div>
      </div>

      <Card>
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          pagination={{
            page,
            limit: pageSize,
            total: totalItems,
          }}
          onPaginationChange={goToPage}
          onPageSizeChange={updatePageSize}
          onRowClick={(row) => setSelectedUser(row)}
          isLoading={false}
          noResultsMessage="Không có dữ liệu"
        />
      </Card>
    </div>
  );
};
