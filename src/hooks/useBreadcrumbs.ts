import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";

interface Breadcrumb {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

export const useBreadcrumbs = (title: string) => {
  const { t } = useTranslations();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  useEffect(() => {
    const generateBreadcrumbs = () => {
      switch (title.toLowerCase()) {
        case "employees":
          return [
            {
              label: t("dashboard.users.breadcrumbs.management"),
              href: "/dashboard/users",
            },
            {
              label: t("dashboard.users.breadcrumbs.userManagement"),
              isCurrentPage: true,
            },
          ];

        case "permissions":
          return [
            {
              label: t("dashboard.roles.breadcrumbs.management"),
              href: "/dashboard/roles",
            },
            {
              label: t("dashboard.roles.breadcrumbs.roleManagement"),
              isCurrentPage: true,
            },
          ];

        case "roles":
          return [
            {
              label: t("dashboard.roles.breadcrumbs.management"),
              href: "/dashboard/roles",
            },
            {
              label: t("dashboard.roles.breadcrumbs.roleManagement"),
              isCurrentPage: true,
            },
          ];

        default:
          return [];
      }
    };

    setBreadcrumbs(generateBreadcrumbs());
  }, [title, t]);

  return breadcrumbs;
};
