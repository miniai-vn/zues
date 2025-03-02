"use client";

import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  SquareTerminal,
} from "lucide-react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Role } from "@/configs/protect-route";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

// This is sample data.
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
      title: "Commom",
      url: "/dashboard/meterials",
      icon: SquareTerminal,
      isActive: true,
      role: [Role.Manager, Role.Staff],
      items: [
        {
          title: "Bot",
          url: "/dashboard/bot",
          icon: SquareTerminal,
          isActive: true,
          role: [Role.Staff, Role.Manager],
        },
      ],
    },
    {
      title: "Data source",
      url: "/dashboard/material-items",
      icon: SquareTerminal,
      isActive: true,
      role: [Role.Manager],
      items: [
        {
          title: "Links",
          url: "/dashboard/link",
          icon: SquareTerminal,
          isActive: true,
          role: [Role.Manager],
        },
        {
          title: "Files",
          url: "/dashboard/file",
          icon: SquareTerminal,
          isActive: true,
          role: [Role.Manager],
        },
        {
          title: "FAQs",
          url: "/dashboard/faqs",
          icon: SquareTerminal,
          isActive: true,
          role: [Role.Manager],
        },
      ],
    },
    {
      title: "Manager",
      url: "/dashboard/material-items",
      icon: SquareTerminal,
      isActive: true,
      role: [Role.Manager],
      items: [
        {
          title: "Users",
          url: "/dashboard/users",
          icon: SquareTerminal,
          isActive: true,
          role: [Role.Manager],
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>{/* <TeamSwitcher teams={data.teams} /> */}</SidebarHeader>
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
