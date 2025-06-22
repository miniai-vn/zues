"use client";
import ActionDropdown from "@/components/dashboard/dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@/hooks/data/useAuth";
import { RoleVietnameseNames } from "@/hooks/data/useRoles";
import { useTranslations } from "@/hooks/useTranslations";
import { ColumnDef } from "@tanstack/react-table";
import { Phone, Shield, User as UserIcon } from "lucide-react";
import { CreateOrUpdateUserDialog } from "./CreateOrUpdateUserModal";

interface UseUserTableColumnsProps {
  onUpdateUser: (userData: any) => void;
  onDeleteUser: (id: string) => void;
}

export const useUserTableColumns = ({
  onUpdateUser,
  onDeleteUser,
}: UseUserTableColumnsProps) => {
  const { t } = useTranslations();

  const columns: ColumnDef<User>[] = [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => (
        <div className="text-center font-medium text-muted-foreground">
          {row.index + 1}
        </div>
      ),
      size: 40,
    },
    {
      accessorKey: "name",
      header: t("dashboard.users.name"),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={row.original.avatar}
              alt={row.original.name || "User"}
            />
            <AvatarFallback className="bg-muted">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {row.original.name ?? t("dashboard.users.empty")}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "username",
      header: t("dashboard.users.username"),
      cell: ({ row }) => (
        <div className="w-full">
          <p className="break-all line-clamp-2 text-sm text-muted-foreground">
            {row.original.username}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: t("dashboard.users.phone"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {row.original.phone ?? t("dashboard.users.notHave")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "roles",
      header: t("dashboard.users.roles"),
      cell: ({ row }) => {
        const roles = row.original.roles;
        if (!roles || roles.length === 0) {
          return <div className="w-full"></div>;
        }
        return (
          <div className="flex flex-wrap gap-1 max-w-xs w-full">
            <Badge variant="secondary" className="whitespace-nowrap">
              <Shield className="h-3 w-3 mr-1" />
              {roles
                .map((role) => RoleVietnameseNames[role.name] || role.name)
                .join(", ")}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "departments",
      header: t("dashboard.users.departments"),
      cell: ({ row }) => {
        const departments = row.original.departments;
        if (!departments || departments.length === 0) {
          return <div className="w-full"></div>;
        }
        return (
          <div className="flex flex-wrap gap-1 max-w-xs w-full">
            {departments.map((dept) => (
              <Badge
                key={dept.id}
                variant="outline"
                className="whitespace-nowrap"
              >
                {dept.name}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: t("dashboard.users.actions"),
      cell: ({ row }) => {
        return (
          <ActionDropdown
            className="w-40 p-2"
            children={
              <CreateOrUpdateUserDialog
                children={<span>{t("dashboard.users.edit")}</span>}
                user={row.original}
              />
            }
            onDelete={() => {
              onDeleteUser(row.original.id);
            }}
          />
        );
      },
    },
  ];

  return columns;
};
