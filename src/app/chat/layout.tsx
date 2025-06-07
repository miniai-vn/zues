import { SidebarProvider } from "@/components/ui/sidebar";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {children}
      </div>
    </SidebarProvider>
  );
}