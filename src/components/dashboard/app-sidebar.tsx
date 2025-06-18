"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Role } from "@/configs/protect-route";
import {
  AudioWaveform,
  BarChart3,
  BotIcon,
  Command,
  FolderOpen,
  GalleryVerticalEnd,
  Link,
  Merge,
  Radio,
  Settings,
  Shield,
  User,
} from "lucide-react";
import NavMain from "./nav-main";
import { NavUser } from "./nav-user";
import { title } from "process";
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Tự động",
      url: "/dashboard/chat",
      icon: BotIcon,
      isActive: true,
      role: [Role.Staff, Role.Admin, Role.Leader],
      items: [
        {
          title: "Báo cáo",
          icon: BarChart3,
          role: [Role.Admin, Role.Leader],
          url: "/dashboard/report",
        },
        {
          title: "Nhóm tài liệu",
          icon: FolderOpen,
          role: [Role.Admin, Role.Leader],
          url: "/dashboard/departments",
        },
      ],
    },
    {
      title: "Nhân viên",
      url: "/dashboard",
      icon: User,
      isActive: false,
      role: [Role.Admin, Role.Staff, Role.Leader],
      items: [
        {
          title: "Nhân viên",
          icon: User,
          role: [Role.Admin, Role.Leader],
          url: "/dashboard/users",
        },
        {
          title: "Phân quyền",
          icon: Shield,
          role: [Role.Admin],
          url: "/dashboard/roles",
        },
      ],
    },

    {
      title: "Tích hợp",
      url: "/dashboard/channels",
      icon: Link,
      isActive: false,
      role: [Role.Admin, Role.Staff, Role.Leader],
    },
  ],
};

export function AppSidebar({
  setActiveSection,
  ...props
}: {
  setActiveSection: (section: string) => void;
  [key: string]: any;
}) {
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
