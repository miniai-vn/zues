import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/data/useAuth";
import useDepartments, { Department } from "@/hooks/data/useDepartments";
import { Plus } from "lucide-react";
import React from "react";

interface AddMemberDialogProps {
  department: Department;
}

export default function AddMemberDialog({ department }: AddMemberDialogProps) {
  const { users } = useAuth({});
  const { addUserToDept } = useDepartments({});
  const [userId, setUserId] = React.useState<string>("");
  const onChangeUserId = (value: string) => {
    setUserId(value);
  };
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Dialog
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Thêm
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-3">
          <div className="flex items-center justify-between w-full">
            <DialogTitle className="text-lg font-medium">
              Thêm thành viên để truy cập nhóm tài liệu
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-600">
            Thành viên được thêm sẽ có thể truy cập nhóm tài liệu
            <br />
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Select onValueChange={onChangeUserId}>
                <SelectTrigger className="w-full border-gray-300 focus:border-blue-300 focus:outline-none rounded-md h-12">
                  <SelectValue placeholder="Nhập email của thành viên" />
                </SelectTrigger>
                <SelectContent>
                  {(users ?? []).map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-4">
          <Button
            className="w-full border-none h-12"
            onClick={() => {
              try {
                addUserToDept({
                  user_id: userId,
                  department_id: department.id as string,
                });
                setIsOpen(false);
              } catch (error) {
                throw error;
              }
            }}
          >
            Thêm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
