"use client";
import { PageHeader } from "@/components/dashboard/common/page-header";
import ActionPopover from "@/components/dashboard/popever";
import { DataTable } from "@/components/dashboard/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProtectedRoute, { Role } from "@/configs/protect-route";
import { useAuth, User } from "@/hooks/data/useAuth";
import { RoleVietnameseNames } from "@/hooks/data/useRoles";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { AddOrUpdateUserModal } from "./components/CreateOrUpdateUserModal";

const UserComponents = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  useDebouncedValue(search, 2000);

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
    isFetchingUserHasPagination,
    isPendingUpdateUser,
    isPendingDeleteUser,
    isPendingCreateUser,
  } = useAuth({ page, limit: pageSize, search });

  useEffect(() => {
    if (users) {
      setPage(users.page || 1);
      setPageSize(users.limit || 10);
    }
  }, [users]);

  const columns: ColumnDef<User>[] = [
    {
    id: "index",
    header: "#",
    cell: ({ row }) => (
      <div className="text-center">{row.index + 1}</div>
    ),
    size: 40,
  },
    {
      accessorKey: "name",
      header: "Tên nhân viên",
      cell: ({ row }) => (
        <div className="w-full">
          <p className="break-all line-clamp-2">{row.original.name ?? "Trống"}</p>
        </div>
      ),
    },
    {
      accessorKey: "username",
      header: "Tên tài khoản",
      cell: ({ row }) => (
        <div className="w-full">
          <p className="break-all line-clamp-2">{row.original.username}</p>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Số điện thoại",
      cell: ({ row }) => (
        <div className="w-full">
          <p className="break-all line-clamp-2">{row.original.phone ?? "Trống"}</p>
        </div>
      ),
    },
    {
      accessorKey: "roles",
      header: "Quyền",
      cell: ({ row }) => {
        const roles = row.original.roles;
        if (!roles || roles.length === 0) {
          return <div className="w-full"></div>;
        }
        return (
          <div className="flex flex-wrap gap-1 max-w-xs w-full">
            {roles.map((role) => (
              <Badge
                key={role.id}
                variant={"default"}
                className="whitespace-nowrap"
              >
                {RoleVietnameseNames[role.name] || role.name}
              </Badge>
            ))}
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
          return <div className="w-full"></div>;
        }
        return (
          <div className="flex flex-wrap gap-1 max-w-xs w-full">
            {departments.map((dept) => (
              <Badge
                key={dept.id}
                variant={"default"}
                className="whitespace-nowrap"
              >
                {dept.name}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        return (
          <ActionPopover
            className="w-40 p-2"
            children={
              <AddOrUpdateUserModal
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
                    updateUser(data as any);
                  }
                }}
                user={row.original}
              />
            }
            onDelete={() => {
              deleteUser(row.original.id);
            }}
          >
          </ActionPopover>
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
        <div className="flex justify-between items-center">
          <Input
            placeholder="Tìm kiếm nhân viên theo tên"
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
          isLoading={
            isFetchingUserHasPagination ||
            isPendingUpdateUser ||
            isPendingDeleteUser ||
            isPendingCreateUser
          }
        />
      </div>
    </ProtectedRoute>
  );
};

export default UserComponents;
