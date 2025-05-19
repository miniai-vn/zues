"use client";

import { PageHeader } from "@/components/dashboard/common/page-header";
import ProtectedRoute, { Role } from "@/configs/protect-route";
import useDomain from "@/hooks/data/useDomain";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import DomainComponent from "./components/domain";
import WhiteLabelComponent from "./components/whitelabel";
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
            <TabsList className="w-full bg-gray-50 p-1 rounded-lg mb-4">
              <TabsTrigger value="domain" className="rounded-full flex-1">
                Tùy chỉnh tên miền
              </TabsTrigger>
              <TabsTrigger value="interface" className="rounded-full flex-1">
                Tùy chỉnh thông tin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="domain">
                <DomainComponent />
            </TabsContent>

            <TabsContent value="interface">
              <WhiteLabelComponent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
