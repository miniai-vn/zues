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
import useRoles, { Permission, PermissionVietnameseNames, Role, RoleVietnameseNames } from "@/hooks/data/useRoles";
import { useEffect, useState } from "react";


const PermissionsRoles = () => {
  const { roles, permissions, updateRole } = useRoles();
  const [displayRoles, setDisplayRoles] = useState<Role[]>([]);
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
    const promise = displayRoles?.map((role) => {
      return updateRole({
        id: role.id,
        name: role.name,
        permissions: role.permissions,
      });
    });
    Promise.all(promise);
  };

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

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="mb-6">
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
              {permissions?.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="font-medium">
                    {PermissionVietnameseNames[permission.code] ||
                      permission.name}
                  </TableCell>
                  {displayRoles?.map((role) => (
                    <TableCell
                      key={`${role.name}-${permission}`}
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
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 flex justify-between">
          <Button onClick={handleSaveChanges} variant="default">
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsRoles;
