"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Role } from "@/configs/protect-route";
import {
  ArrowUpCircleIcon,
  AudioWaveform,
  BotIcon,
  Command,
  CompassIcon,
  GalleryVerticalEnd,
  Settings,
  SquareTerminal,
} from "lucide-react";
import Image from "next/image";
import * as React from "react";
import NavMain from "./nav-main";
import { NavUser } from "./nav-user";
import { DashboardIcon } from "@radix-ui/react-icons";
import { TeamSwitcher } from "./team-switcher";
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Quản lý",
      url: "/dashboard/chat",
      icon: BotIcon,
      isActive: true,
      role: [Role.Staff, Role.Admin, Role.Leader],
      items: [
        {
          title: "Báo cáo",
          icon: DashboardIcon,
          role: [Role.Admin, Role.Leader],
          url: "/dashboard/report",
        },
        {
          title: "Nhóm tài liệu",
          icon: CompassIcon,
          role: [Role.Admin, Role.Leader],
          url: "/dashboard/departments",
        },
        {
          title: "Bhân viên",
          icon: SquareTerminal,
          role: [Role.Admin, Role.Leader],
          url: "/dashboard/users",
        },
        {
          title: "Phân quyền",
          icon: SquareTerminal,
          role: [Role.Admin],
          url: "/dashboard/roles",
        },
        {
          title: "Kênh truyền thông",
          icon: SquareTerminal,
          role: [Role.Admin, Role.Leader],
          url: "/dashboard/channels",
        },
        {
          title: "Cài đặt",
          icon: Settings,
          role: [Role.Admin],
          url: "/dashboard/settings",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
