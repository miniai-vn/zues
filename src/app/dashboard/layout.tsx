import AuthShield from "@/components/auth/AuthShield";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className={cn("w-full", "h-screen")}>
        <AuthShield>{children}</AuthShield>
      </SidebarInset>
    </SidebarProvider>
  );
}
