"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useDepartments from "@/hooks/data/useDepartments";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useTranslations } from "@/hooks/useTranslations";
import { Building2, Plus } from "lucide-react";
import { useState, useMemo } from "react";
import CardDepartmentList from "./components/CardDepartmentList";
import CreateDeptDialog from "./components/dialog/CreateDeptDialog";
import { DepartmentFilters } from "./components/DepartmentFilters";

export function DepartmentDetailPage() {
  const { t } = useTranslations();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const debouncedSearch = useDebouncedValue(search, 500);
  const {
    departments,
    createDepartment,
    refetchDepartments,
    isFetchingDepartments,
  } = useDepartments({
    search: debouncedSearch,
  });

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const handleRefresh = () => {
    refetchDepartments();
  };

  // Filter departments based on status filter
  const filteredDepartments = useMemo(() => {
    if (!departments) return [];

    if (statusFilter === "all") return departments;
    if (statusFilter === "public")
      return departments.filter((dept) => dept.isPublic);
    if (statusFilter === "private")
      return departments.filter((dept) => !dept.isPublic);

    return departments;
  }, [departments, statusFilter]);

  return (
    <div className="flex flex-1 flex-col p-4 pt-0 h-screen">
      <Card className="flex flex-col flex-1 overflow-hidden">
        <CardHeader className="px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {t("dashboard.departments.title") || "Department Management"}
              </CardTitle>
              <CardDescription>
                {t("dashboard.departments.description") ||
                  "Manage and organize your departments efficiently"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <CreateDeptDialog onChange={createDepartment} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 min-h-0 space-y-4">
          <div className="flex-shrink-0">
            <DepartmentFilters
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              handleStatusFilter={handleStatusFilter}
              onRefetch={handleRefresh}
              isLoading={isFetchingDepartments}
            />
            <Separator className="mt-4" />
          </div>

          {/* Department Content */}
          <div className="flex-1 min-h-0 overflow-auto">
            {filteredDepartments.length === 0 && !isFetchingDepartments ? (
              <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center justify-center min-h-[400px]">
                <Building2 className="h-16 w-16 text-gray-400" />
                <span className="text-lg text-muted-foreground">
                  {t("dashboard.departments.emptyState.title") ||
                    "No departments found"}
                </span>
                <span className="text-sm text-muted-foreground">
                  {t("dashboard.departments.emptyState.description") ||
                    "Create your first department to get started"}
                </span>
                <CreateDeptDialog onChange={createDepartment} />
              </div>
            ) : (
              <CardDepartmentList departments={filteredDepartments} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
