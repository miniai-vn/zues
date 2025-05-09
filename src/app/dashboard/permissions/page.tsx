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
import useRoles, { Permission, Role } from "@/hooks/data/useRoles";
import { useEffect, useState } from "react";
export const RoleVietnameseNames: Record<string, string> = {
  admin: "Quản trị viên",
  moderator: "Người kiểm duyệt",
  developer: "Nhà phát triển",
  support_agent: "Nhân viên hỗ trợ",
  content_creator: "Người tạo nội dung",
  user: "Người dùng",
  guest: "Khách",
};

export const PermissionVietnameseNames: Record<string, string> = {
  // File
  "file.create": "Tải lên tệp",
  "file.read": "Xem tệp",
  "file.update": "Chỉnh sửa thông tin tệp",
  "file.delete": "Xoá tệp",
  "file.download": "Tải xuống tệp",
  "file.share": "Chia sẻ tệp",
  "file.access_sensitive": "Truy cập tệp nhạy cảm",

  // Chat
  "chat.read": "Xem lịch sử trò chuyện",
  "chat.create": "Gửi tin nhắn",
  "chat.update": "Chỉnh sửa tin nhắn",
  "chat.delete": "Xoá tin nhắn",
  "chat.train": "Huấn luyện chatbot",
  "chat.manage_settings": "Quản lý cài đặt chatbot",

  // User
  "user.create": "Tạo người dùng",
  "user.read": "Xem người dùng",
  "user.update": "Cập nhật người dùng",
  "user.delete": "Xoá người dùng",
  "user.ban": "Cấm hoặc mở cấm người dùng",
  "user.assign_role": "Gán vai trò cho người dùng",

  // Role & Permission
  "role.create": "Tạo vai trò",
  "role.read": "Xem vai trò",
  "role.update": "Cập nhật vai trò",
  "role.delete": "Xoá vai trò",
  "permission.assign": "Gán quyền cho vai trò",
  "permission.read": "Xem tất cả quyền",

  // Settings
  "setting.read": "Xem cài đặt hệ thống",
  "setting.update": "Cập nhật cài đặt hệ thống",
  "setting.reset": "Đặt lại hệ thống",

  // Department
  "department.create": "Tạo phòng ban",
  "department.read": "Xem phòng ban và thành viên",
  "department.update": "Cập nhật phòng ban",
  "department.delete": "Xoá phòng ban",
  "department.assign_user": "Gán người dùng vào phòng ban",
  "department.manage_roles": "Quản lý vai trò cấp phòng ban",
};

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
