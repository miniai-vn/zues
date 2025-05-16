"use client";
import { PageHeader } from "@/components/dashboard/common/page-header";
import { SectionCards } from "@/components/dashboard/section-cards";
import ProtectedRoute, { Role } from "@/configs/protect-route";

export default function ReportPage() {
  return (
    <ProtectedRoute requiredRole={[Role.Admin]}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <PageHeader
          backButtonHref="/dashboard"
          breadcrumbs={[
            {
              label: "Quản lý",
              href: "/dashboard/users",
            },
            {
              label: "Báo cáo",
              isCurrentPage: true,
            },
          ]}
        />
        <SectionCards />
      </div>
    </ProtectedRoute>
  );
}
