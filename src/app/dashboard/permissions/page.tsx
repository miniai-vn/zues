"use client";
import { PageHeader } from "@/components/dashboard/common/page-header";
import useRoles, {
  Permission,
  Role
} from "@/hooks/data/useRoles";
import { useState } from "react";

const PermissionsRoles = () => {
  const { roles, permissions, updateMutipleRole } = useRoles();
  const [displayRoles, setDisplayRoles] = useState<Role[]>([]);
  const [displayPermissions, setDisplayPermissions] = useState<
    Array<[string, Permission[]]>
  >([]);
  // useEffect(() => {
  //   if (roles) {
  //     setDisplayRoles(roles);
  //   }
  // }, [roles]);

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
    </div>
  );
};

export default PermissionsRoles;
