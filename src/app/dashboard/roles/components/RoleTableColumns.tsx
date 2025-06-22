"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/useTranslations";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import CreateOrUpdateRoleDialog from "./CreateOrUpdateDialog";

interface RoleType {
  id: number;
  name: string;
  description: string;
  permissions: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

interface UseRoleTableColumnsProps {
  onUpdateRole: (roleData: any) => void;
  onDeleteRole: (id: string) => void;
}

export const useRoleTableColumns = ({
  onUpdateRole,
  onDeleteRole,
}: UseRoleTableColumnsProps): ColumnDef<RoleType>[] => {
  const { t } = useTranslations();
  const router = useRouter();

  return [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
      size: 40,
    },
    {
      accessorKey: "name",
      header: t("dashboard.roles.name"),
      cell: ({ row }) => (
        <div className="w-full">
          <Badge variant="default" className="whitespace-nowrap">
            {row.original.name}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: t("dashboard.roles.description"),
      cell: ({ row }) => (
        <div className="w-full">
          <p className="break-all line-clamp-2">
            {row.original.description || t("dashboard.roles.empty")}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "permissions",
      header: t("dashboard.roles.permissions"),
      cell: ({ row }) => {
        const activePermissions = Object.entries(
          row.original.permissions || {}
        ).filter(([_, value]) => value).length;
        return (
          <div className="w-full">
            <Badge variant="secondary">
              {activePermissions} {t("dashboard.roles.permissionsCount")}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: t("dashboard.roles.createdDate"),
      cell: ({ row }) => (
        <div>
          {row.original.created_at
            ? new Date(row.original.created_at).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "updated_at",
      header: t("dashboard.roles.updatedDate"),
      cell: ({ row }) => (
        <div>
          {row.original.updated_at
            ? new Date(row.original.updated_at).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "-"}
        </div>
      ),
    },
    {
      id: "actions",
      header: t("dashboard.roles.actions"),
      cell: ({ row }) => {
        const role = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {/* View Role Details */}
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/roles/${role.id}`)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                {t("dashboard.roles.viewDetails")}
              </DropdownMenuItem>

              {/* Edit Role */}
              <CreateOrUpdateRoleDialog
                role={role}
                onChange={(data) => {
                  if ("id" in data) {
                    onUpdateRole({
                      id: role.id,
                      data: data,
                    });
                  }
                }}
              >
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="flex items-center gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  {t("dashboard.roles.edit")}
                </DropdownMenuItem>
              </CreateOrUpdateRoleDialog>

              <DropdownMenuSeparator />

              {/* Delete Role */}
              <DropdownMenuItem
                onClick={() => {
                  if (confirm(t("dashboard.roles.confirmDelete"))) {
                    onDeleteRole(String(role.id));
                  }
                }}
                className="flex items-center gap-2 text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                {t("dashboard.roles.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
