"use client";

import { PageHeader } from "@/components/dashboard/common/page-header";
import { useParams } from "next/navigation";
import useRoles from "@/hooks/data/useRoles";

const UserDetailComponents = () => {
  const params = useParams();
  const userId = params.id as string;
  const { roles } = useRoles();
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <PageHeader
        backButtonHref="/dashboard/users"
        breadcrumbs={[
          {
            label: "Quản lý",
            href: "/dashboard",
          },
          {
            label: "Quản lý người dùng",
            href: "/dashboard/users",
          },
          {
            label: "Chi tiết người dùng",
            isCurrentPage: true,
          },
        ]}
      />
      <div>
        <span>Cài đặt quyền</span>
        {roles?.items?.map((role) => (
          <div key={role.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              value={role.name}
              checked={role.name === userId}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span>{role.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDetailComponents;
