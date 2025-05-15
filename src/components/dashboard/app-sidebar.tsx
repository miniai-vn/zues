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
      role: [Role.Staff, Role.Admin],
      items: [
        {
          title: "Quản lý nhóm tài liệu",
          icon: CompassIcon,
          role: [Role.Admin],
          url: "/dashboard/departments",
        },
        {
          title: "Quản lý nhân viên",
          icon: SquareTerminal,
          role: [Role.Admin],
          url: "/dashboard/users",
        },
        {
          title: "Cài đặt phân quyền",
          icon: SquareTerminal,
          role: [Role.Admin],
          url: "/dashboard/permissions",
        },
        // {
        //   title: "Cài đặt",
        //   icon: Settings,
        //   role: [Role.Admin],
        //   url: "/dashboard/users",
        // },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center gap-2">
          <img src="/logo.png" alt="logo" className="h-12 w-full px-4" />
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
