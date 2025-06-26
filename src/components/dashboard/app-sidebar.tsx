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
  MessageCircleMore,
  MessageSquarePlus,
  Shield,
  User,
  UserCog2Icon,
} from "lucide-react";
import NavMain from "./nav-main";
import { NavUser } from "./nav-user";
import { title } from "process";
export function AppSidebar({
  setActiveSection,
  ...props
}: {
  setActiveSection: (section: string) => void;
  [key: string]: any;
}) {
  const { t } = useTranslations();

  const navMain = [
    {
      title: t("dashboard.sidebar.chat"),
      // url: "/dashboard/chat",
      icon: MessageSquarePlus,
      role: [Role.Staff, Role.Admin, Role.Leader],
      items: [
        {
          title: t("dashboard.sidebar.chat"),
          icon: MessageCircleMore,
          role: [Role.Staff, Role.Admin, Role.Leader],
          url: "/dashboard/chat",
        },
        {
          title: t("dashboard.sidebar.chatCS"),
          icon: BotIcon,
          role: [Role.Admin, Role.Leader],
          url: "/chat",
        },
      ],
    },
    {
      title: t("dashboard.sidebar.automation"),
      url: "/dashboard/chat",
      icon: BotIcon,
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
        {
          title: "Agent",
          icon: BotIcon,
          role: [Role.Admin, Role.Staff, Role.Leader],
          url: "/dashboard/agents",
        },
      ],
    },
    {
      title: t("dashboard.sidebar.staff"),
      // url: "/dashboard",
      icon: UserCog2Icon,
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
  ];
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center pr-2 pl-4  pt-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full">
            <img
              src="/logoin-vectical.png"
              alt="Pulse Robot Logo"
              className="h-7 sm:h-8"
            />
          </div>
          <div className="font-medium ">MI9 Dashboard</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain setActiveSection={setActiveSection} items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
