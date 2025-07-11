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

interface ResourceFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: string;
  handleStatusFilter: (status: string) => void;
  typeFilter: string;
  handleTypeFilter: (type: string) => void;
  onRefetch: () => void;
  columnVisibility: {
    index: boolean;
    name: boolean;
    type: boolean;
    size: boolean;
    description: boolean;
    createdAt: boolean;
    status: boolean;
    actions: boolean;
  };
  setColumnVisibility: React.Dispatch<
    React.SetStateAction<{
      index: boolean;
      name: boolean;
      type: boolean;
      size: boolean;
      description: boolean;
      createdAt: boolean;
      status: boolean;
      actions: boolean;
    }>
  >;
  onCreateResource?: () => void;
}

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  search,
  setSearch,
  statusFilter,
  handleStatusFilter,
  typeFilter,
  handleTypeFilter,
  onRefetch,
  columnVisibility,
  setColumnVisibility,
}) => {
  const { t } = useTranslations();

  const toggleColumnVisibility = (column: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: !prev[column as keyof typeof prev],
    }));
  };

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
                  t("dashboard.departments.detail.searchDocumentPlaceholder") ||
                  "Search documents..."
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
              {t("dashboard.departments.detail.status") || "Status"}
            </Label>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    t("dashboard.resources.selectStatus") || "Select Status"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("dashboard.resources.allStatuses") || "All Statuses"}
                </SelectItem>
                <SelectItem value="new">
                  {t("dashboard.departments.detail.statusValues.new") || "New"}
                </SelectItem>
                <SelectItem value="processing">
                  {t("dashboard.departments.detail.statusValues.processing") ||
                    "Processing"}
                </SelectItem>
                <SelectItem value="finished">
                  {t("dashboard.departments.detail.statusValues.finished") ||
                    "Completed"}
                </SelectItem>
                <SelectItem value="active">
                  {t("dashboard.departments.detail.statusValues.active") ||
                    "Active"}
                </SelectItem>
                <SelectItem value="error">
                  {t("dashboard.resources.error") || "Error"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div className="w-full sm:w-48">
            <Label htmlFor="type" className="text-sm font-medium mb-2 block">
              {t("dashboard.departments.detail.documentType") || "Type"}
            </Label>
            <Select value={typeFilter} onValueChange={handleTypeFilter}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    t("dashboard.resources.selectType") || "Select Type"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("dashboard.resources.allTypes") || "All Types"}
                </SelectItem>
                <SelectItem value="document">
                  {t("dashboard.resources.document") || "Document"}
                </SelectItem>
                <SelectItem value="video">
                  {t("dashboard.resources.video") || "Video"}
                </SelectItem>
                <SelectItem value="image">
                  {t("dashboard.resources.image") || "Image"}
                </SelectItem>
                <SelectItem value="audio">
                  {t("dashboard.resources.audio") || "Audio"}
                </SelectItem>
                <SelectItem value="other">
                  {t("dashboard.resources.other") || "Other"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right side - Action Buttons */}
        <div className="flex gap-2 items-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefetch}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {t("dashboard.departments.refresh") || "Refresh"}
          </Button>

          {/* Column Visibility Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Columns className="h-4 w-4" />
                {t("common.columns") || "Columns"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>
                {t("common.toggleColumns") || "Toggle columns"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(columnVisibility).map(([key, value]) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  className="capitalize"
                  checked={value}
                  onCheckedChange={() => toggleColumnVisibility(key)}
                >
                  {t(`dashboard.resources.columns.${key}`) ||
                    key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
