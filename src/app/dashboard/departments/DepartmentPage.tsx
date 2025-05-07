"use client";
import { PageHeader } from "@/components/dashboard/common/page-header";
import { Input } from "@/components/ui/input";
import useDepartments from "@/hooks/data/useDepartments";
import { useState } from "react";
import CardDepartmentList from "./components/CardDepartmentList";
import CreateDeptDialog from "./components/dialog/CreateDeptDialog";

export function DepartmentDetailPage() {
  const { departments, createDepartment, isFetchingDepartments } =
    useDepartments();
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const toggleDepartmentSelection = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedDepartments((prev) => [...prev, id]);
    } else {
      setSelectedDepartments((prev) => prev.filter((deptId) => deptId !== id));
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <PageHeader
        backButtonHref="/dashboard/departments"
        breadcrumbs={[
          {
            label: "Quản lý",
            href: "/dashboard/bot",
          },
          {
            label: "Quản lý phòng ban",
            href: "/dashboard/departments",
            isCurrentPage: true,
          },
        ]}
      />
      <div className="flex justify-between gap-4 items-center">
        <Input
          placeholder="Search by question"
          className="mr-4 w-full flex-1"
        />
        <CreateDeptDialog onChange={createDepartment} />
      </div>

      {departments?.length === 0 ? (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0"></div>
      ) : (
        <>
          <CardDepartmentList
            isLoading={isFetchingDepartments}
            departments={departments || []}
            selectedDepartments={selectedDepartments}
            onSelectionChange={toggleDepartmentSelection}
          />
        </>
      )}
    </div>
  );
}
