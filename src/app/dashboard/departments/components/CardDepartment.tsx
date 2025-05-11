"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import useDepartments, { Department } from "@/hooks/data/useDepartments";

import { Calendar, Folder, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation"; // Changed from Link import to useRouter

interface CardDepartmentProps {
  department: Department;
}

import { AlertDialogComponent } from "@/components/dashboard/alert-modal";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import CreateOrUpdateDeptModal from "./modal/CreateDeptModal";

// Update the CardDepartment component to pass department
export function CardDepartment({ department }: CardDepartmentProps) {
  const { deleteDepartment, updateDepartment } = useDepartments({});
  const router = useRouter(); // Added router

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking on buttons or the popover
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest(".popover-trigger")
    ) {
      e.stopPropagation();
      return;
    }

    // Navigate programmatically when card is clicked
    router.push(`/dashboard/departments/${department.id}`);
  };

  return (
    <Card
      className="w-full max-w-md border border-dashed border-gray-300 rounded-md cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <CardHeader className="p-0">
        <div className="flex items-center p-4 pb-2">
          <div className="mr-3">
            <Folder className="h-8 w-8" />
          </div>
          <span className="flex-1 font-bold truncate">{department.name}</span>
          <div
            className="flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <CreateOrUpdateDeptModal
              onChange={updateDepartment}
              department={department}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 py-2 h-[60px] overflow-hidden">
        <p className="text-gray-600 text-sm line-clamp-2">
          {department.description}
        </p>
      </CardContent>

      <CardFooter className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center bg-blue-100 text-blue-700 rounded-md px-2 py-1">
            <User className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">{"Gia Minh"}</span>
          </div>
          <span className="mx-2 text-gray-300">•</span>
          <div className="flex items-center text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-xs">
              {dayjs(department.createdAt).format("DD/MM/YYYY")}
            </span>
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <AlertDialogComponent
            description="Bạn có chắc chắn muốn xóa phòng ban này không?"
            title="Xóa phòng ban"
            onConfirm={() => deleteDepartment(department.id as string)}
            onCancel={() => {}}
            // eslint-disable-next-line react/no-children-prop
            children={
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Trash2 className="h-4 w-4 text-gray-400" />
              </Button>
            }
          ></AlertDialogComponent>
        </div>
      </CardFooter>
    </Card>
  );
}
