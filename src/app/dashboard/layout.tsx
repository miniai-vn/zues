"use client";
import AuthShield from "@/components/auth/AuthShield";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import DashboardHeader from "@/components/dashboard/common/dashboardHeader";
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
        <main>
          <AuthShield>{children}</AuthShield>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
