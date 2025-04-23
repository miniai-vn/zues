"use client";
import { DataTable } from "@/components/dashboard/tables/data-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ProtectedRoute, { Role } from "@/configs/protect-route";
import { useAuth, User } from "@/hooks/data/useAuth";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { UserModal } from "./create-user-modal";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { AlertDialogComponent } from "@/components/dashboard/alert-modal";
import { Badge } from "@/components/ui/badge";

const UserComponents = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);
  const { deleteUser, createUser, users, updateUser } = useAuth(page, limit, debouncedSearch);

  const handlePaginationChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setLimit(newSize);
    setPage(1);
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Tên nhân viên",
      cell: ({ row }) => (
        <p className="break-all line-clamp-2 w-1/2">
          {row.original.name ?? "Trống"}
        </p>
      ),
    },
    {
      accessorKey: "position",
      header: "Chức vụ",
      cell: ({ row }) => (
        <p className="break-all line-clamp-2 w-1/2">
          {row.original.position ?? "Trống"}
        </p>
      ),
    },
    {
      accessorKey: "phone",
      header: "Số điện thoại",
      cell: ({ row }) => (
        <p className="break-all line-clamp-2 w-1/2">
          {row.original.phone ?? "Trống"}
        </p>
      ),
    },
    {
      accessorKey: "roles",
      header: "Quyền",
      cell: ({ row }) => (
        <p className="break-all line-clamp-2 w-1/2">
          {row.original.roles?.map((role, index) => (
            <Badge key={index} className="bg-blue-500 text-white ml-1">
              {role.name.toString()}
            </Badge>       
          )) ?? "Trống"}
        </p>
      ),
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <UserModal onChange={updateUser} user={row.original}>
                    <div className="flex items-center">
                      <Pencil className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </div>
                  </UserModal>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <AlertDialogComponent
                    title="Xóa người dùng"
                    description="Bạn có chắc chắn muốn xóa người dùng này không?"
                    onConfirm={() => {
                      deleteUser(row.original.id);
                    }}
                    onCancel={() => {}}
                  >
                    <div className="flex items-center">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa
                    </div>
                  </AlertDialogComponent>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },     
  ];

  useEffect(() => {
    if (users) {
      console.log("users", users);
    }
  }, [page, limit, debouncedSearch]);

  return (
    <ProtectedRoute requiredRole={[Role.Manager]}>
      <div>
        <div className="flex items-center gap-2 py-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Quản lý</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Nhân viên</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Tìm kiếm nhân viên"
              className="mr-4 w-full flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <UserModal onChange={createUser}>
              <Button variant="default">Thêm nhân viên</Button>
            </UserModal>
          </div>
          <DataTable
            columns={columns}
            data={users ?? []}
            pagination={{
              page: page,
              limit: limit,
            }}
            onPaginationChange={handlePaginationChange}
            onPageSizeChange={handlePageSizeChange}
            isLoading={!users}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UserComponents;
