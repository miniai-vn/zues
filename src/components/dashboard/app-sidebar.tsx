"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Role } from "@/configs/protect-route";
import { useTranslations } from "@/hooks/useTranslations";
import {
  BarChart3,
  BotIcon,
  FolderOpen,
  Link,
  Shield,
  User,
} from "lucide-react";
import NavMain from "./nav-main";
import { NavUser } from "./nav-user";
export function AppSidebar({
  setActiveSection,
  ...props
}: {
  setActiveSection: (section: string) => void;
  [key: string]: any;
}) {
  const { t } = useTranslations();

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },

    navMain: [
      {
        title: t("dashboard.sidebar.automation"),
        url: "/dashboard/chat",
        icon: BotIcon,
        isActive: true,
        role: [Role.Staff, Role.Admin, Role.Leader],
        items: [
          {
            title: t("dashboard.sidebar.reports"),
            icon: BarChart3,
            role: [Role.Admin, Role.Leader],
            url: "/dashboard/report",
          },
          {
            title: t("dashboard.sidebar.documentGroups"),
            icon: FolderOpen,
            role: [Role.Admin, Role.Leader],
            url: "/dashboard/departments",
          },
        ],
      },
      {
        title: t("dashboard.sidebar.staff"),
        url: "/dashboard",
        icon: User,
        isActive: false,
        role: [Role.Admin, Role.Staff, Role.Leader],
        items: [
          {
            title: t("dashboard.sidebar.employees"),
            icon: User,
            role: [Role.Admin, Role.Leader],
            url: "/dashboard/users",
          },
          {
            title: t("dashboard.sidebar.permissions"),
            icon: Shield,
            role: [Role.Admin],
            url: "/dashboard/roles",
          },
        ],
      },

      {
        title: t("dashboard.sidebar.integration"),
        url: "/dashboard/channels",
        icon: Link,
        isActive: false,
        role: [Role.Admin, Role.Staff, Role.Leader],
      },
    ],
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
            <span className="text-lg font-bold">M</span>
          </div>
          <div className="font-medium text-blue-600">MI9 Portal</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain setActiveSection={setActiveSection} items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
