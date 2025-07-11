"use client";

import { Button } from "@/components/ui/button";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FolderOpen } from "lucide-react";
import useTranslations from "@/hooks/useTranslations";
import { CreateOrUpdateResource } from "../documents/components/CreateOrUpdateResource";

interface DepartmentHeaderProps {
  viewMode: "table" | "tree";
  setViewMode: (mode: "table" | "tree") => void;
  onHandleUploadFile: (file: File, description: string, type: string) => Promise<void>;
}

export const DepartmentHeader = ({
  viewMode,
  setViewMode,
  onHandleUploadFile,
}: DepartmentHeaderProps) => {
  const { t } = useTranslations();

  return (
    <CardHeader className="px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            {t("dashboard.departments.detail.documentManagement")}
          </CardTitle>
          <CardDescription>
            {t("dashboard.departments.detail.documents")}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            Table
          </Button>
          <Button
            variant={viewMode === "tree" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("tree")}
          >
            Tree
          </Button>
          <CreateOrUpdateResource
            type="document"
            onHandleUploadFile={onHandleUploadFile}
            resource={undefined}
          />
        </div>
      </div>
    </CardHeader>
  );
};
