"use client";
import { Button } from "@/components/ui/button";
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
import { useTranslations } from "@/hooks/useTranslations";
import { Columns, RefreshCw, Search } from "lucide-react";

interface UserFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  handleStatusFilter: (status: string) => void;
  roleFilter: string;
  handleRoleFilter: (role: string) => void;
  onRefetch: () => void;
  columnVisibility: {
    index: boolean;
    name: boolean;
    username: boolean;
    phone: boolean;
    roles: boolean;
    departments: boolean;
    actions: boolean;
  };
  setColumnVisibility: React.Dispatch<
    React.SetStateAction<{
      index: boolean;
      name: boolean;
      username: boolean;
      phone: boolean;
      roles: boolean;
      departments: boolean;
      actions: boolean;
    }>
  >;
  onCreateUser: (data: any) => void;
}

export const UserFilters = ({
  search,
  setSearch,
  statusFilter,
  handleStatusFilter,
  roleFilter,
  handleRoleFilter,
  onRefetch,
  columnVisibility,
  setColumnVisibility,
  onCreateUser,
}: UserFiltersProps) => {
  const { t } = useTranslations();

  const columnOptions = [
    { id: "index", label: "#" },
    { id: "name", label: t("dashboard.users.name") },
    { id: "username", label: t("dashboard.users.username") },
    { id: "phone", label: t("dashboard.users.phone") },
    { id: "roles", label: t("dashboard.users.roles") },
    { id: "departments", label: t("dashboard.users.departments") },
    { id: "actions", label: t("dashboard.users.actions") },
  ];

  return (
    <div className="flex items-end justify-between gap-4">
      {/* Left side - Filters */}
      <div className="flex gap-4 flex-1">
        {/* Search Input */}
        <div className="space-y-2 min-w-[200px]">
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
        <div className="space-y-2 min-w-[150px]">
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
        </div>

        {/* Role Filter */}
        <div className="space-y-2 min-w-[150px]">
          <Label>{t("dashboard.users.role")}</Label>
          <Select value={roleFilter || "all"} onValueChange={handleRoleFilter}>
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
              <SelectItem value="user">{t("dashboard.users.user")}</SelectItem>
              <SelectItem value="moderator">
                {t("dashboard.users.moderator")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Refresh Button */}
        <div className="space-y-2">
          <Label>&nbsp;</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefetch}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex gap-2 flex-shrink-0">
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
          </DropdownMenuTrigger>
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
                  columnVisibility[column.id as keyof typeof columnVisibility]
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
        </DropdownMenu>
      </div>
    </div>
  );
};
