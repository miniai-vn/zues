"use client";

import { SideChat } from "@/app/dashboard/chat/components/SideChat";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import useTranslations from "@/hooks/useTranslations";
import { ChevronRight, MessageCircleMore, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";

// Type definitions for better maintainability
type SubMenuItem = {
  title: string;
  titleKey?: string; // Translation key for the title
  icon?: LucideIcon;
  url?: string;
  role: string[];
  isActive?: boolean; // Add isActive property to track active state
};

type MenuItem = {
  title: string;
  titleKey?: string; // Translation key for the title
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  role: string[];
  items?: SubMenuItem[];
  children?: React.ReactNode;
};

export default function NavMain({
  items,
  setActiveSection,
}: {
  items: MenuItem[];
  setActiveSection: (section: string) => void;
}) {
  const router = useRouter();
  const { t } = useTranslations();

  // if (!user) return null;
  // const filteredItems = items?.filter((item) => {
  //   const userRolesSet = new Set(user.roles.map((role) => role.name));
  //   return item.role.some((role) => userRolesSet.has(role));
  // });
  const renderSubItems = (subItems?: SubMenuItem[]) => {
    if (!subItems?.length) return null;
    return subItems.map((subItem) => (
      <SidebarMenuSubItem key={subItem.title}>
        <SidebarMenuSubButton
          asChild
          onClick={(e) => {
            e.preventDefault();
            setActiveSection(subItem.title);
            if (subItem.url) {
              router.push(subItem.url);
            }
          }}
          data-active={subItem.isActive}
          className={subItem.isActive ? "bg-accent" : ""}
        >
          <a href={subItem.url}>
            {subItem.icon && <subItem.icon />}
            <span>
              {subItem.titleKey ? t(subItem.titleKey) : subItem.title}
            </span>
          </a>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    ));
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm font-medium text-gray-900">
        {t("dashboard.sidebar.platform")}
      </SidebarGroupLabel>
      <SidebarGroupContent></SidebarGroupContent>
      <SidebarMenu>
        {/* <SidebarMenuItem>
          <SidebarMenuButton
            className="w-full"
            onClick={() => {
              router.push("/dashboard/chat");
            }}
          >
            <MessageSquarePlus className="h-5 w-5" />
            <span>{t("dashboard.sidebar.createNewChat")}</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
        {items.map((item) => (
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
                    setActiveSection(item.title);
                    if (item.url) {
                      router.push(item.url);
                    }
                  }}
                  tooltip={item.titleKey ? t(item.titleKey) : item.title}
                  data-active={item.isActive}
                  className={
                    item.isActive
                      ? "bg-accent text-accent-foreground font-semibold"
                      : ""
                  }
                >
                  {item.icon && <item.icon />}
                  <span>{item.titleKey ? t(item.titleKey) : item.title}</span>
                  {(item.items ?? []).length > 0 && (
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>{renderSubItems(item.items)}</SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton
            className="w-full mt-2"
            onClick={() => {
              setActiveSection(t("dashboard.sidebar.chatHistory"));
              router.push("/dashboard/chat");
            }}
          >
            <MessageCircleMore /> {t("dashboard.sidebar.chatHistory")}
          </SidebarMenuButton>
          <SideChat />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
