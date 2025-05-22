"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Department } from "@/hooks/data/useDepartments";
import { Pencil } from "lucide-react";
import { useState } from "react";
import CreateOrUpdateForm from "../form/CreateOrUpdateDepartmentForm";
import AccessControl from "./Authorization";

interface CreateDeptModalProps {
  department?: Department;
  onChange: (data: {
    id?: string;
    name: string;
    description: string;
    prompt: string;
  }) => void;
}

export default function CreateOrUpdateDeptModal({
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
        {department ? (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Pencil className="h-4 w-4 text-gray-500" />
          </Button>
        ) : (
          <Button>+ Tạo nhóm tài liệu mới</Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[800px] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>
            {department ? "Cài đặt nhóm tài liệu" : "Tạo nhóm tài liệu mới"}
          </DialogTitle>
        </DialogHeader>
        <div>
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger className="flex-1" value="settings">
                Cài đặt
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="authorization">
                Quyền truy cập
              </TabsTrigger>
            </TabsList>
            <div className="overflow-y-auto">
              <TabsContent value="settings" className="mt-4 h-full">
                <CreateOrUpdateForm
                  department={department}
                  onSubmit={({ data }) => onChange(data)}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                />
              </TabsContent>
              <TabsContent value="authorization" className="mt-4 h-[400px]">
                {department && <AccessControl department={department} />}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
