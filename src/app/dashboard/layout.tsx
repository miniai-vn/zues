"use client";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/common";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useState } from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState("employees");

  return (
    <SidebarProvider>
      <AppSidebar setActiveSection={setActiveSection} />
      <SidebarInset className={cn("w-full", "h-screen")}>
        <DashboardHeader title={activeSection} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
