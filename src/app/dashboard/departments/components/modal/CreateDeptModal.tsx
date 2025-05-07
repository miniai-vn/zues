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
import AccessControl from "./Authorization";
import CreateOrUpdateForm from "./CreateOrUpdateForm";

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
          <Button>+ Tạo phòng ban mới</Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[800px] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>
            {department ? "Cài đặt phòng ban" : "Tạo phòng ban mới"}
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
            <div className="h-[480px] overflow-y-auto">
              <TabsContent value="settings" className="mt-0 h-full">
                <CreateOrUpdateForm
                  department={department}
                  onSubmit={onChange}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                />
              </TabsContent>
              <TabsContent value="authorization" className="mt-0 h-full">
                {department && <AccessControl department={department} />}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
