'use client";';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth, User } from "@/hooks/data/useAuth";
import useDepartments, {
  Department,
  PERMISSIONS,
} from "@/hooks/data/useDepartments";
import { useTranslations } from "@/hooks/useTranslations";
import { Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface AddMemberDialogProps {
  department: Department;
  user?: User;
}

export default function AddMemberDialog({
  department,
  user,
}: AddMemberDialogProps) {
  const { t } = useTranslations();
  const { users } = useAuth({});
  const [permission, setPermission] = useState("");
  const { addUserToDept, updateUserDept } = useDepartments({});
  const [userId, setUserId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  // Khi user prop thay đổi hoặc dialog mở, cập nhật userId và quyền
  useEffect(() => {
    if (user && isOpen) {
      setUserId(user.id);
      setPermission(user.role?.toString() || "");
    } else if (!isOpen) {
      setUserId("");
      setPermission("");
    }
  }, [user, isOpen]);

  const onChangeUserId = (value: string) => {
    setUserId(value);
  };

  return (
    <Dialog onOpenChange={(open) => setIsOpen(open)} open={isOpen}>
      <DialogTrigger asChild>
        {user ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8"
            aria-label="Edit resource"
          >
            <Pencil className="h-4 w-4 text-gray-500" />
          </Button>
        ) : (          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            {t("add", "Thêm")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-3">          <div className="flex items-center justify-between w-full">
            <DialogTitle className="text-lg font-medium">
              {t("addMemberToAccessGroup", "Thêm thành viên để truy cập nhóm tài liệu")}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-600">
            {t("addedMembersCanAccess", "Thành viên được thêm sẽ có thể truy cập nhóm tài liệu")}
            <br />
          </DialogDescription>
        </DialogHeader>

        <div className="px-6">
          <div className="space-y-1.5">
            <div className="flex space-x-3">
              <div className="flex-1">                <Label
                  htmlFor="email"
                  className="text-sm mb-1.5 font-medium block"
                >
                  {t("email", "Email")}
                </Label>
                <Select value={userId} onValueChange={onChangeUserId}>
                  <SelectTrigger className="w-full border-gray-300 focus:border-blue-300 focus:outline-none rounded-md">
                    <SelectValue placeholder={t("enterMemberEmail", "Nhập email của thành viên")} />
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
              <div className="w-1/3">                <Label
                  htmlFor="permission"
                  className="text-sm font-medium mb-1.5 block"
                >
                  {t("permission", "Quyền")}
                </Label>
                <Select value={permission} onValueChange={setPermission}>
                  <SelectTrigger
                    id="permission"
                    className="w-full border-gray-300 focus:border-blue-300 focus:outline-none rounded-md"
                  >
                    <SelectValue placeholder={t("selectPermission", "Chọn quyền")} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PERMISSIONS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-4">
          <Button
            className="w-full border-none h-12"
            onClick={() => {
              try {
                if(user) {
                 return updateUserDept({
                    user_id: userId,
                    department_id: department.id as string,
                    role: permission,
                  });
                }
                addUserToDept({
                  user_id: userId,
                  department_id: department.id as string,
                  role: permission,
                });
                setIsOpen(false);
              } catch (error) {
                throw error;
              } finally {
                setUserId("");
                setPermission("");
                setIsOpen(false);
              }            }}
            disabled={!userId || !permission}
          >
            {t("add", "Thêm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
