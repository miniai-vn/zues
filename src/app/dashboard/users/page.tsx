"use client";
import { PageHeader } from "@/components/dashboard/common/page-header";
import ActionDropdown from "@/components/dashboard/dropdown";
import { DataTable } from "@/components/dashboard/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Filter,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Shield,
  User as UserIcon,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AddOrUpdateUserModal } from "./components/CreateOrUpdateUserModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import RoleSelector from "../roles/components/RoleSelector";

const UserManager = () => {
  const { t } = useTranslations();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

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

  // Clear all filters
  const handleClearAllFilters = () => {
    setSearch("");
    setStatusFilter("all"); // Change to "all"
    setRoleFilter("all"); // Change to "all"
    clearAllFilters();
  };

  // Clear individual filter
  const handleClearFilter = (filterKey: string) => {
    switch (filterKey) {
      case "search":
        setSearch("");
        break;
      case "status":
        setStatusFilter("all"); // Change to "all" instead of ""
        break;
      case "role":
        setRoleFilter("all"); // Change to "all" instead of ""
        break;
    }
    clearFilter(filterKey);
  };

  const handlePaginationChange = (newPage: number) => {
    goToPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    updatePageSize(newSize);
  };

  // Mock functions for user operations
  const deleteUser = async (id: string) => {
    console.log("Delete user:", id);
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
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </div>
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
      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            Manage and filter users in your system. Use the filters below to
            find specific users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Label className="text-base font-medium">Filters</Label>
            </div>

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
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={statusFilter || "all"}
                  onValueChange={handleStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Role Filter */}
              <div className="space-y-2">
                <Label>Role</Label>
                <RoleSelector
                  value={roleFilter || "all"}
                  onValueChange={handleRoleFilter}
                  placeholder="All Roles"
                  includeAllOption={true}
                  allOptionLabel="All Roles"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Label>Actions</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                  <AddOrUpdateUserModal
                    children={
                      <Button size="sm" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add User
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
            columns={columns}
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
