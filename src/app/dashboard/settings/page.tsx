"use client";

import { PageHeader } from "@/components/dashboard/common/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedRoute, { Role } from "@/configs/protect-route";
import DomainComponent from "./components/domain";
import WhiteLabelComponent from "./components/whitelabel";
import LinkDataSourceComponent from "./components/link";
export default function SettingPage() {
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
              label: "Tùy chỉnh",
              isCurrentPage: true,
            },
          ]}
        />
        <div className="w-full">
          <Tabs defaultValue="domain">
            <TabsList className="w-full p-1 rounded-lg mb-4">
              <TabsTrigger value="domain" className="rounded-full flex-1">
                Tùy chỉnh tên miền
              </TabsTrigger>
              <TabsTrigger value="interface" className="rounded-full flex-1">
                Tùy chỉnh thông tin
              </TabsTrigger>
              <TabsTrigger value="link" className="rounded-full flex-1">
                Quản lý liên kết dữ liệu
              </TabsTrigger>
            </TabsList>

            <TabsContent value="domain">
              <DomainComponent />
            </TabsContent>

            <TabsContent value="interface">
              <WhiteLabelComponent />
            </TabsContent>

            <TabsContent value="link">
              <LinkDataSourceComponent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
