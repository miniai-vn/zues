"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "@/hooks/useTranslations";
import { Filter, Users } from "lucide-react";

interface UserStatsCardsProps {
  paginationInfo: {
    totalItems: number;
    page: number;
    totalPages: number;
  };
  hasFilters: boolean;
  filters: Record<string, any>;
}

export const UserStatsCards = ({
  paginationInfo,
  hasFilters,
  filters,
}: UserStatsCardsProps) => {
  const { t } = useTranslations();

  return (
    <div className="grid gap-4 md:grid-cols-3">
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
      </Card>

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
      </Card>

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
  );
};
