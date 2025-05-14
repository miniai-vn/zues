import { AlertDialogComponent } from "@/components/dashboard/alert-modal";
import { DataTable } from "@/components/dashboard/tables/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User } from "@/hooks/data/useAuth";
import useDepartments, { Department, PERMISSIONS } from "@/hooks/data/useDepartments";
import { ColumnDef } from "@tanstack/react-table";
import { Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AddMemberDialog from "./AddmemberDialog";

export default function AccessControl({
  department,
}: {
  department: Department;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState<User[]>([]);
  const { removeUserFromDept } = useDepartments({});


  useEffect(() => {
    if (department) {
      const membersData = department.users?.map((user) => ({
        id: user.id,
        name: user.username,
        phone: user.phone,
        role: user.role,
      })) as User[];
      setMembers(membersData);
    }
  }, [department]);
  // Define columns for the DataTable
  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Email",
      },
      {
        accessorKey: "phone",
        header: "SỐ ĐIỆN THOẠI",
      },
      {
        accessorKey: "role",
        header: "VAI TRÒ",
        cell: ({ row }) => {
          console.log(row.original.role);
          return (
            <span>
              {PERMISSIONS[row.original.role as keyof typeof PERMISSIONS] ||
                row.original.role}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-center">Thao tác</div>,
        cell: ({ row }) => {
          return (
            <div className="flex justify-center">
              <AddMemberDialog  department={department} user={row.original} />
              <AlertDialogComponent
                children={
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                }
                description="Bạn có chắc chắn muốn xóa thành viên này không?"
                title="Xác nhận xóa thành viên"
                onConfirm={() =>
                  removeUserFromDept({
                    department_id: department.id as string,
                    user_id: row.original.id,
                  })
                }
                onCancel={() => {}}
              />
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <h2 className="text-blue-600 font-medium text-lg">
          Cài đặt phân quyền nhóm tài liệu
        </h2>
        <p className="text-sm text-gray-700">
          Thêm email của các thành viên trong dự án để kiểm soát quyền truy cập
          vào nhóm tài liệu
        </p>
        <p className="text-sm text-gray-700">
          Khi phân quyền truy cập nhóm tài liệu.
        </p>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6 gap-3">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden flex-1">
            <Search className="text-gray-500 w-4 h-4 ml-3" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo email và tên"
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <AddMemberDialog department={department} />
        </div>

        <DataTable
          columns={columns}
          data={members}
          noResultsMessage={
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-gray-700 mb-2">
                Bot chưa được phân quyền truy cập.
              </p>
              <p className="text-gray-700 mb-6">
                Thêm thành viên để phân quyền truy cập Bot này.
              </p>
            </div>
          }
        />
      </CardContent>
    </Card>
  );
}
