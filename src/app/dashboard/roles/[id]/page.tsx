"use client";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/dashboard/common/page-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useRoles, {
  Permission,
  PermissionVietnameseNames,
  Role,
  PermissionGroupVietnameseNames,
  RoleVietnameseNames,
} from "@/hooks/data/useRoles";
import React, { useEffect, useState } from "react";

const PermissionsRoles = () => {
  const params = useParams();
  const id = params?.id as string | undefined;

  const { roleWithFullPermissions, permissions, updateMutipleRole } = useRoles({
    id,
  }); // Truyền id vào hook

  // roleWithFullPermissions là 1 object Role
  const [displayRole, setDisplayRole] = useState<Role | null>(null);
  const [displayPermissions, setDisplayPermissions] = useState<
    Array<[string, Permission[]]>
  >([]);

  useEffect(() => {
    if (roleWithFullPermissions) {
      setDisplayRole(roleWithFullPermissions);
    }
  }, [roleWithFullPermissions]);

  const handlePermissionChange = (permission: Permission) => {
    if (!displayRole) return;
    setDisplayRole({
      ...displayRole,
      permissions: {
        ...displayRole.permissions,
        [permission.code]: !displayRole.permissions[permission.code],
      },
    });
  };

  const handleSaveChanges = () => {
    if (displayRole) {
      updateMutipleRole([displayRole]);
    }
  };

  useEffect(() => {
    if (permissions) {
      const displayPermissions = new Map<string, Permission[]>();
      permissions.forEach((permission) => {
        const group = permission.code.split(".")[0];
        if (!displayPermissions.has(group)) {
          displayPermissions.set(group, []);
        }
        displayPermissions.get(group)?.push(permission);
      });
      setDisplayPermissions(Array.from(displayPermissions));
    }
  }, [permissions]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 scroll-y-auto">
      <PageHeader
        backButtonHref="/dashboard"
        breadcrumbs={[
          {
            label: "Quản lý",
            href: "/dashboard",
          },
          {
            label: "Phân quyền",
            isCurrentPage: true,
          },
        ]}
      />

      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">Vai trò và quyền</h1>
          <p className="text-gray-500">
            Quản lý vai trò người dùng và quyền hạn tương ứng.
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Quyền hạn</TableHead>
                <TableHead className="text-center">
                  {displayRole
                    ? RoleVietnameseNames[displayRole.name] || displayRole.name
                    : ""}
                </TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayPermissions.map(([group, permissions]) => (
                <React.Fragment key={group}>
                  {/* Dòng hiển thị tên group, merge toàn bộ cột */}
                  <TableRow>
                    <TableCell
                      colSpan={2 + 1}
                      className="bg-gray-50 font-semibold text-blue-700 uppercase"
                    >
                      {PermissionGroupVietnameseNames[group] || group}
                    </TableCell>
                  </TableRow>
                  {/* Các quyền trong group */}
                  {permissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">
                        {PermissionVietnameseNames[permission.code] ||
                          permission.code}
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={!!displayRole?.permissions[permission.code]}
                          onCheckedChange={() =>
                            handlePermissionChange(permission)
                          }
                        />
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSaveChanges} variant="default">
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsRoles;
