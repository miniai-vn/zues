"use client";
import { PageHeader } from "@/components/dashboard/common/page-header";
import ActionDropdown from "@/components/dashboard/dropdown";
import { DataTable } from "@/components/dashboard/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProtectedRoute, { Role } from "@/configs/protect-route";
import { useAuth, User } from "@/hooks/data/useAuth";
import { RoleVietnameseNames } from "@/hooks/data/useRoles";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useTranslations } from "@/hooks/useTranslations";
import { ColumnDef } from "@tanstack/react-table";
import { Phone, Search, Shield, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AddOrUpdateUserModal } from "./components/CreateOrUpdateUserModal";

const UserManager = () => {
  const { t } = useTranslations();
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
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
      size: 40,
    },
    {
      accessorKey: "name",
      header: t("dashboard.users.name"),
      cell: ({ row }) => (
        <div className="flex  gap-2">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <span>{row.original.name ?? t("dashboard.users.empty")}</span>
        </div>
      ),
    },
    {
      accessorKey: "username",
      header: t("dashboard.users.username"),
      cell: ({ row }) => (
        <div className="w-full">
          <p className="break-all line-clamp-2">{row.original.username}</p>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: t("dashboard.users.phone"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {row.original.phone ?? t("dashboard.users.notHave")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "roles",
      header: t("dashboard.users.roles"),
      cell: ({ row }) => {
        const roles = row.original.roles;
        if (!roles || roles.length === 0) {
          return <div className="w-full"></div>;
        }
        return (
          <div className="flex flex-wrap gap-1 max-w-xs w-full">
            <Badge variant="secondary" className="whitespace-nowrap">
              <Shield className="h-3 w-3 mr-1" />
              {roles
                .map((role) => RoleVietnameseNames[role.name] || role.name)
                .join(", ")}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "departments",
      header: t("dashboard.users.departments"),
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
      header: t("dashboard.users.actions"),
      cell: ({ row }) => {
        return (
          <ActionDropdown
            className="w-40 p-2"
            children={
              <AddOrUpdateUserModal
                children={<span>{t("dashboard.users.edit")}</span>}
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
          ></ActionDropdown>
        );
      },
    },
  ];

  return (
    <ProtectedRoute requiredRole={[Role.Admin]}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {" "}
        <PageHeader
          backButtonHref="/dashboard"
          title=""
          breadcrumbs={[
            {
              label: t("dashboard.users.breadcrumbs.management"),
              href: "/dashboard/users",
            },
            {
              label: t("dashboard.users.breadcrumbs.userManagement"),
              isCurrentPage: true,
            },
          ]}
        />
        <div className="flex justify-between items-center">
          <Input
            placeholder={t("dashboard.users.searchPlaceholder")}
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
              {t("dashboard.users.search")}
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

export default UserManager;
