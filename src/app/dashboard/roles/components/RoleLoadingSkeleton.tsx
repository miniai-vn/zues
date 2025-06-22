"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield } from "lucide-react";

export const RoleLoadingSkeleton = () => {
  return (
    <div className="flex flex-1 flex-col p-4 pt-0 h-screen">
      <Card className="flex flex-col flex-1 overflow-hidden">
        <CardHeader className="px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <Skeleton className="h-6 w-48" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-96 mt-2" />
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 min-h-0 space-y-4">
          <div className="flex-shrink-0">
            <div className="flex items-end justify-between gap-4">
              <div className="flex gap-4 flex-1">
                <div className="space-y-2 min-w-[200px]">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="space-y-2 min-w-[150px]">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Skeleton className="h-9 w-10" />
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="rounded-md border">
              <div className="p-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 py-3">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
