import { Bell, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { PageHeader } from "./page-header";
import { useTranslations } from "@/hooks/useTranslations";
import { useEffect, useState } from "react";

interface DashboardHeaderProps {
  title?: string;
}

const DashboardHeader = ({ title = "" }: DashboardHeaderProps) => {
  const { t } = useTranslations();
  const [breadcrumbs, setBreadcrumbs] = useState<
    {
      label: string;
      href?: string;
      isCurrentPage?: boolean;
    }[]
  >([]);
  useEffect(() => {
    if (title === "employees") {
      setBreadcrumbs([
        {
          label: t("dashboard.users.breadcrumbs.management"),
          href: "/dashboard/users",
        },
        {
          label: t("dashboard.users.breadcrumbs.userManagement"),
          isCurrentPage: true,
        },
      ]);
    }
  }, [title]);
  return (
    <header className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 px-4 py-1">
      <div className="flex items-center justify-between">
        <PageHeader
          backButtonHref="/dashboard"
          breadcrumbs={breadcrumbs.length > 0 ? breadcrumbs : []}
        />

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-full">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>{"M"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
