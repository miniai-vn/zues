"use client";
import { Button } from "@/components/ui/button";
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
import { RefreshCw, Search, Grid, List } from "lucide-react";

interface DepartmentFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  handleStatusFilter: (status: string) => void;
  onRefetch: () => void;
  isLoading?: boolean;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
}

export const DepartmentFilters: React.FC<DepartmentFiltersProps> = ({
  search,
  setSearch,
  statusFilter,
  handleStatusFilter,
  onRefetch,
  isLoading = false,
  viewMode = "grid",
  onViewModeChange,
}) => {
  const { t } = useTranslations();

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-end">
        {/* Left side - Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search Input */}
          <div className="flex-1">
            <Label htmlFor="search" className="text-sm font-medium mb-2 block">
              {t("dashboard.departments.search") || "Search"}
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="search"
                type="text"
                placeholder={
                  t("dashboard.departments.searchPlaceholder") ||
                  "Search departments..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-48">
            <Label htmlFor="status" className="text-sm font-medium mb-2 block">
              {t("dashboard.departments.status") || "Status"}
            </Label>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    t("dashboard.departments.selectStatus") || "Select Status"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("dashboard.departments.allStatuses") || "All Statuses"}
                </SelectItem>
                <SelectItem value="public">
                  {t("dashboard.departments.public") || "Public"}
                </SelectItem>
                <SelectItem value="private">
                  {t("dashboard.departments.private") || "Private"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right side - Action Buttons and View Controls */}
        <div className="flex gap-2 items-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefetch}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            {t("dashboard.departments.refresh") || "Refresh"}
          </Button>

          {/* View Mode Toggle */}
          {onViewModeChange && (
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
                className="rounded-r-none border-r"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
