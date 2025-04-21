"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import useDepartments, { Department } from "@/hooks/data/useDepartments";

import { Calendar, ChevronDown, Folder, Trash2, User, X } from "lucide-react";
import { useRouter } from "next/navigation"; // Changed from Link import to useRouter

interface CardDepartmentProps {
  department: Department;
}

import { AlertDialogComponent } from "@/components/dashboard/alert-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/hooks/data/useAuth";
import dayjs from "dayjs";
import { useState } from "react";
import CreateDeptModal from "./CreateDeptModal";

function PopoverDept({ department }: { department: Department }) {
  const { addUserToDept } = useDepartments();
  const { users } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  // Email chips state
  const [emails, setEmails] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [shareWithAll, setShareWithAll] = useState<boolean>(false);

  const handleUserSelect = (value: string) => {
    setSelectedUserId(value);
  };

  const handleCreate = () => {
    if (!selectedUserId) return;

    addUserToDept({
      user_id: selectedUserId,
      department_id: department.id as string,
    });

    setSelectedUserId("");
  };

  const handleRemoveEmail = (email: string) => {
    setEmails((prev) => prev.filter((e) => e !== email));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ChevronDown className="cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 rounded-lg">
        {/* Email selection area */}
        <div className="p-2 flex flex-wrap gap-1 min-h-10 border-b">
          <div className="flex flex-wrap gap-1 mb-1">
            {emails.map((email) => (
              <Badge key={email} variant="secondary" className="text-xs">
                {email}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveEmail(email)}
                />
              </Badge>
            ))}
          </div>
          <div className="w-full">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between h-8 text-left font-normal"
                >
                  {inputValue || "Thêm người dùng"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search email..."
                    value={inputValue}
                    onValueChange={setInputValue}
                    className="h-9"
                  />
                  <CommandEmpty>Không tìm thấy người dùng.</CommandEmpty>
                  <CommandGroup>
                    {users?.map((user) => (
                      <CommandItem
                        key={user.username}
                        value={user.username}
                        onSelect={() => {
                          handleUserSelect(user.id as string);
                          setOpen(false);
                        }}
                      >
                        {user.username}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Share with all and Invite button */}
        <div className="px-2 py-1 flex items-center">
          <div className="flex items-center">
            <Checkbox
              id="share-all"
              checked={shareWithAll}
              onCheckedChange={(checked) => setShareWithAll(checked as boolean)}
              className="h-4 w-4 rounded border-gray-400"
            />
            <label htmlFor="share-all" className="ml-2 text-sm">
              Chia sẻ tất cả
            </label>
          </div>
          <Button
            className="ml-auto bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 h-8"
            onClick={handleCreate}
          >
            Mời
          </Button>
        </div>

        {/* Users list */}
        <div className="px-2 py-1 mt-2">
          <p className="text-sm font-medium mb-1">Người đã thêm</p>
          <div className="space-y-1">
            {(department.users || []).map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-0.5"
              >
                <span className="text-sm text-gray-700">{user.username}</span>
                <X
                  className="h-4 w-4 cursor-pointer text-gray-500"
                  // onClick={() => handleRemoveUser(user.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer message */}
        <div className="p-2 mt-1 text-xs text-gray-500 border-t">
          Đã gửi lời mời tới {department.users?.length} người khác
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Update the CardDepartment component to pass department
export function CardDepartment({ department }: CardDepartmentProps) {
  const { deleteDepartment, updateDepartment } = useDepartments();
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
            <Folder className="h-10 w-10 text-yellow-400" />
          </div>
          <div className="flex-1 font-bold text-base">{department.name}</div>
          <div
            className="flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <CreateDeptModal
              onChange={updateDepartment}
              department={department}
            />
            <div className="popover-trigger">
              <PopoverDept department={department} />
            </div>
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
