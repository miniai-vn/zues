import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

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
    <div className={`z-10  gap-2  ${className}`}>
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
      {title && <span className="text-xl py-4 font-semibold">{title}</span>}
    </div>
  );
}
