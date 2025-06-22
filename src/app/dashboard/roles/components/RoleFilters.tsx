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

interface RoleFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  handleStatusFilter: (status: string) => void;
  onRefetch: () => void;
  columnVisibility: {
    index: boolean;
    name: boolean;
    description: boolean;
    permissions: boolean;
    created_at: boolean;
    updated_at: boolean;
    actions: boolean;
  };
  setColumnVisibility: React.Dispatch<
    React.SetStateAction<{
      index: boolean;
      name: boolean;
      description: boolean;
      permissions: boolean;
      created_at: boolean;
      updated_at: boolean;
      actions: boolean;
    }>
  >;
  onCreateRole: (data: any) => void;
}

export const RoleFilters = ({
  search,
  setSearch,
  statusFilter,
  handleStatusFilter,
  onRefetch,
  columnVisibility,
  setColumnVisibility,
}: RoleFiltersProps) => {
  const { t } = useTranslations();

  const columnOptions = [
    { id: "index", label: "#" },
    { id: "name", label: t("dashboard.roles.name") },
    { id: "description", label: t("dashboard.roles.description") },
    { id: "permissions", label: t("dashboard.roles.permissions") },
    { id: "created_at", label: t("dashboard.roles.createdDate") },
    { id: "updated_at", label: t("dashboard.roles.updatedDate") },
    { id: "actions", label: t("dashboard.roles.actions") },
  ];

  return (
    <div className="flex items-end justify-between gap-4">
      {/* Left side - Filters */}
      <div className="flex gap-4 flex-1">
        {/* Search Input */}
        <div className="space-y-2 min-w-[200px]">
          <Label htmlFor="search">{t("dashboard.roles.search")}</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder={t("dashboard.roles.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2 min-w-[150px]">
          <Label>{t("dashboard.roles.status")}</Label>
          <Select
            value={statusFilter || "all"}
            onValueChange={handleStatusFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("dashboard.roles.allStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("dashboard.roles.allStatus")}
              </SelectItem>
              <SelectItem value="active">
                {t("dashboard.roles.active")}
              </SelectItem>
              <SelectItem value="inactive">
                {t("dashboard.roles.inactive")}
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
              {t("dashboard.roles.toggleColumns")}
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
