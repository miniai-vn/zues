import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface RoleSelectorProps {
  roles?: Role[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
}

const defaultRoles: Role[] = [
  { id: "admin", name: "Admin", description: "Administrator access" },
  { id: "user", name: "User", description: "Standard user access" },
  { id: "moderator", name: "Moderator", description: "Moderation access" },
];

const RoleSelector: React.FC<RoleSelectorProps> = ({
  roles = defaultRoles,
  value,
  onValueChange,
  placeholder = "Select a role",
  disabled = false,
  className,
  includeAllOption = false,
  allOptionLabel = "All Roles",
}) => {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {includeAllOption && (
          <SelectItem value="all">{allOptionLabel}</SelectItem>
        )}
        {roles.map((role) => (
          <SelectItem key={role.id} value={role.id}>
            <div className="flex flex-col">
              <span className="font-medium">{role.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default RoleSelector;
