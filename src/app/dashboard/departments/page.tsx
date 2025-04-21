"use client";
import { PageHeader } from "@/components/dashboard/common/page-header";
import { Input } from "@/components/ui/input";
import useDepartments from "@/hooks/data/useDepartments";
import { useState } from "react";
import CardDepartmentList from "./components/CardDepartmentList";
import { CreateDeptModal } from "./components/CreateDeptModal";

export default function DepartmentPageComponent() {
  const { departments, createDepartment } = useDepartments();
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
            label: "Quản lý phòng ban",
            href: "/dashboard/departments",
          },
          {
            label: "Quản lý tài liệu",
            isCurrentPage: true,
          },
        ]}
      />
      <div className="flex justify-between gap-4 items-center">
        <Input
          placeholder="Search by question"
          className="mr-4 w-full flex-1"
        />
        <CreateDeptModal onChange={createDepartment} />
      </div>

      {departments?.length === 0 ? (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <p className="text-center text-gray-500">Xếp theo thứ tự</p>
        </div>
      ) : (
        <>
          <CardDepartmentList
            departments={departments || []}
            selectedDepartments={selectedDepartments}
            onSelectionChange={toggleDepartmentSelection}
          />
        </>
      )}
    </div>
  );
}
