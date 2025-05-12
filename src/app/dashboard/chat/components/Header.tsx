import { Selector } from "@/components/dashboard/selector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useDepartments from "@/hooks/data/useDepartments";
import React from "react";

interface ChatHeaderProps {
  modelName?: string;
  isMemoryFull?: boolean;
  avatarSrc?: string;
  avatarFallback?: string;
  onModelChange?: (model: string) => void;
  onTemporaryClick?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  avatarSrc,
  avatarFallback = "M",
}) => {
  const {
    selectedDepartmentId,
    departments = [],
    changeDepartment,
  } = useDepartments({});

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between w-full px-4 py-2 border-b bg-background">
      {/* Model selector with dropdown */}
      <Selector
        items={(departments ?? []).map((dept) => {
          return {
            label: dept.name as string,
            value: dept.id as string,
          };
        })}
        className="w-[140px] border-0 hover:bg-gray-100 transition-colors"
        value={selectedDepartmentId}
        placeholder="Chọn nhóm tài liệu"
        onChange={(value: string | number | (string | number)[]) => {
          if (typeof value === "string" || typeof value === "number") {
            return changeDepartment(value.toString());
          }
        }}
      />

      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatarSrc} alt="User avatar" />
          <AvatarFallback className="bg-purple-500 text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default ChatHeader;
