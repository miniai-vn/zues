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
import { PencilLine, X } from "lucide-react";
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
        <p className="break-all line-clamp-2 text-xs leading-tight">
          {row.original.name ?? "Trống"}
        </p>
      ),
    },
    {
      accessorKey: "position",
      header: "Chức vụ",
      cell: ({ row }) => (
        <p className="break-all line-clamp-2 text-xs leading-tight">
          {row.original.position ?? "Nhân viên"}
        </p>
      ),
    },
    {
      accessorKey: "phone",
      header: "Số điện thoại",
      cell: ({ row }) => (
        <p className="break-all line-clamp-2 text-xs leading-tight">
          {row.original.phone ?? "Trống"}
        </p>
      ),
    },
    {
      accessorKey: "departments",
      header: "Bộ phận",
      cell: ({ row }) => (
        <div className="break-all line-clamp-2 w-1/2 flex flex-wrap items-center gap-1 text-xs leading-tight">
          {row.original.departments?.map((department, index) => (
            <span key={index} className="flex items-center">
              {department.name?.toString()}
              {index < row.original.departments.length - 1 && (
                <Separator orientation="vertical" className="mx-2 h-4" />
              )}
            </span>
          )) ?? "Trống"}
        </div>
      ),
    },
    {
      accessorKey: "permissions",
      header: "Quyền hạn",
      cell: ({ row }) => (
        <div className="break-all line-clamp-2 w-1/2 flex flex-wrap items-center gap-1 text-xs leading-tight">
          {row.original.permissions?.map((permission, index) => (
            <span key={index} className="flex items-center">
              {permission}
              {index < row.original.permissions.length - 1 && (
                <Separator orientation="vertical" className="mx-2 h-4" />
              )}
            </span>
          )) ?? "Trống"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Tình trạng",
      cell: ({ row }) => (
        <Badge
          className={`text-xs leading-tight ${
            row.original.status
              ? "bg-green-500 text-white font-normal"
              : "bg-white text-black border border-gray-300 font-normal"
          }`}
        >
          {row.original.status ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <UserModal onChange={updateUser} user={row.original}>
              <Button variant="ghost" size="sm">
                <PencilLine className="h-1 w-1"/>
              </Button>
            </UserModal>
            <AlertDialogComponent
              title="Xóa người dùng"
              description="Bạn có chắc chắn muốn xóa người dùng này không?"
              onConfirm={() => {
              deleteUser(row.original.id);
                }}
              onCancel={() => {}}
            >
              <Button variant="ghost" size="sm">
                <X className="h-1 w-1" />
              </Button>
            </AlertDialogComponent>
          </div>
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
                <Button variant="default" className="bg-[#3569E0] text-white">
                Tạo tài khoản nhân viên
                </Button>
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
