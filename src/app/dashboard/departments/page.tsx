"use client";
import { Input } from "@/components/ui/input";
import useDepartments from "@/hooks/data/useDepartments";
import { useState } from "react";
import CardDepartmentList from "./components/CardDepartmentList";
import { CreateDeptModal } from "./components/CreateDeptModal";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
      <div className="flex items-center gap-2 py-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Quản lý phòng ban</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
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
