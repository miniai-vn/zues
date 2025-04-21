"use client";

import {
  AudioWaveform,
  BotIcon,
  Command,
  CompassIcon,
  GalleryVerticalEnd,
  Settings,
  SquareTerminal,
} from "lucide-react";
import * as React from "react";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Role } from "@/configs/protect-route";
import { NavUser } from "./nav-user";
import NavMain from "./nav-main";

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
      title: "Trò chuyện với bot",
      url: "/dashboard/bot",
      icon: BotIcon,
      isActive: true,
      role: [Role.Staff, Role.Manager],
      // items: [
      //   {
      // title: "Bot",
      // url: "/dashboard/bot",
      // icon: SquareTerminal,
      // isActive: true,
      // role: [Role.Staff, Role.Manager],
      //   },
      // ],
    },
    {
      title: "Quản lý phòng ban",
      icon: CompassIcon,
      isActive: false,
      role: [Role.Manager],
      url: "/dashboard/departments",

      // items: [
      //   {
      //     title: "Quản lý phòng ban",
      //     url: "/dashboard/departments",
      //     icon: SquareTerminal,
      //     isActive: true,
      //     role: [Role.Manager],
      //   },
      // ],
    },
    {
      title: "Quản lý nhân viên",
      icon: SquareTerminal,
      isActive: true,
      role: [Role.Manager],
      url: "/dashboard/users",

      // items: [
      //   {
      //     title: "Users",
      //     url: "/dashboard/users",
      //     icon: SquareTerminal,
      //     isActive: true,
      //     role: [Role.Manager],
      //   },
      // ],
    },

    {
      title: "Cài đặt",
      icon: Settings,
      isActive: true,
      role: [Role.Manager],
      url: "/dashboard/users",

      // items: [
      //   {
      //     title: "Users",
      //     url: "/dashboard/users",
      //     icon: SquareTerminal,
      //     isActive: true,
      //     role: [Role.Manager],
      //   },
      // ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="w-full h-auto"
          />
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
