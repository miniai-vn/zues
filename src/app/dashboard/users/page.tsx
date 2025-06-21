"use client";
import ActionDropdown from "@/components/dashboard/dropdown";
import { DataTable } from "@/components/dashboard/tables/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/hooks/data/useAuth";
import { RoleVietnameseNames } from "@/hooks/data/useRoles";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useTranslations } from "@/hooks/useTranslations";
import { useUsersQuery } from "@/hooks/useUser";
import { ColumnDef } from "@tanstack/react-table";
import {
  Columns,
  Filter,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Shield,
  User as UserIcon,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AddOrUpdateUserModal } from "./components/CreateOrUpdateUserModal";

const UserManager = () => {
  const { t } = useTranslations();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Column visibility state
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
    clearAllFilters,
    filters,
    hasFilters,
    paginationInfo,
  } = useUsersQuery({
    initialPage: 1,
    initialPageSize: 10,
    initialFilters: {
      status: "active", // Default filter
    },
  });

  // Update search filter when debounced search changes
  useEffect(() => {
    if (debouncedSearch) {
      updateFilter("search", debouncedSearch);
    } else {
      clearFilter("search");
    }
  }, [debouncedSearch, updateFilter, clearFilter]);

  // Update status filter
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    if (status && status !== "all") {
      updateFilter("status", status);
    } else {
      clearFilter("status");
    }
  };

  // Update role filter
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

  // Mock functions for user operations
  const deleteUser = async (id: string) => {
    refetch();
  };

  const createUser = async (userData: any) => {
    console.log("Create user:", userData);
    refetch();
  };

  const updateUser = async (userData: any) => {
    console.log("Update user:", userData);
    refetch();
  };

  const columns: ColumnDef<User>[] = [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => (
        <div className="text-center font-medium text-muted-foreground">
          {row.index + 1}
        </div>
      ),
      size: 40,
    },
    {
      accessorKey: "name",
      header: t("dashboard.users.name"),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={row.original.avatar}
              alt={row.original.name || "User"}
            />
            <AvatarFallback className="bg-muted">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {row.original.name ?? t("dashboard.users.empty")}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "username",
      header: t("dashboard.users.username"),
      cell: ({ row }) => (
        <div className="w-full">
          <p className="break-all line-clamp-2 text-sm text-muted-foreground">
            {row.original.username}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: t("dashboard.users.phone"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
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
                variant="outline"
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
          />
        );
      },
    },
  ];
  // Filter columns based on visibility
  const visibleColumns = columns.filter((column) => {
    const columnId = column.id || (column as any).accessorKey;
    return columnVisibility[columnId as keyof typeof columnVisibility];
  });

  // Column visibility options with labels
  const columnOptions = [
    { id: "index", label: "#" },
    { id: "name", label: t("dashboard.users.name") },
    { id: "username", label: t("dashboard.users.username") },
    { id: "phone", label: t("dashboard.users.phone") },
    { id: "roles", label: t("dashboard.users.roles") },
    { id: "departments", label: t("dashboard.users.departments") },
    { id: "actions", label: t("dashboard.users.actions") },
  ];

  if (isFetchingUserHasPagination) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Skeleton className="h-8 w-full" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {" "}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.users.totalUsers")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {paginationInfo.totalItems}
            </div>
            <p className="text-xs text-muted-foreground">
              {hasFilters
                ? t("dashboard.users.filteredResults")
                : t("dashboard.users.allUsers")}
            </p>
          </CardContent>
        </Card>{" "}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.users.currentPage")}
            </CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {paginationInfo.page} / {paginationInfo.totalPages}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("dashboard.users.pageOf", {
                page: paginationInfo.page,
                totalPages: paginationInfo.totalPages,
              })}
            </p>
          </CardContent>
        </Card>{" "}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("dashboard.users.activeFilters")}
            </CardTitle>
            <Badge variant={hasFilters ? "default" : "secondary"}>
              {Object.keys(filters).length}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasFilters
                ? t("dashboard.users.filtered")
                : t("dashboard.users.all")}
            </div>
            <p className="text-xs text-muted-foreground">
              {hasFilters
                ? t("dashboard.users.activeFiltersCount", {
                    count: Object.keys(filters).length,
                  })
                : t("dashboard.users.noFiltersApplied")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t("dashboard.users.userManagement")}
          </CardTitle>
          <CardDescription>
            {t("dashboard.users.userManagementDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters Section */}
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              {/* Search Input */}
              <div className="space-y-2">
                <Label htmlFor="search">{t("dashboard.users.search")}</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder={t("dashboard.users.searchPlaceholder")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>{" "}
              {/* Status Filter */}
              <div className="space-y-2">
                <Label>{t("dashboard.users.status")}</Label>
                <Select
                  value={statusFilter || "all"}
                  onValueChange={handleStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("dashboard.users.allStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("dashboard.users.allStatus")}
                    </SelectItem>
                    <SelectItem value="active">
                      {t("dashboard.users.active")}
                    </SelectItem>
                    <SelectItem value="inactive">
                      {t("dashboard.users.inactive")}
                    </SelectItem>
                    <SelectItem value="pending">
                      {t("dashboard.users.pending")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>{" "}
              {/* Role Filter */}
              <div className="space-y-2">
                <Label>{t("dashboard.users.role")}</Label>
                <Select
                  value={roleFilter || "all"}
                  onValueChange={handleRoleFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("dashboard.users.allRoles")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("dashboard.users.allRoles")}
                    </SelectItem>
                    <SelectItem value="admin">
                      {t("dashboard.users.admin")}
                    </SelectItem>
                    <SelectItem value="user">
                      {t("dashboard.users.user")}
                    </SelectItem>
                    <SelectItem value="moderator">
                      {t("dashboard.users.moderator")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>{" "}
              {/* Action Buttons */}
              <div className="space-y-2">
                <Label>{t("dashboard.users.actions")}</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {t("dashboard.users.refresh")}
                  </Button>
                  {/* Column Visibility Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Columns className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>{" "}
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>
                        {t("dashboard.users.toggleColumns")}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {columnOptions.map((column) => (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={
                            columnVisibility[
                              column.id as keyof typeof columnVisibility
                            ]
                          }
                          onCheckedChange={(value) =>
                            setColumnVisibility((prev) => ({
                              ...prev,
                              [column.id]: value,
                            }))
                          }
                        >
                          {column.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>{" "}
                  <AddOrUpdateUserModal
                    children={
                      <Button size="sm" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        {t("dashboard.users.addUser")}
                      </Button>
                    }
                    onChange={(data) => {
                      if ("username" in data && "password" in data) {
                        createUser(data);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Data Table */}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManager;
