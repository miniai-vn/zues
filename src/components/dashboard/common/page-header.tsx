import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface PageHeaderProps {
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
  showBackButton?: boolean;
  backButtonHref?: string;
  onBackButtonClick?: () => void;
}

export function PageHeader({
  title,
  breadcrumbs = [],
  actions,
  className = "",
  showBackButton = false,
  backButtonHref,
  onBackButtonClick,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackButtonClick) {
      onBackButtonClick();
    } else if (backButtonHref) {
      router.push(backButtonHref);
    } else {
      router.back();
    }
  };

  return (
    <div
      className={`sticky top-0 z-10 py-4 flex items-center justify-between gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b ${className}`}
    >
      {title && <h6 className="text-xl py-4 font-semibold">{title}</h6>}
      <div className="flex items-center gap-2">
        {showBackButton ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
            className=" h-5 w-5"
            aria-label="Quay lại"
          >
            <ChevronLeft />
          </Button>
        ) : (
          <SidebarTrigger className="h-5 w-5" aria-label="Mở menu" />
        )}

        <Separator orientation="vertical" className="mr-2 h-4" />

        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                  <BreadcrumbItem className="hidden md:block">
                    {item.isCurrentPage ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href || "#"}>
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
