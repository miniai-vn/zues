"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Department } from "@/hooks/data/useDepartments";
import { useState } from "react";
import CreateOrUpdateForm from "../form/CreateOrUpdateDepartmentForm";

interface CreateDeptModalProps {
  department?: Department;
  onChange: (data: {
    id?: string;
    name: string;
    description: string;
    prompt: string;
    isPublic?: boolean;
  }) => void;
}

export default function CreateDeptDialog({
  department,
  onChange,
}: CreateDeptModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <Button>+ Tạo phòng ban mới</Button>
      </DialogTrigger>
      <DialogContent className="w-[800px] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>
            {department ? "Cài đặt phòng ban" : "Tạo phòng ban mới"}
          </DialogTitle>
        </DialogHeader>
        <div>
          <CreateOrUpdateForm
            department={department}
            onSubmit={({ data }) => onChange(data)}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
