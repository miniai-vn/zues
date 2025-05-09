"use client";
import { AlertDialogComponent } from "@/components/dashboard/alert-modal";
import { PageHeader } from "@/components/dashboard/common/page-header";
import { DataTable } from "@/components/dashboard/tables/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute, { Role } from "@/configs/protect-route";
import { useAuth, User } from "@/hooks/data/useAuth";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AddOrUpdateUserModal } from "./components/CreateOrUpdateModal";

const RoleName = {
  manager: "Quản lý",
  staff: "Nhân viên",
  admin: "Quản lý hệ thống",
};

const UserComponents = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  useDebouncedValue(search, 500);
  
  const handlePaginationChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };
  const {
    deleteUser,
    createUser,
    updateUser,
    userHasPagination: users,
    refetch,
  } = useAuth({ page, limit: pageSize, search });

  useEffect(() => {
    if (users) {
      setPage(users.page || 1);
      setPageSize(users.limit || 10);
    }
  }, [users]);

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
      accessorKey: "username",
      header: "Chức vụ",
      cell: ({ row }) => (
        <p className="break-all line-clamp-2 w-1/2">{row.original.username}</p>
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
      cell: ({ row }) => {
        const roles = row.original.roles;

        if (!roles || roles.length === 0) {
          return <></>;
        }

        return (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {roles.map((role) => {
              return (
                <Badge
                  key={role.id}
                  variant={"default"}
                  className="whitespace-nowrap"
                >
                  {RoleName[role.name as keyof typeof RoleName]}
                </Badge>
              );
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "departments",
      header: "Phòng ban",
      cell: ({ row }) => {
        const departments = row.original.departments;

        if (!departments || departments.length === 0) {
          return <></>;
        }

        return (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {departments.map((dept) => {
              return (
                <Badge
                  key={dept.id}
                  variant={"default"}
                  className="whitespace-nowrap"
                >
                  {dept.name}
                </Badge>
              );
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
                  <AddOrUpdateUserModal
                    onChange={(data) => {
                      if ("id" in data) {
                        updateUser(data as any);
                      }
                    }}
                    user={row.original}
                  >
                    <div className="flex items-center">
                      <Pencil className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </div>
                  </AddOrUpdateUserModal>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer hover:text-red-600"
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
                    <div className="flex hover:text-red-600 items-center transition-colors ">
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

  return (
    <ProtectedRoute requiredRole={[Role.Admin]}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <PageHeader
          backButtonHref="/dashboard"
          breadcrumbs={[
            {
              label: "Quản lý",
              href: "/dashboard/users",
            },
            {
              label: "Quản lý người dùng",
              isCurrentPage: true,
            },
          ]}
        />
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Tìm kiếm tài tên tài liệu"
            className="mr-4 w-full flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex items-center gap-3">
            <Button
              onClick={() => refetch()}
              className="font-medium px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Search />
              Tìm kiếm
            </Button>
            <AddOrUpdateUserModal
              onChange={(data) => {
                if ("username" in data && "password" in data) {
                  createUser(data);
                }
              }}
            />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={users?.items || []}
          pagination={{
            page: page,
            limit: pageSize,
            total: users?.totalCount || 0,
          }}
          onPaginationChange={handlePaginationChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={!users}
        />
      </div>
    </ProtectedRoute>
  );
};

export default UserComponents;
