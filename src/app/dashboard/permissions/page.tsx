"use client";
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
  const { roles, permissions, updateMutipleRole } = useRoles();
  const [displayRoles, setDisplayRoles] = useState<Role[]>([]);
  const [displayPermissions, setDisplayPermissions] = useState<
    Array<[string, Permission[]]>
  >([]);
  useEffect(() => {
    if (roles) {
      setDisplayRoles(roles);
    }
  }, [roles]);

  const handlePermissionChange = (role: Role, permission: Permission) => {
    const updatedRoles = displayRoles?.map((r) => {
      const existRoles = r.id === role.id;
      if (existRoles) {
        r.permissions[permission.code] = !r.permissions[permission.code];
      }
      return r;
    });
    setDisplayRoles(updatedRoles);
  };

  const handleSaveChanges = () => {
    updateMutipleRole(displayRoles);
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
                {displayRoles?.map((role) => (
                  <TableHead key={role.name} className="text-center">
                    {RoleVietnameseNames[role.name] || role.name}
                  </TableHead>
                ))}
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayPermissions.map(([group, permissions]) => (
                <React.Fragment key={group}>
                  {/* Dòng hiển thị tên group, merge toàn bộ cột */}
                  <TableRow>
                    <TableCell
                      colSpan={displayRoles.length + 2}
                      className="bg-gray-50 font-semibold text-blue-700 uppercase"
                    >
                      {PermissionGroupVietnameseNames[group] || group}
                    </TableCell>
                  </TableRow>
                  {/* Các quyền trong group */}
                  {permissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">
                        {PermissionVietnameseNames[permission.code] || permission.code}
                      </TableCell>
                      {displayRoles?.map((role) => (
                        <TableCell
                          key={`${role.name}-${permission.code}`}
                          className="text-center"
                        >
                          <Checkbox
                            checked={role.permissions[permission.code]}
                            onCheckedChange={() =>
                              handlePermissionChange(role, permission)
                            }
                          />
                        </TableCell>
                      ))}
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
