"use client";

import { SideChat } from "@/app/dashboard/bot/components/SideChat";
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
  PlusCircle,
  Settings,
  SquareTerminal,
} from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { Button } from "../ui/button";
import NavMain from "./nav-main";
import { NavUser } from "./nav-user";
import { useRouter } from "next/navigation";
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
      url: "/dashboard/bot",
      icon: BotIcon,
      isActive: true,
      role: [Role.Staff, Role.Manager],
      items: [
        {
          title: "Quản lý phòng ban",
          icon: CompassIcon,
          isActive: false,
          role: [Role.Manager],
          url: "/dashboard/departments",
        },
        {
          title: "Quản lý nhân viên",
          icon: SquareTerminal,
          isActive: true,
          role: [Role.Manager],
          url: "/dashboard/users",

        },

        {
          title: "Cài đặt",
          icon: Settings,
          isActive: true,
          role: [Role.Manager],
          url: "/dashboard/users",


        },
      ]
    },

  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
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
        <div className="flex-1 overflow-y-auto">
          <SideChat />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
