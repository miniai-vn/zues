import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "./component/ChatSidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-full">
        <ChatSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </SidebarProvider>
  );
}
