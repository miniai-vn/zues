"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  FileText,
  MoreHorizontal,
  Power,
  Trash2,
  Upload,
} from "lucide-react";
import useTranslations from "@/hooks/useTranslations";
import { Resource } from "@/hooks/data/useResource";
import { CreateOrUpdateResource } from "../documents/components/CreateOrUpdateResource";

interface ResourceActionsProps {
  resource: Resource;
  onHandleUploadFile: (file: File, description: string, type: string) => Promise<void>;
  onViewResource: (resource: Resource) => void;
  onToggleResourceStatus: (resource: Resource) => void;
  onReEtl: (documentId: string) => void;
  onDeleteResource: (documentId: string) => void;
}

export const ResourceActions = ({
  resource,
  onHandleUploadFile,
  onViewResource,
  onToggleResourceStatus,
  onReEtl,
  onDeleteResource,
}: ResourceActionsProps) => {
  const { t } = useTranslations();
  const documentId = resource.id as unknown as string;

  return (
    <div className="flex items-center justify-center w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            aria-label={t("common.actions")}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <CreateOrUpdateResource
            type="document"
            onHandleUploadFile={onHandleUploadFile}
            resource={resource}
            trigger={
              <DropdownMenuItem className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {t("dashboard.departments.detail.uploadNewDocument")}
              </DropdownMenuItem>
            }
          />
          <DropdownMenuItem
            onClick={() => onViewResource(resource)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {t("dashboard.departments.detail.viewResource")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onToggleResourceStatus(resource)}
            className="flex items-center gap-2"
          >
            <Power className="h-4 w-4" />
            {resource.status === "active"
              ? t("dashboard.departments.detail.disableResource")
              : t("dashboard.departments.detail.enableResource")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onReEtl(documentId)}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            {t("dashboard.departments.detail.reprocessDocument")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDeleteResource(documentId)}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            {t("dashboard.departments.detail.deleteDocument")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
