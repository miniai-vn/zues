"use client";
import { Input } from "@/components/ui/input";
import useDepartments from "@/hooks/data/useDepartments";
import { useState } from "react";
import CardDepartmentList from "./components/CardDepartmentList";
import { CreateDeptModal } from "./components/CreateDeptModal";

const DepartmentComponent = () => {
  const { departments, createDepartment } = useDepartments();
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  // Handle individual department selection
  const toggleDepartmentSelection = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedDepartments((prev) => [...prev, id]);
    } else {
      setSelectedDepartments((prev) => prev.filter((deptId) => deptId !== id));
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
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
};

export default DepartmentComponent;
