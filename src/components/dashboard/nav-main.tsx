"use client";

import {
  ChartArea,
  ChevronRight,
  MessageCircleMore,
  PlusCircle,
  type LucideIcon,
} from "lucide-react";
import React, { useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useAuth, useUserStore } from "@/hooks/data/useAuth";
import { Button } from "../ui/button";
import { SideChat } from "@/app/dashboard/bot/components/SideChat";

// Type definitions for better maintainability
type SubMenuItem = {
  title: string;
  url?: string;
  role: string[];
  isActive?: boolean; // Add isActive property to track active state
};

type MenuItem = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  role: string[];
  items?: SubMenuItem[];
  children?: React.ReactNode;
};

export default function NavMain({ items }: { items: MenuItem[] }) {
  const router = useRouter();
  const { user } = useUserStore();
  const { loadUserFromLocalStorage } = useAuth();

  useEffect(() => {
    if (!user) {
      loadUserFromLocalStorage();
    }
  }, [user, loadUserFromLocalStorage]);

  if (!user) return null;
  const filteredItems = items?.filter((item) => {
    const userRolesSet = new Set(user.roles.map((role) => role.name));
    return item.role.some((role) => userRolesSet.has(role));
  });

  // Helper function to render sub-items
  const renderSubItems = (
    subItems?: SubMenuItem[],
    children?: React.ReactNode
  ) => {
    if (children) return children;
    if (!subItems?.length) return null;
    return subItems
      .filter((item) => {
        const userRolesSet = new Set(user.roles.map((role) => role.name));
        return item.role.some((role) => userRolesSet.has(role));
      })
      .map((subItem) => (
        <SidebarMenuSubItem key={subItem.title}>
          <SidebarMenuSubButton
            asChild
            onClick={() => {
              if (subItem.url) {
                router.push(subItem.url);
              }
            }}
            data-active={subItem.isActive}
            className={subItem.isActive ? "bg-accent" : ""}
          >
            <a href={subItem.url}>
              <span>{subItem.title}</span>
            </a>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      ));
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            className="w-full"
            onClick={() => {
              router.push("/dashboard/bot");
            }}
          >
            <PlusCircle /> Tạo đoạn chat mới
          </SidebarMenuButton>
        </SidebarMenuItem>

        {filteredItems.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  onClick={() => {
                    if (item.url) {
                      router.push(item.url);
                    }
                  }}
                  tooltip={item.title}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  {(item.items ?? []).length > 0 && (
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {renderSubItems(item.items, item.children)}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton
            className="w-full"
            onClick={() => {
              router.push("/dashboard/bot");
            }}
          >
            <MessageCircleMore /> Lịch sử trò chuyện
          </SidebarMenuButton>
          <SideChat />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
