"use client";
import { PageHeader } from "@/components/dashboard/common/page-header";
import { Input } from "@/components/ui/input";
import useDepartments from "@/hooks/data/useDepartments";
import { useState } from "react";
import CardDepartmentList from "./components/CardDepartmentList";
import CreateDeptDialog from "./components/dialog/CreateDeptDialog";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

export function DepartmentDetailPage() {
  const { t } = useTranslations();
  const [search, setSearch] = useState("");

  const { departments, createDepartment, refetchDepartments } = useDepartments({
    search,
  });
  useDebouncedValue(search, 500);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex justify-between gap-4 items-center">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("dashboard.departments.searchPlaceholder")}
          className="mr-4 w-full flex-1"
        />{" "}
        <Button
          onClick={() => refetchDepartments()}
          className="font-medium px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Search />
          {t("dashboard.departments.search")}
        </Button>
        <CreateDeptDialog onChange={createDepartment} />
      </div>{" "}
      {departments?.length === 0 ? (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center justify-center">
          <img
            src="/logo.png"
            alt={t("dashboard.departments.emptyState.alt")}
            className="w-32 h-32 mb-4 opacity-70"
          />
          <span className="text-lg text-muted-foreground">
            {t("dashboard.departments.emptyState.title")}
          </span>
          <CreateDeptDialog onChange={createDepartment} />
        </div>
      ) : (
        <CardDepartmentList departments={departments || []} />
      )}
    </div>
  );
}
